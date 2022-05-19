import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { Client } from '../../client';
import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { createUserEntity, createProjectUserRelationship } from './converter';

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = new Client(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.PROJECT._type },
    async (projectEntity) => {
      await apiClient.iterateUsers(
        projectEntity.key as string,
        async (user) => {
          const userEntity = await jobState.addEntity(createUserEntity(user));
          await jobState.addRelationship(
            createProjectUserRelationship(projectEntity, userEntity),
          );
        },
      );
    },
  );
}

export const userSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [Entities.USER],
    relationships: [Relationships.PROJECT_HAS_USER],
    dependsOn: [Steps.PROJECTS],
    executionHandler: fetchUsers,
  },
];
