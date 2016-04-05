import { MemoryRepository as Repo } from '../../lib/gracl';
import { OrganizationSubject } from './Organization';

export const teamModel = new Repo();

// Moving down the subject hierarchy chain, we simply extend the upper class
export class TeamSubject extends OrganizationSubject {
  static repository = teamModel;
  static parentId = 'organizationId';
  static permissionPropertyKey = 'graclPermissions';
}
