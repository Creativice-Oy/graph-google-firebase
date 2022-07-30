import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Steps, Entities, Relationships } from '../constants';
import { IdentityToolkitClient } from './client';
import { createUserEntity, createProjectUserRelationship } from './converter';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  // const client = new IdentityToolkitClient(instance.config);

  // await jobState.iterateEntities(
  //   { _type: Entities.PROJECT._type },
  //   async (projectEntity) => {
  //     await client.iterateUsers(projectEntity.key as string, async (user) => {
  //       const userEntity = await jobState.addEntity(createUserEntity(user));
  //       await jobState.addRelationship(
  //         createProjectUserRelationship(projectEntity, userEntity),
  //       );
  //     });
  //   },
  // );

  const app = initializeApp({ credential: applicationDefault() });

  let pageToken: string | undefined = undefined;
  do {
    const listUsersResult = await getAuth().listUsers(100, pageToken);

    console.log({ app });
    console.log(listUsersResult);
    pageToken = listUsersResult.pageToken;

    listUsersResult.users.map(async (user) => {
      const userEntity = await jobState.addEntity(createUserEntity(user));
      // await jobState.addRelationship(
      //   createProjectUserRelationship(projectEntity, userEntity),
      // );
    });
  } while (pageToken);
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
