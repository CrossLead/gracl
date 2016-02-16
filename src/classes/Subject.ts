import { yes } from '../common';
import Resource from './Resource';

export default class Subject {

  constructor() {

  }

  getId(): String {
    return "";
  }

  getParents(): Array<Subject> {
    return [];
  }

  async isAllowed(resource: Resource, permission, assertionFn = yes): Promise<Boolean> {
    return true;
  }

}
