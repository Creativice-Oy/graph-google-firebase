import { IntegrationConfig, SerializedIntegrationConfig } from '../src/types';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ParsedServiceAccountKeyFile } from '../src/utils/parseServiceAccountKeyFile';
import { deserializeIntegrationConfig } from '../src/utils/integrationConfig';
import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import { invocationConfig } from '../src';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

export const DEFAULT_INTEGRATION_CONFIG_PROJECT_ID = 'j1-gc-integration-dev-v2';

// NOTE: This is a bogus certificate for tests. The Google Cloud SDK asserts
// that a certificate is valid.
export const DEFAULT_INTEGRATION_PRIVATE_KEY =
  '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCeojQFARUYcCFz\ngu6NsRX3wYmPEJ0wJUxn2vJUFrMcaaQzI1yZAmA2CoVUKFbv5Mh4a1fWNE4pggzG\nEOqldN9NzgfWDyEXOuN+vOdH83OTDh2MEJrCY3LguTYfQWOUdGoMoxD1KQetNsC8\nz/T9UGazehMXZCXUOm9hLFd/gpeA5d7iqow+GJ6ZHRCP9a6aiZ+FAkGEw7keSp9/\noP9EdAz/E1xrjsEn0CaHhvvVriZYKpi6R5HjMdBH7AEXCK1qiXrjPF/UqT/3eaLo\nYj5EPyiHG8+4x6MGo/yQ7I44IxAuFoPCtSy2AjYfZ4SoM8C7We7pIoIgaraKjEIq\nfV8REdRxAgMBAAECggEAFMLDrhf7K8yZBCYRlGelqVwh5aBWAhQPkNP9vPWPkVte\nCvdIyhmef9QWqPHylsjJV8EsqLMFu7bydwWFwAuwod0h92jZetHRLigI2MjKymch\nhNAzgNdFFJYIuER1hNtLecXplTw+bfPpe4x30qMwHbMPRpNrw/+1zfDgrqZnr42x\nDmuHs2B5sgoTTjGsj0zsCK+snwc6i8Z/kuWJSOgj6IN9Ub6tM8BE7LYosFw0bEIM\nZC+iofKNjvL+pl7GEKWK9GB96/My5j9sYE8oiC8nPizEWsB4H2Y7HIWr8KRvWIgC\nry7MmBLum7dhvcHk2KRrALrbnkQhKp1BzaXcOZoDdQKBgQDcL+fYa3ZzhsD1DAfD\nknSFknHbB8pJ5DI4kz9+ofx4cDvUR0baquGzeP4KIsZkclqIQeHmclyCAthIh8wE\n1baLTGtgOdkMoh3adLJGXm3KqoetUNB70OHiPpL4AU6Vf/X2XfcSJFOtl4SoCjBT\n8S5QoTxUmifcLCuUfj/9sX1i8wKBgQC4b1kRwUHRsZJrUaModT/VKUhmScLL/ftK\nYKmbqby2S7Qbq3WReGFuSCM+F6Sbh7hYok1KNfgIaYisq17KcgiknX0mCOqPZh+A\ntQHQdZJYqI34VfkJi7UxjNtomSK9NfOQ6ORQoFIyA5p38DGcSmLn8IKvvo+EiRs2\nG4U5/bQcCwKBgQCCYMNxvMAYzBP5hbQbM99XME3GmihH9J1gLqCMRTKPxjVHDyV/\nWWvnr58NNWYwGB5PTGOM5u6r9S9IU1CVFE7Q0OFLyzUga+YtcqgVTtjIBo3sLEwm\n5Jq8Mr0nqO51S53C0gT4cxYxVeSw88eGDOuVxsNIfTdZAbaUaOVPPQe3zQKBgGVy\nWbu6YUnGMpN1RBls5L+LBZe92rf5687tfF1y76oV2eueU/zACldutnPg7VnfPTcD\njx/Sr6tw4QyY9nrEXpytQ7k4DkzyD0HsTiMriGPb0rtWDrWBcxjeMZFHKiSJGIAM\nmgj/Jjb8ZGq0Y5VkFSMe18NzPd3YzG7mlFFhi0AhAoGAK7b89Ei1tAEkNngLcpX8\nrs+X/VHBy1jJgbWlzngVWeDCBwrEanA6dQj+b+3k6ShFMu7q4OSACCTQDG4rXjOP\nQ1wlir/J0YdINR0EWm88eLGm9F+Zld67M2IIKc2yRdY9fHSMRu1aaYu+2zMe/spm\nea1GbFQYJXCoPiTU6aKDXBo=\n-----END PRIVATE KEY-----\n';

export const DEFAULT_INTEGRATION_CLIENT_EMAIL =
  'j1-gc-integration-dev-sa@j1-gc-integration-dev.iam.gserviceaccount.com';

export const DEFAULT_INTEGRATION_CONFIG_SERVICE_ACCOUNT_KEY_FILE: ParsedServiceAccountKeyFile =
  {
    type: 'service_account',
    project_id: DEFAULT_INTEGRATION_CONFIG_PROJECT_ID,
    private_key_id: 'abcdef123456abcdef123456abcdef123456abc',
    private_key: DEFAULT_INTEGRATION_PRIVATE_KEY,
    client_email: DEFAULT_INTEGRATION_CLIENT_EMAIL,
    client_id: '12345678901234567890',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: 'https://www.googleapis.com/abc',
  };

export const serializedIntegrationConfig: SerializedIntegrationConfig = {
  serviceAccountKeyFile:
    process.env.SERVICE_ACCOUNT_KEY_FILE ||
    JSON.stringify(DEFAULT_INTEGRATION_CONFIG_SERVICE_ACCOUNT_KEY_FILE),
};

export const integrationConfig: IntegrationConfig =
  deserializeIntegrationConfig(serializedIntegrationConfig);

export const setupErrorIntegrationConfig: IntegrationConfig = {
  ...serializedIntegrationConfig,
  serviceAccountKeyConfig: {
    type: 'service_account',
    project_id: 'mknoedel-project-1',
    private_key_id: 'abcdef123456abcdef123456abcdef123456abc',
    private_key: DEFAULT_INTEGRATION_PRIVATE_KEY,
    client_email:
      'j1-gc-integration-dev-sa@mknoedel-project-1.iam.gserviceaccount.com',
    client_id: '106311430307184243261',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: 'https://www.googleapis.com/abc',
  },
};

export function getMockSerializedIntegrationConfig(): SerializedIntegrationConfig {
  return {
    serviceAccountKeyFile: JSON.stringify(
      DEFAULT_INTEGRATION_CONFIG_SERVICE_ACCOUNT_KEY_FILE,
    ),
    googleApplicationCredentials: '/INVALID',
  };
}

export function getMockIntegrationConfig(
  partial?: Partial<IntegrationConfig>,
): IntegrationConfig {
  return {
    ...deserializeIntegrationConfig(getMockSerializedIntegrationConfig()),
    ...partial,
  };
}

export function buildStepTestConfigForStep(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}
