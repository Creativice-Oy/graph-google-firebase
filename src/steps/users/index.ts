import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  IntegrationWarnEventName,
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
  logger,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = new CloudAssetClient(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.PROJECT._type },
    async (projectEntity) => {
      try {
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
              const userNameParts = user.split(':');
              if (userNameParts.length < 2) {
                continue;
              }

              if (!jobState.hasKey(getUserKey(user))) {
                const userEntity = await jobState.addEntity(
                  createUserEntity(userNameParts[1]),
                );

                await jobState.addRelationship(
                  createProjectUserRelationship(projectEntity, userEntity),
                );
              }
            }
          },
        );
      } catch (err) {
        if (err.code === 'PROVIDER_AUTHORIZATION_ERROR')
          logger.publishWarnEvent({
            name: IntegrationWarnEventName.MissingPermission,
            description: `"cloudasset.assets.searchAllIamPolicies" is not a required permission to run the Firebase integration, but is required for step "fetch-users"`,
          });
      }
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
