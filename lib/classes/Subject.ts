import { yes } from '../util';
import { Resource } from './Resource';
import { Node, IsAllowedOptions } from './Node';

/**
 * Subject class, resources contain permission for Subjects to access them.
 */
export class Subject extends Node {

  /**
   * Check if a subject has access for a given permission type to a given resource.
   */
  async isAllowed(resource: Resource, permissionType: string, options: IsAllowedOptions): Promise<Boolean> {
    // flip permission check onto resource
    return await resource.isAllowed(this, permissionType, options);
  }

}
