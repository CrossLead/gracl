import { MemoryRepository as Repo } from '../../lib/index';
import { OrganizationResource } from './Organization';

export const blogModel = new Repo();

export class Blog extends OrganizationResource {
  static repository = blogModel;
  static parentIdProperty = 'organizationId';
}
