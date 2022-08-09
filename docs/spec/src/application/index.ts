import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const applicationsSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://www.googleapis.com/identitytoolkit/v3/relyingparty/downloadAccount
     * PATTERN: Fetch Entities
     */
    id: 'fetch-web-applications',
    name: 'Fetch Web Applications',
    entities: [
      {
        resourceName: 'Web App',
        _type: 'google_firebase_webapp',
        _class: ['Application'],
      },
    ],
    relationships: [
      {
        _type: 'google_firebase_project_has_webapp',
        sourceType: 'google_firebase_project',
        _class: RelationshipClass.HAS,
        targetType: 'google_firebase_webapp',
      },
    ],
    dependsOn: ['fetch-projects'],
    implemented: true,
  },
];
