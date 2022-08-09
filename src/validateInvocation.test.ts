import {
  createMockExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { integrationConfig } from '../test/config';
import { setupGoogleCloudRecording } from '../test/recording';
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
      'Config requires all of { serviceAccountKeyFile }',
    );
  });

  /**
   * Testing a successful authorization can be done with recordings
   */
  test.skip('successfully validates invocation', async () => {
    recording = setupGoogleCloudRecording({
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
        recording = setupGoogleCloudRecording({
          directory: __dirname,
          name: 'client-secret-auth-error',
          options: {
            recordFailedRequests: true,
          },
        });

        const executionContext = createMockExecutionContext({
          instanceConfig: {
            serviceAccountKeyFile:
              '{"type": "service_account","project_id": "INVALID","private_key_id": "INVALID","private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeojQFARUYcCFz\ngu6NsRX3wYmPEJ0wJUxn2vJUFrMcaaQzI1yZAmA2CINVALID5Mh4a1fWNE4pggzG\nEOqldN9NzgfWDyEXOuN+vOdH83OTDINVALIDY3LguTYfQWOUdGoMoxD1KQetNsC8\nz/T9UGazehMXZCXUOm9hLFd/INVALIDiqow+GJ6ZHRCP9a6aiZ+FAkGEw7keSp9/\noP9EdAz/E1xrjsEn0CaHhvvVriZYKpi6R5HjMdBH7AEXCK1qiXrjPF/UqT/3eaLo\nYj5EPyiHG8+4x6MGo/yQ7I44IxAuFoPCtSy2AjYfZ4SoM8C7We7pIoIgaraKjEIq\nfV8REdRxAgMBAAECggEAFMLDrhf7K8yZBCYRlGelqVwh5aBWAhQPkNP9vPWPkVte\nCvdIyhmef9QWqPHylsjJV8EsqLMFu7bydwWFwAuwod0h92jZetHRLigI2MjKymch\nhNAzgNdFFJYIuER1hNtLecXplTw+bfPpe4x30qINVALIDpNrw/+1zfDgrqZnr42x\nDmuHs2B5sgoTTjGsj0zsCK+snwc6i8Z/kuWJSOgj6IN9Ub6tM8BE7LYosFw0bEIM\nZC+iofKNjvL+pl7GEKWK9GB96/My5j9sYE8oiC8nPizEWsB4H2Y7HIWr8KRvWIgC\nry7MmBLum7dhvcHk2KRrALrbnkQhKp1BzaXcOZoDdQKBgQDcL+fYa3ZzhsD1DAfD\nknSFknHbB8pJ5DI4kz9+ofx4cDvUR0baquGzeP4KIsZkclqIQeHmclyCAthIh8wE\n1baLTGtgOdkMoh3adLJGXm3KqoetUNB70OHiPpL4AU6Vf/X2XfcSJFOtl4SoCjBT\n8S5QoTxUmifcLCuUfj/9sX1i8wKBgQC4b1kRwUHRsZJrUaModT/VKUhmScLL/ftK\nYKmbqby2S7Qbq3WReGFuSCM+F6Sbh7hYok1KNfgIaYisq17KcgiknX0mCOqPZh+A\ntQHQdZJYqI34VfkJi7UxjNtomSK9NfOQ6ORQoFIyA5p38DGcSmLn8IKvvo+EiRs2\nG4U5/bQcCwKBgQCCYMNxvMAYzBP5hbQbM99XME3GmihH9J1gLqCMRTKPxjVHDyV/\nWWvnr58NNWYwGB5PTGOM5u6r9S9IU1CVFE7Q0OFLyzUga+YtcqgVTtjIBo3sLEwm\n5Jq8Mr0nqO51S53C0gT4cxYxVeSw88eGDOuVxsNIfTdZAbaUaOVPPQe3zQKBgGVy\nWbu6YUnGMpN1RBls5L+LBZe92rf5687tfF1y76oV2eueU/zACldutnPg7VnfPTcD\njx/Sr6tw4QyY9nrEXpytQ7k4DkzyD0HsTiMriGPb0rtWDrWBcxjeMZFHKiSJGIAM\nmgj/Jjb8ZGq0Y5VkFSMe18NzPd3YzG7mlFFhi0AhAoGAK7b89Ei1tAEkNngLcpX8\nrs+X/VHBy1jJgbWlzngVWeDCBwrEanA6dQj+b+3k6ShFMu7q4OSACCTQDG4rXjOP\nQ1wlir/J0YdINR0EWm88eLGm9F+Zld67M2IIKc2yRdY9fHSMRu1aaYu+2zMe/spm\nea1GbFQYJXCoPiTU6aKDXBo=\n-----END PRIVATE KEY-----\n","client_email": "INVALID@INVALID.iam.gserviceaccount.com","client_id": "INVALID","auth_uri": "https://accounts.google.com/o/oauth2/auth","token_uri": "INVALID","auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url": "INVALID.iam.gserviceaccount.com"}',
            serviceAccountKeyConfig: {
              type: 'service_account',
              project_id: 'INVALID',
              private_key_id: 'c3INVALID78a3d2aad129b800c161INVALIDcdb6',
              private_key:
                '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeojQFARUYcCFz\ngu6NsRX3wYmPEJ0wJUxn2vJUFrMcaaQzI1yZAmA2CINVALID5Mh4a1fWNE4pggzG\nEOqldN9NzgfWDyEXOuN+vOdH83OTDINVALIDY3LguTYfQWOUdGoMoxD1KQetNsC8\nz/T9UGazehMXZCXUOm9hLFd/INVALIDiqow+GJ6ZHRCP9a6aiZ+FAkGEw7keSp9/\noP9EdAz/E1xrjsEn0CaHhvvVriZYKpi6R5HjMdBH7AEXCK1qiXrjPF/UqT/3eaLo\nYj5EPyiHG8+4x6MGo/yQ7I44IxAuFoPCtSy2AjYfZ4SoM8C7We7pIoIgaraKjEIq\nfV8REdRxAgMBAAECggEAFMLDrhf7K8yZBCYRlGelqVwh5aBWAhQPkNP9vPWPkVte\nCvdIyhmef9QWqPHylsjJV8EsqLMFu7bydwWFwAuwod0h92jZetHRLigI2MjKymch\nhNAzgNdFFJYIuER1hNtLecXplTw+bfPpe4x30qINVALIDpNrw/+1zfDgrqZnr42x\nDmuHs2B5sgoTTjGsj0zsCK+snwc6i8Z/kuWJSOgj6IN9Ub6tM8BE7LYosFw0bEIM\nZC+iofKNjvL+pl7GEKWK9GB96/My5j9sYE8oiC8nPizEWsB4H2Y7HIWr8KRvWIgC\nry7MmBLum7dhvcHk2KRrALrbnkQhKp1BzaXcOZoDdQKBgQDcL+fYa3ZzhsD1DAfD\nknSFknHbB8pJ5DI4kz9+ofx4cDvUR0baquGzeP4KIsZkclqIQeHmclyCAthIh8wE\n1baLTGtgOdkMoh3adLJGXm3KqoetUNB70OHiPpL4AU6Vf/X2XfcSJFOtl4SoCjBT\n8S5QoTxUmifcLCuUfj/9sX1i8wKBgQC4b1kRwUHRsZJrUaModT/VKUhmScLL/ftK\nYKmbqby2S7Qbq3WReGFuSCM+F6Sbh7hYok1KNfgIaYisq17KcgiknX0mCOqPZh+A\ntQHQdZJYqI34VfkJi7UxjNtomSK9NfOQ6ORQoFIyA5p38DGcSmLn8IKvvo+EiRs2\nG4U5/bQcCwKBgQCCYMNxvMAYzBP5hbQbM99XME3GmihH9J1gLqCMRTKPxjVHDyV/\nWWvnr58NNWYwGB5PTGOM5u6r9S9IU1CVFE7Q0OFLyzUga+YtcqgVTtjIBo3sLEwm\n5Jq8Mr0nqO51S53C0gT4cxYxVeSw88eGDOuVxsNIfTdZAbaUaOVPPQe3zQKBgGVy\nWbu6YUnGMpN1RBls5L+LBZe92rf5687tfF1y76oV2eueU/zACldutnPg7VnfPTcD\njx/Sr6tw4QyY9nrEXpytQ7k4DkzyD0HsTiMriGPb0rtWDrWBcxjeMZFHKiSJGIAM\nmgj/Jjb8ZGq0Y5VkFSMe18NzPd3YzG7mlFFhi0AhAoGAK7b89Ei1tAEkNngLcpX8\nrs+X/VHBy1jJgbWlzngVWeDCBwrEanA6dQj+b+3k6ShFMu7q4OSACCTQDG4rXjOP\nQ1wlir/J0YdINR0EWm88eLGm9F+Zld67M2IIKc2yRdY9fHSMRu1aaYu+2zMe/spm\nea1GbFQYJXCoPiTU6aKDXBo=\n-----END PRIVATE KEY-----\n',
              client_email: 'INVALID',
              client_id: 'INVALID',
              auth_uri: 'INVALID',
              token_uri: 'INVALID',
              auth_provider_x509_cert_url: 'INVALID',
              client_x509_cert_url: 'INVALID',
            } as ParsedServiceAccountKeyFile,
          },
        });

        await expect(validateInvocation(executionContext)).rejects.toThrow(
          `Provider authentication failed: 401 Unauthorized`,
        );
      });
    });
  });
});
