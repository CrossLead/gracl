import { MemoryRepository as Repo } from '../../lib/index';
import { OrganizationSubject } from './Organization';

export const teamModel = new Repo();

// Moving down the subject hierarchy chain, we simply extend the upper class
export class TeamSubject extends OrganizationSubject {
  static repository = teamModel;
  static parentId = 'organizationId';
}
