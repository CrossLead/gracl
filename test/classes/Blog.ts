import { MemoryRepository as Repo } from '../../lib/index';
import { OrganizationResource } from './Organization';

export const blogModel = new Repo();

export class Blog extends OrganizationResource {
  static repository = blogModel;
  async getParents() {
    return [ await this.getParentObject(this.doc.organizationId) ];
  }
}
