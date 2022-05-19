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
};

export const Entities: Record<
  'ACCOUNT' | 'PROJECT' | 'USER',
  StepEntityMetadata
> = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'google_firebase_account',
    _class: ['Account'],
    schema: {
      properties: {
        id: { type: 'string' },
        email: { type: 'string' },
      },
      required: ['id', 'email'],
    },
  },
  PROJECT: {
    resourceName: 'Project',
    _type: 'google_firebase_project',
    _class: ['Project'],
    schema: {
      properties: {
        id: { type: 'string' },
        key: { type: 'string' },
        displayName: { type: 'string' },
      },
      required: ['id', 'key', 'displayName'],
    },
  },
  USER: {
    resourceName: 'User',
    _type: 'google_firebase_user',
    _class: ['User'],
    schema: {
      properties: {
        username: { type: 'string' },
        email: { type: 'string' },
        active: { type: 'boolean' },
      },
      required: ['username', 'email', 'active'],
    },
  },
};

export const Relationships: Record<
  'ACCOUNT_HAS_PROJECT' | 'PROJECT_HAS_USER',
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
};
