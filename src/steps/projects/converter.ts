import { firebase_v1beta1 } from 'googleapis';
import {
  createIntegrationEntity,
  createDirectRelationship,
  Entity,
  RelationshipClass,
  Relationship,
} from '@jupiterone/integration-sdk-core';
import { Entities } from '../constants';

export function getProjectKey(id: string | null | undefined): string {
  return `google_firebase_project:${id ? id : ''}`;
}

export function createProjectEntity(
  project: firebase_v1beta1.Schema$FirebaseProject,
): Entity {
  return createIntegrationEntity({
    entityData: {
      source: project,
      assign: {
        _type: Entities.PROJECT._type,
        _class: Entities.PROJECT._class,
        _key: getProjectKey(project.projectNumber),
        id: project.projectNumber ? project.projectNumber : '',
        key: project.projectId ? project.projectId : '',
        displayName: project.displayName ? project.displayName : '',
      },
    },
  });
}

export function createAccountProjectRelationship(
  account: Entity,
  project: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: account,
    to: project,
  });
}
