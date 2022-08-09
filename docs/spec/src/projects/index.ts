import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const projectsSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://firebase.googleapis.com/v1beta1/projects
     * PATTERN: Fetch Entities
     */
    id: 'fetch-projects',
    name: 'Fetch Projects',
    entities: [
      {
        resourceName: 'Project',
        _type: 'google_firebase_project',
        _class: ['Project'],
      },
    ],
    relationships: [
      {
        _type: 'google_firebase_account_has_project',
        sourceType: 'google_firebase_account',
        _class: RelationshipClass.HAS,
        targetType: 'google_firebase_project',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
