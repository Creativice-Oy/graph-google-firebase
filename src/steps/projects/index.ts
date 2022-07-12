import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

// import { Client } from '../../client';
import { IntegrationConfig } from '../../config';
import {
  ACCOUNT_ENTITY_KEY,
  Steps,
  Entities,
  Relationships,
} from '../constants';
import { FirebaseClient } from './client';
import {
  createProjectEntity,
  createAccountProjectRelationship,
} from './converter';

export async function fetchProjects({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const client = new FirebaseClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await client.iterateProjects(async (project) => {
    const projectEntity = await jobState.addEntity(
      createProjectEntity(project),
    );
    await jobState.addRelationship(
      createAccountProjectRelationship(accountEntity, projectEntity),
    );
  });
}

export const projectSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.PROJECTS,
    name: 'Fetch Projects',
    entities: [Entities.PROJECT],
    relationships: [Relationships.ACCOUNT_HAS_PROJECT],
    dependsOn: [Steps.ACCOUNT],
    executionHandler: fetchProjects,
  },
];
