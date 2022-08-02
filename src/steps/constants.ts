import {
  RelationshipClass,
  StepEntityMetadata,
  StepRelationshipMetadata,
} from '@jupiterone/integration-sdk-core';

export const ACCOUNT_ENTITY_KEY = 'entity:account';

export const Steps = {
  ACCOUNT: 'fetch-account',
  PROJECTS: 'fetch-projects',
  USERS: 'fetch-users',
  APPLICATIONS: 'fetch-applications',
};

export const Entities: Record<
  'ACCOUNT' | 'PROJECT' | 'USER' | 'WEBAPP',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'google_firebase_account',
    _class: ['Account'],
  },
  PROJECT: {
    resourceName: 'Project',
    _type: 'google_firebase_project',
    _class: ['Project'],
  },
  USER: {
    resourceName: 'User',
    _type: 'google_firebase_user',
    _class: ['User'],
  },
  WEBAPP: {
    resourceName: 'Web App',
    _type: 'google_firebase_webapp',
    _class: ['Application'],
  },
};

export const Relationships: Record<
  'ACCOUNT_HAS_PROJECT' | 'PROJECT_HAS_USER' | 'PROJECT_HAS_WEBAPP',
  StepRelationshipMetadata
> = {
  ACCOUNT_HAS_PROJECT: {
    _type: 'google_firebase_account_has_project',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.PROJECT._type,
  },
  PROJECT_HAS_USER: {
    _type: 'google_firebase_project_has_user',
    sourceType: Entities.PROJECT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  PROJECT_HAS_WEBAPP: {
    _type: 'google_firebase_project_has_webapp',
    sourceType: Entities.PROJECT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.WEBAPP._type,
  },
};
