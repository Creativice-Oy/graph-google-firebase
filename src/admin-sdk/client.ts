import { retry } from '@lifeomic/attempt';
import {
  IntegrationError,
  IntegrationProviderAPIError,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';
import { createErrorProps } from './utils/createErrorProps';
import { getAuth } from 'firebase-admin/auth';

export class Client {
  private readonly onRetry?: (err: any) => void;

  constructor(onRetry?: (err: any) => void) {
    this.onRetry = onRetry;
  }

  async iterateApi<T>(
    fn: (nextPageToken?: string) => Promise<T>,
    callback: (data: T) => Promise<void>,
  ) {
    return iterateApi(fn, callback, {
      onRetry: this.onRetry,
    });
  }

  getAuth() {
    return getAuth();
  }
}

export type IterateApiOptions = {
  onRetry?: (err: any) => void;
};

export async function iterateApi<T>(
  fn: (nextPageToken?: string) => Promise<T>,
  callback: (data: T) => Promise<void>,
  options?: IterateApiOptions,
) {
  let nextPageToken: string | undefined;

  do {
    const wrappedFn = withErrorHandling(fn, options);
    const result = await wrappedFn(nextPageToken);
    nextPageToken = result.nextPageToken || undefined;
    await callback(result);
  } while (nextPageToken);
}

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

export type WithErrorHandlingOptions = {
  onRetry?: (err: any) => void;
};

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
