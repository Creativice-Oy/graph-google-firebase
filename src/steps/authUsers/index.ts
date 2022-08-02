import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../../config';
import { Entities, Steps } from '../constants';
import { Auth } from './client';
import { createAuthUserEntity } from './converter';

export async function fetchAuthUsers({
  // instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = new Auth();

  await client.iterateAuthUsers(async (authUser) => {
    await jobState.addEntity(createAuthUserEntity(authUser));
  });
}

export const authUserSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.AUTH_USERS,
    name: 'Fetch Auth Users',
    entities: [Entities.AUTH_USER],
    relationships: [],
    dependsOn: [Steps.PROJECTS],
    executionHandler: fetchAuthUsers,
  },
];
