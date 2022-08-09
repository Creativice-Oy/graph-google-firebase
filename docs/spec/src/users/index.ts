import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const usersSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://www.googleapis.com/identitytoolkit/v3/relyingparty/downloadAccount
     * PATTERN: Fetch Entities
     */
    id: 'fetch-users',
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'User',
        _type: 'google_firebase_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'google_firebase_project_has_user',
        sourceType: 'google_firebase_project',
        _class: RelationshipClass.HAS,
        targetType: 'google_firebase_user',
      },
    ],
    dependsOn: ['fetch-projects'],
    implemented: true,
  },
];
