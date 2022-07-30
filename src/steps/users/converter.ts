import { identitytoolkit_v3 } from 'googleapis';
import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

export function getUserKey(id: string): string {
  return `google_firebase_user:${id}`;
}

export function getUserName(email: string): string {
  return email.split('@')[0];
}

export function createUserEntity(user: UserRecord): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        _key: getUserKey(user.uid),
        username: user.displayName ? user.displayName : user.email,
        email: user.email,
        active: !user.disabled,
        name: user.displayName,
        phoneNumber: user.phoneNumber,
        'metadata.creationTime': user.metadata.creationTime,
        'metadata.lastSignInTime': user.metadata.lastSignInTime,
        'metadata.lastRefreshTime': user.metadata.lastRefreshTime,
        tenantId: user.tenantId,
        tokensValidAfterTime: user.tokensValidAfterTime,
        mfaEnabled:
          user.multiFactor && user.multiFactor.enrolledFactors.length > 0
            ? true
            : false,
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
