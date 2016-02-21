import { MemoryRepository as Repo } from '../../lib/index';
import { OrganizationSubject } from './Organization';

export const teamModel = new Repo();

// Moving down the subject hierarchy chain, we simply extend the upper class
export class Team extends OrganizationSubject {
  static repository = teamModel;
  // necessary method implementation, determines how to retrieve parent objects from this document
  // the document itself is stored in `this.doc`
  async getParents() {
    return [ await this.getParentObject(this.doc.organizationId) ];
  }
}
