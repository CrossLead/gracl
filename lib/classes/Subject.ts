import { yes } from '../util';
import Resource from './Resource';
import Node from './Node';

export default class Subject extends Node {


  async isAllowed(resource: Resource, permissionType: string, assertionFn = yes): Promise<Boolean> {
    // flip permission check onto resource
    return (
      resource.isAllowed(this, permissionType, assertionFn)      ||
      this.parentsAllowed(resource, permissionType, assertionFn)
    );
  }


}
