import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';

export function createAccountEntity(account: {
  id: string;
  email: string;
}): Entity {
  return createIntegrationEntity({
    entityData: {
      source: account,
      assign: {
        _key: `google_firebase_account:${account.id}`,
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        id: account.id.toString(),
        email: account.email,
        name: account.email.split('@')[0],
      },
    },
  });
}
