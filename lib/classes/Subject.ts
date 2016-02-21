import { yes } from '../util';
import { Resource } from './Resource';
import { Node } from './Node';

/**
 * Subject class, resources contain permission for Subjects to access them.
 */
export class Subject extends Node {


  /**
   * Check if a subject has access for a given permission type to a given resource.
   */
  async isAllowed(resource: Resource, permissionType: string, assertionFn = yes): Promise<Boolean> {
    // flip permission check onto resource
    return (
      resource.isAllowed(this, permissionType, assertionFn)      ||
      this.parentsAllowed(resource, permissionType, assertionFn)
    );
  }

}
