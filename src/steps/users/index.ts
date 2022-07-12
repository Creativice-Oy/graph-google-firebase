import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { IdentityToolkitClient } from './client';
import { createUserEntity, createProjectUserRelationship } from './converter';

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = new IdentityToolkitClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.PROJECT._type },
    async (projectEntity) => {
      await client.iterateUsers(projectEntity.key as string, async (user) => {
        const userEntity = await jobState.addEntity(createUserEntity(user));
        await jobState.addRelationship(
          createProjectUserRelationship(projectEntity, userEntity),
        );
      });
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
