import { yes } from '../common';
import Resource from './Resource';
import Node from './Node';

export default class Subject extends Node {

  async isAllowed(resource: Resource, permission, assertionFn = yes): Promise<Boolean> {
    return true;
  }

}
