import { identitytoolkit_v3 } from 'googleapis';
import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

export function getUserKey(id: string | null | undefined): string {
  return `google_firebase_user:${id ? id : ''}`;
}

export function getUserName(email: string): string {
  return email.split('@')[0];
}

export function createUserEntity(
  user: identitytoolkit_v3.Schema$UserInfo,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: getUserKey(user.localId),
        username: user.displayName ? user.displayName : user.email,
        email: user.email,
        active: true,
        name: getUserName(user.email as string),
      },
    },
  });
}

export function createProjectUserRelationship(
  project: Entity,
  user: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: project,
    to: user,
  });
}
