import { MemoryRepository as Repo } from '../../lib/index';
import { OrganizationResource } from './Organization';

export const blogModel = new Repo();

export class BlogResource extends OrganizationResource {
  static repository = blogModel;
  static parentId = 'organizationId';
}
