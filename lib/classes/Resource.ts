import { Subject } from './Subject';
import { Node, PermOpts } from './Node';
import {
  permissionCompare,
  permissionIndexOf,
  yes,
  baseCompare,
  flattenPromises
} from '../util';
import { Document, Permission, Hash } from '../interfaces';


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
    const key = this.getClass().permissionPropertyKey;
    if (key && !this.doc[key]) {
      this.doc[key] = [];
    }
    this.sortPermissions();
  }


  /**
   * Sort the permissions on this document by subjectId to allow for fast searching.
   */
  sortPermissions() {
    const key = this.getClass().permissionPropertyKey;
    if (key && this.doc[key]) {
      const key = this.getClass().permissionPropertyKey;
      this.doc[key].sort(permissionCompare);
    }
    return this;
  }


  setDoc(doc: Document) {
    this.doc = doc;
    const key = this.getClass().permissionPropertyKey;
    if (key && !this.doc[key]) {
      this.doc[key] = [];
    }
    this.sortPermissions();
    return this;
  }


  /**
   *  Retrieve a permission for a given subject via binary search.
      Returns an empty permission object if none is found.
   */
  async getPermission(subject: Subject): Promise<Permission> {
    const key = this.getClass().permissionPropertyKey,
          subjectId = subject.getId(),
          permissions = await this.getPermissionList();

    return permissions[permissionIndexOf(permissions, subjectId)] || <Permission> {
      subjectId,
      resourceId: '',
      resourceType: '',
      subjectType: this.getName(),
      access: {}
    };
  }


  async getPermissionList(): Promise<Permission[]> {
    const key = this.getClass().permissionPropertyKey;
    return <Permission[]> this.doc[key];
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
  async determineAccess(
    subject: Subject,
    permissionType: string | string[],
    options?: PermOpts
  ): Promise<Hash<AccessResult>> {
    // permission check options
    const { assertionFn = yes } = options || {};

    const accessResults: Hash<AccessResult> = {};

    const finishedPermissions: Set<string> = new Set();
    const foundResults: Set<string> = new Set();

    const permissionsToCheck: string[] = typeof permissionType === 'string'
      ? [ permissionType ]
      : permissionType;

    const uniquePerms = new Set(permissionsToCheck);


    permissionsToCheck.forEach(perm => {
      accessResults[perm] = {
        type: perm,
        access: false,
        reason: 'No permissions were set specifically for this subject/resource combination.'
      };
    });

    /**
     * Check if assertion function has returned true
     */
    if (!(await assertionFn())) {
      permissionsToCheck.forEach(perm => {
        accessResults[perm].reason = 'Failed assertion function check.';
      });
      return accessResults;
    }

    const subjectCache: Hash<Subject[]> = {};
    const getSubject = (sub: Subject) => {
      const id = sub.getId();
      if (subjectCache[id]) return Promise.resolve(subjectCache[id]);
      return sub.getParents()
        .then(result => subjectCache[id] = <Subject[]> result);
    };

    const permissionObjCache: Hash<Hash<Permission>> = {};
    const getPermissionObj = (res: Resource, sub: Subject): Promise<Permission> => {
      const resId = res.getId();
      const subId = sub.getId();

      if (permissionObjCache[resId] &&
          permissionObjCache[resId][subId]) {
        return Promise.resolve(permissionObjCache[resId][subId]);
      }

      if (!permissionObjCache[resId]) permissionObjCache[resId] = {};

      return res.getPermission(sub)
        .then(result => permissionObjCache[resId][subId] = result);
    };

    const resource = this;
    let currentResources: Resource[] = [ resource ];

    // loop through the levels of the resource hierarchy
    while (true) {

      // loop through all levels of the subject hierarchy,
      // checking access to the current resource
      let currentSubjects = [ subject ];

      while (true) {

        for (let i_p = 0, l_p = permissionsToCheck.length; i_p < l_p; i_p++) {
          const perm = permissionsToCheck[i_p];

          if (finishedPermissions.has(perm)) continue;

          for (let i_s = 0, l_s = currentSubjects.length; i_s < l_s; i_s++) {
            const sub = currentSubjects[i_s];

            for (let i_r = 0, l_r = currentResources.length; i_r < l_r; i_r++) {
              const res = currentResources[i_r];

              // get the specific permission for this
              // subject and resource combination and
              // determine access for the given resource type
              const permObj = await getPermissionObj(res, sub);
              const access = permObj.access && permObj.access[perm];

              // if we have a defined access value,
              // set the reason and the access for the permission
              if ((access === true && !finishedPermissions.has(perm)) || access === false) {

                if (access === false) finishedPermissions.add(perm);

                const result = accessResults[perm];
                result.access = access;
                result.reason = (
                  `Permission set on ${res.toString()} for ${sub.toString()} = ${access}`
                );

              }
            }

            // if positive result found for this level of resources, add to positive results
            if (accessResults[perm].access) finishedPermissions.add(perm);
          }
        }


        // if we have found results for all permissions at this point, break
        if (finishedPermissions.size === uniquePerms.size) return accessResults;

        // if we've reached the root, return
        if (!currentSubjects.length || currentSubjects.some(s => s.hierarchyRoot())) break;

        currentSubjects = <Subject[]> (await flattenPromises(
          currentSubjects.map(getSubject)
        ));
      }

      if (!currentResources.length || currentResources.some(r => r.hierarchyRoot())) break;

      // advance to the next level of resources
      currentResources = <Resource[]> (await flattenPromises(
        currentResources.map(r => r.getParents())
      ));
    }

    return accessResults;
  }


  /**
   *  Check if a subject has access to this resource.
   */
  async isAllowed(subject: Subject, permissionType: string, options?: PermOpts): Promise<boolean> {
    const result = await this.determineAccess(subject, permissionType, options);
    return result[permissionType].access;
  }


  /**
   *  Get a string explaining why a subject has a permission set to a particular value for a given resource.
   */
  async explainPermission(subject: Subject, permissionType: string, options?: PermOpts): Promise<string> {
    const result = await this.determineAccess(subject, permissionType, options);
    return result[permissionType].reason;
  }


  /**
   *  Modify a permission on this Resource for a given Subject, using `action`
      to modify the permissions object. If no permission exists, a new permission is created.
   */
  async updatePermission(subject: Subject, action: (p: Permission) => Permission): Promise<Resource> {
    const permissions = (await this.getPermissionList()) || [],
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
          updated = await CurrentResourceClass.repository.saveEntity(id, this.doc, this);

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
    const permissions = await this.getPermissionList();

    const graph: PermissionsHierarchy = {
      node: this.toString(),
      nodeId: this.getId(),
      permissions: permissions,
      parents: []
    };

    if (!this.hierarchyRoot()) {
      const parents = await (<Promise<Resource[]>> this.getParents());
      if (parents.length) {
        const parentHierarchies = <PermissionsHierarchy[]> (<any> (await Promise.all(
          parents.map(p => p.getPermissionsHierarchy())
        )));
        graph.parents && graph.parents.push(...parentHierarchies);
      }
    }

    return graph;
  }


}
