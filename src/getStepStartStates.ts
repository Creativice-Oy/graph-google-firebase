import {
  IntegrationExecutionContext,
  StepStartStates,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import { SerializedIntegrationConfig } from './types';
import { Steps } from './steps/constants';
import { deserializeIntegrationConfig } from './utils/integrationConfig';
import { serializedIntegrationConfig } from '../test/config';

function validateInvocationConfig(
  context: IntegrationExecutionContext<SerializedIntegrationConfig>,
) {
  const { instance } = context;
  const { config } = instance;

  if (!config.serviceAccountKeyFile) {
    throw new IntegrationValidationError(
      'Missing a required integration config value {serviceAccountKeyFile}',
    );
  }
}

export default async function getStepStartStates(
  context: IntegrationExecutionContext<SerializedIntegrationConfig>,
): Promise<StepStartStates> {
  const { logger } = context;

  context.instance.config = deserializeIntegrationConfig(
    serializedIntegrationConfig,
  );

  // Override the incoming config with the new config that has parsed service
  // account data
  validateInvocationConfig(context);

  const stepStartStates: StepStartStates = {
    [Steps.ACCOUNT]: {
      disabled: false,
    },
    [Steps.PROJECTS]: {
      disabled: false,
    },
    [Steps.USERS]: {
      disabled: false,
    },
    [Steps.WEB_APPS]: {
      disabled: false,
    },
  };

  logger.info(
    { stepStartStates: JSON.stringify(stepStartStates) },
    'Step start states',
  );
  return Promise.resolve(stepStartStates);
}
