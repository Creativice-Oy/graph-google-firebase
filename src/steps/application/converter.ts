import { firebase_v1beta1 } from 'googleapis';
import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

export function createWebAppKey(id: string | null | undefined): string {
  return `google_firebase_webapp:${id ? id : ''}`;
}

export function createWebAppEntity(
  webApp: firebase_v1beta1.Schema$WebApp,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: webApp,
      assign: {
        _type: Entities.WEBAPP._type,
        _class: Entities.WEBAPP._class,
        _key: createWebAppKey(webApp.name),
        apiKeyId: webApp.apiKeyId,
        appId: webApp.appId,
        appUrls: webApp.appUrls,
        displayName: webApp.displayName || '',
        name: webApp.name,
        projectId: webApp.projectId,
        webId: webApp.webId,
      },
    },
  });
}

export function createWebappProjectRelationship(
  webApp: Entity,
  project: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: project,
    to: webApp,
  });
}
