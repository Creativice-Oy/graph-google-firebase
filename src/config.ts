import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
import { Client } from './google-cloud/client';
import { parseServiceAccountKeyFile } from './utils/parseServiceAccountKeyFile';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  serviceAccountKeyFile: {
    type: 'string',
  },
  googleApplicationCredentials: {
    type: 'string',
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  serviceAccountKeyFile: string;
  googleApplicationCredentials: string;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;

  if (!config.serviceAccountKeyFile) {
    throw new IntegrationValidationError(
      'Config requires all of { serviceAccountKeyFile, googleApplicationCredentials }',
    );
  }

  const apiClient = new Client({
    serviceAccountKeyFile: config.serviceAccountKeyFile,
    serviceAccountKeyConfig: parseServiceAccountKeyFile(
      config.serviceAccountKeyFile,
    ),
    googleApplicationCredentials: config.googleApplicationCredentials,
  });
  await apiClient.verifyAuthentication();
}
