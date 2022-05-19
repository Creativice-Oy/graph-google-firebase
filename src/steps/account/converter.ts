import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function getAccountKey(id: string): string {
  return `google_firebase_account:${id}`;
}

export function getAccountName(email: string): string {
  return email.split('@')[0];
}

export function createAccountEntity(account: {
  id: string;
  email: string;
}): Entity {
  return createIntegrationEntity({
    entityData: {
      source: account,
      assign: {
        _key: getAccountKey(account.id),
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        id: account.id.toString(),
        email: account.email,
        name: getAccountName(account.email),
      },
    },
  });
}
