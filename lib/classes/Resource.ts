import { Subject } from './Subject';
import { Node } from './Node';
import { permissionCompare, permissionIndexOf, yes } from '../util';
import { Document, Permission } from '../interfaces';


/**
 * Resource class, permissions are stored on these Nodes, and Subject nodes
   check for access to these nodes.
 */
export class Resource extends Node {


  /**
   * Create new permissions property on document if not existing.
   */
  constructor(doc: Document) {
    super(doc);
    const permissions = this.doc.permissions = this.doc.permissions || [];
    this.sortPermissions();
  }


  /**
   * Sort the permissions on this document by subjectId to allow for fast searching.
   */
  sortPermissions() {
    this.doc.permissions.sort(permissionCompare);
    return this;
  }


  /**
   *  Retrieve a permission for a given subject via binary search.
      Returns an empty permission object if none is found.
   */
  getPermission(subject: Subject): Permission {
    const subjectId = subject.getId(),
          { permissions } = this.doc;
    return permissions[permissionIndexOf(permissions, subjectId)] || { subjectId, access: { } };
  }


  /**
   *  Retrieve a permission for a given subject via binary search.
      Returns an empty permission object if none is found.
   */
  async isAllowed(subject: Subject, permissionType: string, assertionFn = yes): Promise<Boolean> {
    if (!(await assertionFn())) return false;
    const access = this.getPermission(subject).access[permissionType];
    if (access === true || access === false) return access;
    return await this.parentsAllowed(subject, permissionType, assertionFn);
  }


  /**
   *  Modify a permission on this Resource for a given Subject, using `action`
      to modify the permissions object. If no permission exists, a new permission is created.
   */
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


  /**
   *  Set access for a particular permission type to true or false for a given Subject.
   */
  async setPermissionAccess(subject: Subject, permissionType: string, access: boolean): Promise<Resource> {
    return this.updatePermission(subject, permission => {
      (permission.access = permission.access || {})[permissionType] = access;
      return permission;
    });
  }


  /**
   *  Set access for a particular permission type to true for a given Subject.
   */
  async allow(subject: Subject, permissionType: string): Promise<Resource> {
    return this.setPermissionAccess(subject, permissionType, true);
  }


  /**
   *  Set access for a particular permission type to false for a given Subject.
   */
  async deny(subject: Subject, permissionType: string): Promise<Resource> {
    return this.setPermissionAccess(subject, permissionType, false);
  }


}
