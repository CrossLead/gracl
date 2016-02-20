import { yes } from '../util';
import Resource from './Resource';
import Node from './Node';

export default class Subject extends Node {

  async isAllowed(resource: Resource, permission, assertionFn = yes): Promise<Boolean> {
    return true;
  }

}
