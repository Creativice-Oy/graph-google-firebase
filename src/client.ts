import { google, firebase_v1beta1, identitytoolkit_v3 } from 'googleapis';
import { CredentialBody } from 'google-auth-library';
import {
  GoogleAuth,
  JSONClient,
} from 'googleapis-common/node_modules/google-auth-library/build/src/auth/googleauth';
// import { Compute } from 'googleapis-common/node_modules/google-auth-library/build/src/auth/computeclient';
import { GaxiosResponse } from 'gaxios';
import {
  IntegrationProviderAuthorizationError,
  IntegrationProviderAPIError,
  IntegrationError,
} from '@jupiterone/integration-sdk-core';
import { createErrorProps } from './utils/createErrorProps';
import { IntegrationConfig } from './config';
import { retry } from '@lifeomic/attempt';

export interface PageableResponse {
  nextPageToken?: string;
}

export type PageableGaxiosResponse<T> = GaxiosResponse<
  T & {
    nextPageToken?: string | null | undefined;
  }
>;

export type IterateApiOptions = {
  onRetry?: (err: any) => void;
};

export async function iterateApi<T>(
  fn: (nextPageToken?: string) => Promise<PageableGaxiosResponse<T>>,
  callback: (data: T) => Promise<void>,
  options?: IterateApiOptions,
) {
  let nextPageToken: string | undefined;

  do {
    const wrappedFn = withErrorHandling(fn, options);
    const result = await wrappedFn(nextPageToken);
    nextPageToken = result.data.nextPageToken || undefined;
    await callback(result.data);
  } while (nextPageToken);
}

export class Client {
  constructor(
    readonly config: IntegrationConfig,
    onRetry?: (err: any) => void,
  ) {
    this.credentials = {
      client_email: config.serviceAccountKeyConfig.client_email,
      private_key: config.serviceAccountKeyConfig.private_key,
    };
    this.onRetry = onRetry;
  }

  private pageSize = 1;
  private credentials: CredentialBody;
  private readonly onRetry?: (err: any) => void;

  private authenticateClient(): GoogleAuth<JSONClient> {
    const auth = new google.auth.GoogleAuth({
      credentials: this.credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });
    return auth;
  }

  private async iterateApi<T>(
    fn: (nextPageToken?: string) => Promise<PageableGaxiosResponse<T>>,
    callback: (data: T) => Promise<void>,
  ) {
    return iterateApi(fn, callback, {
      onRetry: this.onRetry,
    });
  }

  public async verifyAuthentication(): Promise<void> {
    const auth = await this.authenticateClient();
    const authClient = await auth.getClient();
    google.options({ auth: authClient });

    try {
      await auth.getProjectId();
    } catch (err) {
      throw new IntegrationProviderAuthorizationError({
        cause: err,
        endpoint: 'https://localhost/api/v1/some/endpoint?limit=1',
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  public async iterateProjects(
    callback: (data: firebase_v1beta1.Schema$FirebaseProject) => Promise<void>,
  ): Promise<void> {
    const auth = await this.authenticateClient();
    const authClient = await auth.getClient();
    google.options({ auth: authClient });
    const firebase = google.firebase('v1beta1');

    await this.iterateApi(
      async (nextPageToken) => {
        return firebase.projects.list({
          pageSize: this.pageSize,
          pageToken: nextPageToken,
        });
      },
      async (data: firebase_v1beta1.Schema$ListFirebaseProjectsResponse) => {
        for (const project of data.results || []) {
          await callback(project);
        }
      },
    );
  }

  public async iterateUsers(
    projectId: string,
    callback: (data: identitytoolkit_v3.Schema$UserInfo) => Promise<void>,
  ): Promise<void> {
    const auth = await this.authenticateClient();
    const authClient = await auth.getClient();
    google.options({ auth: authClient });
    const identitytoolkit = google.identitytoolkit('v3');

    await this.iterateApi(
      async (nextPageToken) => {
        return identitytoolkit.relyingparty.downloadAccount({
          requestBody: {
            maxResults: this.pageSize,
            targetProjectId: projectId,
            nextPageToken: nextPageToken,
          },
        });
      },
      async (data: identitytoolkit_v3.Schema$DownloadAccountResponse) => {
        for (const project of data.users || []) {
          await callback(project);
        }
      },
    );
  }
}

export type WithErrorHandlingOptions = {
  onRetry?: (err: any) => void;
};

export function withErrorHandling<T extends (...params: any) => any>(
  fn: T,
  options?: WithErrorHandlingOptions,
) {
  return async (...params: any) => {
    return retry(
      async () => {
        return await fn(...params);
      },
      {
        delay: 2_000,
        timeout: 91_000, // Need to set a timeout, otherwise we might wait for a response indefinitely.
        maxAttempts: 6,
        factor: 2.25, //t=0s, 2s, 4.5s, 10.125s, 22.78125s, 51.2578125 (90.6640652s)
        handleError(err, ctx) {
          const newError = handleApiClientError(err);

          if (!newError.retryable) {
            ctx.abort();
            throw newError;
          } else if (options?.onRetry) {
            options.onRetry(err);
          }
        },
      },
    );
  };
}

/**
 * Codes unknown error into JupiterOne errors
 */
function handleApiClientError(error: any) {
  // If the error was already handled, forward it on
  if (error instanceof IntegrationError) {
    return error;
  }

  let err;
  const errorProps = createErrorProps(error);
  const code = error.response?.status;

  // Per these two sets of docs, and depending on the api, gcloud
  // will return a 403 or 429 error to signify rate limiting:
  // https://cloud.google.com/compute/docs/api-rate-limits
  // https://cloud.google.com/resource-manager/docs/core_errors
  if (code == 403) {
    err = new IntegrationProviderAuthorizationError(errorProps);

    if (
      error.message?.match &&
      // GCP responds with a 403 when an API quota has been exceeded. We should
      // retry this case.
      error.message.match(/Quota exceeded/i)
    ) {
      (err as any).retryable = true;
    }
  } else if (
    code == 400 &&
    error.message?.match &&
    error.message.match(/billing/i)
  ) {
    err = new IntegrationProviderAuthorizationError(errorProps);
  } else if (code === 429 || code >= 500) {
    err = new IntegrationProviderAPIError(errorProps);
    (err as any).retryable = true;
  } else {
    err = new IntegrationProviderAPIError(errorProps);
  }

  if (shouldKeepErrorMessage(error)) {
    err.message = error.message;
  }

  return err;
}

function shouldKeepErrorMessage(error: any) {
  const errorMessagesToKeep = [
    'billing is disabled',
    'requires billing to be enabled',
    'it is disabled',
    'is not a workspace',
  ];
  return (
    error?.message?.match &&
    error.message.match(createRegex(errorMessagesToKeep))
  );
}

function createRegex(regexes: string[]) {
  return new RegExp(regexes.map((regex) => '(' + regex + ')').join('|'), 'i');
}
