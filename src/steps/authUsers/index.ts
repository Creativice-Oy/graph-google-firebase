import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Entities, Relationships, Steps } from '../constants';
import { Auth } from './client';
import {
  createAuthUserEntity,
  createProjectAuthUserRelationship,
} from './converter';

export async function fetchAuthUsers({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = new Auth();

  await jobState.iterateEntities(
    { _type: Entities.PROJECT._type },
    async (projectEntity) => {
      await client.iterateAuthUsers(async (authUser) => {
        const authUserEntity = await jobState.addEntity(
          createAuthUserEntity(authUser),
        );

        await jobState.addRelationship(
          createProjectAuthUserRelationship(projectEntity, authUserEntity),
        );
      });
    },
  );
}

export const authUserSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.AUTH_USERS,
    name: 'Fetch Auth Users',
    entities: [Entities.AUTH_USER],
    relationships: [Relationships.PROJECT_HAS_AUTH_USER],
    dependsOn: [Steps.PROJECTS],
    executionHandler: fetchAuthUsers,
  },
];
