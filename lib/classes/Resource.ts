import { Subject } from './Subject';
import { Node, PermOpts } from './Node';
import { permissionCompare, permissionIndexOf, yes, baseCompare } from '../util';
import { Document, Permission } from '../interfaces';


export type AccessResult = {
  type: string,
  access: boolean,
  reason: string
};


export type PermissionsHierarchy = {
  node: string;
  nodeId: string,
  permissions: Permission[];
  parents?: PermissionsHierarchy[];
};


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
    if (!this.doc.permissions) {
      this.doc.permissions = [];
    }
    this.sortPermissions();
  }


  /**
   * Sort the permissions on this document by subjectId to allow for fast searching.
   */
  sortPermissions() {
    this.doc.permissions.sort(permissionCompare);
    return this;
  }


  setDoc(doc: Document) {
    this.doc = doc;
    if (!this.doc.permissions) {
      this.doc.permissions = [];
    }
    this.sortPermissions();
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
   *  Determine access to a given permission, provide a reason for access result.

      Steps for checking access for a given permission:
        1. If an assertion function is provided, make sure it returns true
            - return false if not
        2. Check if there is a permission on this resource specifically referencing the given subject
            - return true || false if the permission is not undefined
        3. Recurse up resource hierarchy, checking if parent resource has access to this resource.
            - if a parent subject specifically has true / false access -- return that boolean
        4. Recurse up subject hierarchy
   */
  async determineAccess(subject: Subject, permissionType: string, options?: PermOpts): Promise<AccessResult> {
    // permission check options
    const {
      assertionFn = yes
    } = options || {};

    const result = {
      type: permissionType,
      access: false,
      reason: 'No permissions were set specifically for this subject/resource combination.'
    };


    /**
     * Check if assertion function has returned true
     */
    if (!(await assertionFn())) {
      result.access = false;
      result.reason = 'Failed assertion function check.';
      return result;
    }



    /**
     *  Recurse up resource chain
     */
    const resources: Resource[] = [];
    let currentResources: Resource[]  = [ this ];
    while (currentResources.length) {

      for (const res of currentResources) {
        const access = res.getPermission(subject).access[permissionType];
        if (access === true || access === false) {
          result.access = access;
          result.reason = `Permission set on ${res.toString()} for ${subject.toString()} = ${access}`;
          return result;
        }
      }

      resources.push(...currentResources);
      const parentResources: Resource[] = [];

      for (const res of currentResources) {
        if (!res.hierarchyRoot()) {
          const thisParents = <Resource[]> (await res.getParents());
          parentResources.push(...thisParents);
        }
      }

      currentResources = parentResources;
    }

    // sort nodes by depth
    resources.sort((a, b) => {
      const aDepth = a.getNodeDepth(),
            bDepth = b.getNodeDepth();
      // invert, so deeper nodes come first
      return 0 - baseCompare(aDepth, bDepth);
    });


    /**
     *  Recurse up subject chain
     */
    let currentSubjects: Subject[] = [ subject ];
    while (currentSubjects.length) {

      /**
       *  for a given subject, check against all resources
       */
      for (const sub of currentSubjects) {
        for (const res of resources) {
          const access = res.getPermission(sub).access[permissionType];
          if (access === true || access === false) {
            result.access = access;
            result.reason = `Permission set on ${res.toString()} for ${sub.toString()} = ${access}`;
            return result;
          }
        }
      }

      const parentSubjects: Subject[] = [];
      for (const sub of currentSubjects) {
        if (!sub.hierarchyRoot()) {
          const thisParents = <Subject[]> (await sub.getParents());
          parentSubjects.push(...thisParents);
        }
      }

      currentSubjects = parentSubjects;
    }

    return result;
  }


  /**
   *  Check if a subject has access to this resource.
   */
  async isAllowed(subject: Subject, permissionType: string, options?: PermOpts): Promise<boolean> {
    const result = await this.determineAccess(subject, permissionType, options);
    return result.access;
  }


  /**
   *  Get a string explaining why a subject has a permission set to a particular value for a given resource.
   */
  async explainPermission(subject: Subject, permissionType: string, options?: PermOpts): Promise<string> {
    const result = await this.determineAccess(subject, permissionType, options);
    return result.reason;
  }


  /**
   *  Modify a permission on this Resource for a given Subject, using `action`
      to modify the permissions object. If no permission exists, a new permission is created.
   */
  async updatePermission(subject: Subject, action: (p: Permission) => Permission): Promise<Resource> {
    const { doc } = this,
          { permissions } = doc,
          subjectId = subject.getId(),
          subjectType = subject.getName(),
          resourceId = this.getId(),
          resourceType = this.getName();

    const existingPermissionIndex = permissionIndexOf(permissions, subjectId),
          CurrentResourceClass = <typeof Resource> this.getClass();

    if (existingPermissionIndex >= 0) {
      permissions[existingPermissionIndex] = action(permissions[existingPermissionIndex]);
    } else {
      // add permission
      permissions.push(action({ subjectId, resourceId, resourceType, subjectType }));
    }

    // save updated document
    const id = this.getId(),
          updated = await CurrentResourceClass.repository.saveEntity(id, doc, this);

    return this.setDoc(updated);
  }


  /**
   *  Set access for a particular permission type to true or false for a given Subject.
   */
  setPermissionAccess(subject: Subject, permissionType: string, access: boolean): Promise<Resource> {
    return this.updatePermission(subject, permission => {
      (permission.access = permission.access || {})[permissionType] = access;
      return permission;
    });
  }


  /**
   *  Set access for a particular permission type to true for a given Subject.
   */
  allow(subject: Subject, permissionType: string): Promise<Resource> {
    return this.setPermissionAccess(subject, permissionType, true);
  }


  /**
   *  Set access for a particular permission type to false for a given Subject.
   */
  deny(subject: Subject, permissionType: string): Promise<Resource> {
    return this.setPermissionAccess(subject, permissionType, false);
  }


  /**
   *  Retrieve permissions hierarchy for this node.
   */
  async getPermissionsHierarchy(): Promise<PermissionsHierarchy> {
    const { permissions = [] } = <{ permissions?: any[] }> this.doc;

    const graph: PermissionsHierarchy = {
      node: this.toString(),
      nodeId: this.getId(),
      permissions: <Permission[]> permissions,
      parents: []
    };

    if (!this.hierarchyRoot()) {
      const parents = await (<Promise<Resource[]>> this.getParents());
      if (parents.length) {
        const parentHierarchies = await Promise.all(
          parents.map(p => p.getPermissionsHierarchy())
        );
        graph.parents.push(...parentHierarchies);
      }
    }

    return graph;
  }


}
