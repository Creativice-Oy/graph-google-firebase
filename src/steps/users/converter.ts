import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

export function getUserKey(id: string): string {
  return `google_firebase_user:${id}`;
}

export function createUserEntity(user: string): Entity {
  return createIntegrationEntity({
    entityData: {
      source: { user },
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: getUserKey(user),
        name: user,
        username: user,
        active: true,
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
