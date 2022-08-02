import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { FirebaseClient } from './client';
import {
  createWebAppEntity,
  createWebappProjectRelationship,
} from './converter';

export async function fetchWebApps({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = new FirebaseClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.PROJECT._type },
    async (projectEntity) => {
      await client.iterateWebApps(
        projectEntity.name as string,
        async (webApp) => {
          const webAppEntity = await jobState.addEntity(
            createWebAppEntity(webApp),
          );

          await jobState.addRelationship(
            createWebappProjectRelationship(webAppEntity, projectEntity),
          );
        },
      );
    },
  );
}

export const applicationSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.APPLICATIONS,
    name: 'Fetch Applications',
    entities: [Entities.WEBAPP],
    relationships: [Relationships.PROJECT_HAS_WEBAPP],
    dependsOn: [Steps.PROJECTS],
    executionHandler: fetchWebApps,
  },
];
