import { MemoryRepository as Repo, Subject, Resource } from '../../lib/index';

export const orgModel = new Repo();

export class OrganizationResource extends Resource {
  static id = 'id';
  static repository = orgModel;
}

export class OrganizationSubject extends Subject {
  static id = 'id';
  static repository = orgModel;
}