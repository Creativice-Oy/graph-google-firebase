import {
  createMockExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { integrationConfig } from '../test/config';
import { setupProjectRecording } from '../test/recording';
import { IntegrationConfig, validateInvocation } from './config';
import { ParsedServiceAccountKeyFile } from './utils/parseServiceAccountKeyFile';

describe('#validateInvocation', () => {
  let recording: Recording;

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  test('requires valid config', async () => {
    const executionContext = createMockExecutionContext<IntegrationConfig>({
      instanceConfig: {} as IntegrationConfig,
    });

    await expect(validateInvocation(executionContext)).rejects.toThrow(
      'Config requires all of {serviceAccountKeyConfig}',
    );
  });

  /**
   * Testing a successful authorization can be done with recordings
   */
  test.skip('successfully validates invocation', async () => {
    recording = setupProjectRecording({
      directory: __dirname,
      name: 'validate-invocation',
    });

    // Pass integrationConfig to authenticate with real credentials
    const executionContext = createMockExecutionContext({
      instanceConfig: integrationConfig,
    });

    // successful validateInvocation doesn't throw errors and will be undefined
    await expect(validateInvocation(executionContext)).resolves.toBeUndefined();
  });

  /* Adding `describe` blocks segments the tests into logical sections
   * and makes the output of `yarn test --verbose` provide meaningful
   * to project information to future maintainers.
   */
  describe('fails validating invocation', () => {
    /**
     * Testing failing authorizations can be done with recordings as well.
     * For each possible failure case, a test can be made to ensure that
     * error messaging is expected and clear to end-users
     */
    describe('invalid user credentials', () => {
      test.skip('should throw if clientSecret is invalid', async () => {
        recording = setupProjectRecording({
          directory: __dirname,
          name: 'client-secret-auth-error',
          options: {
            recordFailedRequests: true,
          },
        });

        const executionContext = createMockExecutionContext({
          instanceConfig: {
            serviceAccountKeyFile:
              '{"type": "service_account","project_id": "INVALID","private_key_id": "INVALID","private_key": "-----BEGIN PRIVATE KEY-----\nINVALID\n-----END PRIVATE KEY-----\n","client_email": "INVALID@INVALID.iam.gserviceaccount.com","client_id": "INVALID","auth_uri": "https://accounts.google.com/o/oauth2/auth","token_uri": "INVALID","auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url": "INVALID.iam.gserviceaccount.com"}',
            serviceAccountKeyConfig: {
              type: 'service_account',
              project_id: 'INVALID',
              private_key_id: 'INVALID',
              private_key: 'INVALID',
              client_email: 'INVALID',
              client_id: 'INVALID',
              auth_uri: 'INVALID',
              token_uri: 'INVALID',
              auth_provider_x509_cert_url: 'INVALID',
              client_x509_cert_url: 'INVALID',
            } as ParsedServiceAccountKeyFile,
            googleApplicationCredentials: '/INVALID',
          },
        });

        await expect(validateInvocation(executionContext)).rejects.toThrow(
          `Provider authentication failed: 401 Unauthorized`,
        );
      });
    });
  });
});
