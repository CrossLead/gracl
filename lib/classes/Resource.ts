import Subject from './Subject';
import Node from './Node';
import { permissionCompare, permissionIndexOf, yes } from '../util';
import { Document, Permission } from '../interfaces';


export default class Resource extends Node {

  constructor(doc: Document) {
    super(doc);
    const permissions = this.doc.permissions = this.doc.permissions || [];
    this.sortPermissions();
  }

  sortPermissions() {
    this.doc.permissions.sort(permissionCompare);
    return this;
  }

  async isAllowed(subject: Subject, permissionType: string, assertionFn = yes): Promise<Boolean> {
    const predicate = !!(await assertionFn());
    return predicate && true;
  }

  async updatePermission(subject: Subject, action: (Permission) => Permission): Promise<Resource> {
    const { doc } = this,
          { permissions } = doc,
          subjectId = subject.getId();

    const existingPermissionIndex = permissionIndexOf(permissions, subjectId);

    if (existingPermissionIndex >= 0) {
      permissions[existingPermissionIndex] = action(permissions[existingPermissionIndex])
    } else {
      // add permission
      this.doc.permissions.push(action({ subjectId }));
    }

    // save updated document
    const id = this.getId(),
          updated = await this.getRepository().saveEntity(id, doc);

    return new Resource(updated);
  }

  async setPermissionAccess(subject: Subject, permissionType: string, access: boolean): Promise<Resource> {
    return this.updatePermission(subject, permission => {
      (permission.access = permission.access || {})[permissionType] = access;
      return permission;
    });
  }

  async setPermissionSuperAccess(subject: Subject, permissionType: string, access: boolean): Promise<Resource> {
    return this.updatePermission(subject, permission => {
      permission.superAccess = access;
      return permission;
    });
  }

  async allow(subject: Subject, permissionType: string): Promise<Resource> {
    return this.setPermissionAccess(subject, permissionType, true);
  }

  async deny(subject: Subject, permissionType: string): Promise<Resource> {
    return this.setPermissionAccess(subject, permissionType, false);
  }

  async allowSuperAccess(subject: Subject, permissionType: string): Promise<Resource> {
    return this.setPermissionSuperAccess(subject, permissionType, true);
  }

  async denySuperAccess(subject: Subject, permissionType: string): Promise<Resource> {
    return this.setPermissionSuperAccess(subject, permissionType, false);
  }

}
