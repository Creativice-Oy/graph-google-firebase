import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';
import { UserRecord } from 'firebase-admin/auth';
import { Entities } from '../constants';

export function getAuthUserKey(id: string): string {
  return `google_firebase_auth_user:${id}`;
}

export function createAuthUserEntity(authUser: UserRecord): Entity {
  return createIntegrationEntity({
    entityData: {
      source: authUser,
      assign: {
        _type: Entities.AUTH_USER._type,
        _class: Entities.AUTH_USER._class,
        _key: getAuthUserKey(authUser.uid),
        name: authUser.displayName || authUser.email,
        username: authUser.email,
        active: true,
      },
    },
  });
}

export function createProjectAuthUserRelationship(
  project: Entity,
  user: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: project,
    to: user,
  });
}
