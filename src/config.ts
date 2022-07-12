import {
  IntegrationExecutionContext,
  IntegrationValidationError,
  IntegrationInstanceConfigFieldMap,
  IntegrationInstanceConfig,
} from '@jupiterone/integration-sdk-core';
// import { Client } from './client';
import { ParsedServiceAccountKeyFile } from './utils/parseServiceAccountKeyFile';

export const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  serviceAccountKeyFile: {
    type: 'string',
  },
};

export interface IntegrationConfig extends IntegrationInstanceConfig {
  serviceAccountKeyFile: ParsedServiceAccountKeyFile;
}

export async function validateInvocation(
  context: IntegrationExecutionContext<IntegrationConfig>,
) {
  const { config } = context.instance;
  console.log('config', config);

  if (!config.serviceAccountKeyFile) {
    throw new IntegrationValidationError(
      'Config requires all of {serviceAccountKeyFile}',
    );
  }

  // const apiClient = new Client(config);
  // await apiClient.verifyAuthentication();
}
