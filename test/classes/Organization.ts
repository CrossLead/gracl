import { MemoryRepository as Repo, Subject, Resource } from '../../lib/gracl';

export const orgModel = new Repo();

export class OrganizationResource extends Resource {
  static id = 'id';
  static repository = orgModel;
  static permissionPropertyKey = 'graclPermissions';
}

export class OrganizationSubject extends Subject {
  static id = 'id';
  static repository = orgModel;
  static permissionPropertyKey = 'graclPermissions';
}
