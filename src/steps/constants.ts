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
  WEB_APPS: 'fetch-web-applications',
  AUTH_USERS: 'fetch-auth-users',
};

export const Entities: Record<
  'ACCOUNT' | 'PROJECT' | 'USER' | 'WEBAPP' | 'AUTH_USER',
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
  AUTH_USER: {
    resourceName: 'Auth User',
    _type: 'google_firebase_auth_user',
    _class: ['User'],
  },
};

export const Relationships: Record<
  | 'ACCOUNT_HAS_PROJECT'
  | 'PROJECT_HAS_USER'
  | 'PROJECT_HAS_WEBAPP'
  | 'PROJECT_HAS_AUTH_USER',
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
  PROJECT_HAS_AUTH_USER: {
    _type: 'google_firebase_project_has_auth_user',
    sourceType: Entities.PROJECT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.AUTH_USER._type,
  },
};
