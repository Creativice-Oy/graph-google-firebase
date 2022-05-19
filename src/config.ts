import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { Client } from './client';
import { ParsedServiceAccountKeyFile } from './utils/parseServiceAccountKeyFile';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  type: {
    type: 'string',
  },
  project_id: {
    type: 'string',
  },
  private_key_id: {
    type: 'string',
    mask: true,
  },
  private_key: {
    type: 'string',
    mask: true,
  },
  client_email: {
    type: 'string',
    mask: true,
  },
  client_id: {
    type: 'string',
  },
  auth_uri: {
    type: 'string',
  },
  token_uri: {
    type: 'string',
  },
  auth_provider_x509_cert_url: {
    type: 'string',
  },
  client_x509_cert_url: {
    type: 'string',
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  serviceAccountKeyConfig: ParsedServiceAccountKeyFile;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!config.serviceAccountKeyConfig) {
    throw new IntegrationValidationError(
      'Config requires all of {serviceAccountKeyConfig}',
    );
  }

  const apiClient = new Client(config);
  await apiClient.verifyAuthentication();
}
