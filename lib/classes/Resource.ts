import { yes } from '../common';
import Subject from './Subject';
import Node from './Node';
import { Document, Permission } from '../interfaces';


export default class Resource extends Node {

  constructor(doc: Document) {
    super(doc);
    if (!this.doc.permissions) {
      this.doc.permissions = [];
    }
  }

  async isAllowed(subject: Subject, permissionType: string, assertionFn = yes): Promise<Boolean> {
    const predicate = !!(await assertionFn());
    return predicate && true;
  }

  async allow(subject: Subject, permissionType: string): Promise<Resource> {
    const { doc } = this,
          permission: Permission = {
            type: permissionType,
            ids: [ subject.getId() ]
          };

    // add permission
    this.doc.permissions.push(permission);

    // save updated document
    const id = this.getId(),
          updated = await this.getRepository().saveEntity(id, doc);

    return new Resource(updated);
  }

  async deny(subject: Subject, permissionType: string): Promise<Resource> {
    return this;
  }

}
