import { Subject } from './Subject';
import { Node, NodeClass, IsAllowedOptions } from './Node';
import { permissionCompare, permissionIndexOf, yes, baseCompare } from '../util';
import { Document, Permission } from '../interfaces';


/**
 * Create formatted string for verbose permission checks
 */
export function logPermissionCheckResult(
  res: Resource,
  sub: Subject,
  permissionType: string,
  message?: string,
  result?: boolean
) {
  let padding = '  ';
  const checkString = `${res.toString()}.isAllowed(${sub.toString()}, ${permissionType})`;

  if (message) {
    console.log(`${padding}--> ${checkString} === ${result} (${message})`);
  }

  return { checkString, padding };
};



interface ResourceCass extends NodeClass {
  new (doc: Document): Resource;
}


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


  setDoc(doc: Document) {
    this.doc = doc;
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
   *  Retrieve a permission for a given subject via binary search.
      Returns an empty permission object if none is found.

      Steps for checking access for a given permission:
        1. If an assertion function is provided, make sure it returns true
            - return false if not
        2. Check if there is a permission on this resource specifically referencing the given subject
            - return true || false if the permission is not undefined
        3. Recurse up resource hierarchy, checking if parent resource has access to this resource.
            - if a parent subject specifically has true / false access -- return that boolean
        4. Recurse up subject hierarchy
   */
  async isAllowed(subject: Subject, permissionType: string, options?: IsAllowedOptions): Promise<Boolean> {
    // permission check options
    const {
      assertionFn = yes,
      verbose = false
    } = options || {};


    if (verbose) {
      const { checkString } = logPermissionCheckResult(this, subject, permissionType);
      console.log(
        `Checking ${checkString}...`
      );
    }


    /**
     * Check if assertion function has returned true
     */
    if (!(await assertionFn())) {
      if (verbose) {
        logPermissionCheckResult(this, subject, permissionType, 'failed assertion function', false);
      }
      return false;
    } else if (verbose) {
      logPermissionCheckResult(this, subject, permissionType, 'passed assertion function', true);
    }



    /**
     *  Recurse up resource chain
     */
    const resources: Array<Resource> = [];
    let currentResources: Array<Resource>  = [ this ];
    while (currentResources.length) {

      for (const res of currentResources) {
        const access = res.getPermission(subject).access[permissionType];
        if (access === true || access === false) {
          if (verbose) {
            logPermissionCheckResult(res, subject, permissionType, 'specific permission check', access);
          }
          return access;
        }
      }

      resources.push(...currentResources);
      const parentResources: Array<Resource> = [];

      for (const res of currentResources) {
        if (!res.hierarchyRoot()) {
          const thisParents = <Array<Resource>> (await res.getParents());
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
    let currentSubjects: Array<Subject> = [ subject ];
    while (currentSubjects.length) {

      /**
       *  for a given subject, check against all resources
       */
      for (const sub of currentSubjects) {
        for (const res of resources) {
          const access = res.getPermission(sub).access[permissionType];
          if (access === true || access === false) {
            if (verbose) {
              logPermissionCheckResult(res, sub, permissionType, 'specific permission check', access);
            }
            return access;
          }
        }
      }

      const parentSubjects: Array<Subject> = [];
      for (const sub of currentSubjects) {
        if (!sub.hierarchyRoot()) {
          const thisParents = <Array<Resource>> (await sub.getParents());
          parentSubjects.push(...thisParents);
        }
      }

      currentSubjects = parentSubjects;
    }

    if (verbose) {
      logPermissionCheckResult(this, subject, permissionType, 'no permissions found', false);
    }
    return false;
  }


  /**
   *  Modify a permission on this Resource for a given Subject, using `action`
      to modify the permissions object. If no permission exists, a new permission is created.
   */
  async updatePermission(subject: Subject, action: (p: Permission) => Permission): Promise<Resource> {
    const { doc } = this,
          { permissions } = doc,
          subjectId = subject.getId();

    const existingPermissionIndex = permissionIndexOf(permissions, subjectId),
          CurrentResourceClass = <ResourceCass> this.getClass();

    if (existingPermissionIndex >= 0) {
      permissions[existingPermissionIndex] = action(permissions[existingPermissionIndex]);
    } else {
      // add permission
      permissions.push(action({ subjectId }));
    }

    // save updated document
    const id = this.getId(),
          updated = await CurrentResourceClass.repository.saveEntity(id, doc);

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


}
