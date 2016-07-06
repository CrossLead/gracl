import { yes } from '../util';
import { Resource, AccessResult } from './Resource';
import { Node, PermOpts } from './Node';
import { Hash } from '../interfaces';

export class Subject extends Node {

  /**
   * Call resource method of the same name
   */
  async determineAccess(resource: Resource, permissionType: string, options?: PermOpts): Promise<Hash<AccessResult>> {
    return resource.determineAccess(this, permissionType, options);
  }

  /**
   * Call resource method of the same name
   */
  async isAllowed(resource: Resource, permissionType: string, options?: PermOpts): Promise<boolean> {
    return resource.isAllowed(this, permissionType, options);
  }

  /**
   * Call resource method of the same name
   */
  async explainPermission(resource: Resource, permissionType: string, options?: PermOpts): Promise<string> {
    return resource.explainPermission(this, permissionType, options);
  }

}
