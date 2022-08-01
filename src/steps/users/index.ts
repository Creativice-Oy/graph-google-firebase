import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { CloudAssetClient } from './client';
import {
  createProjectUserRelationship,
  createUserEntity,
  getUserKey,
} from './converter';

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = new CloudAssetClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.PROJECT._type },
    async (projectEntity) => {
      await client.iterateAllIamPolicies(
        projectEntity.key as string,
        async (policy) => {
          const users: string[] =
            policy.policy?.bindings?.reduce((acc: string[], binding) => {
              const newUsersInBinding: string[] | undefined =
                binding.members?.filter((member) => member.includes('user'));
              return newUsersInBinding ? [...acc, ...newUsersInBinding] : acc;
            }, []) || [];

          for (const user of users) {
            if (!jobState.hasKey(getUserKey(user))) {
              const userEntity = await jobState.addEntity(
                createUserEntity(user),
              );

              await jobState.addRelationship(
                createProjectUserRelationship(projectEntity, userEntity),
              );
            }
          }
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
