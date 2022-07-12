import {
  IntegrationExecutionContext,
  StepStartStates,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import { SerializedIntegrationConfig } from './types';
import { deserializeIntegrationConfig } from './utils/integrationConfig';
import { Steps } from './steps/constants';

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
  const { instance, logger } = context;
  const { config: serializedIntegrationConfig } = instance;

  validateInvocationConfig(context);

  // Override the incoming config with the new config that has parsed service
  // account data
  const config = (context.instance.config = deserializeIntegrationConfig(
    serializedIntegrationConfig,
  ));

  logger.info(
    {
      projectId: config.projectId,
      configureOrganizationProjects: config.configureOrganizationProjects,
      organizationId: config.organizationId,
      serviceAccountKeyEmail: config.serviceAccountKeyConfig.client_email,
      serviceAccountKeyProjectId: config.serviceAccountKeyConfig.project_id,
      folderId: config.folderId,
    },
    'Starting integration with config',
  );

  logger.publishEvent({
    name: 'integration_config',
    description: `Starting Google Cloud integration with service account (email=${
      config.serviceAccountKeyConfig.client_email
    }, configureOrganizationProjects=${!!config.configureOrganizationProjects})`,
  });

  // let enabledServiceNames: string[];
  // let serviceAccountProjectEnabledServiceNames: string[];
  // try {
  //   const enabledServiceData = await enablement.getEnabledServiceNames(config);
  //   enabledServiceNames = enabledServiceData.intersectedEnabledServices ?? [];
  //   serviceAccountProjectEnabledServiceNames =
  //     enabledServiceData.mainProjectEnabledServices ?? [];
  // } catch (err) {
  //   // NOTE: The `IntegrationValidationError` function does not currently support
  //   // a `cause` to be passed. We should update that.
  //   logger.warn({ err }, 'Error listing enabled service names');

  //   throw new IntegrationValidationError(
  //     `Failed to fetch enabled service names. Ability to list services is required to run the Google Cloud integration. (error=${err.message})`,
  //   );
  // }

  // logger.info({ enabledServiceNames }, 'Services enabled for project');
  // logger.info(
  //   {
  //     mainProjectEnabledServiceNames: serviceAccountProjectEnabledServiceNames,
  //   },
  //   'Services enabled for the main project',
  // );

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
  };

  logger.info(
    { stepStartStates: JSON.stringify(stepStartStates) },
    'Step start states',
  );
  return stepStartStates;
}
