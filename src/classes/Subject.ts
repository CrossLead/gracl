import { yes } from '../common';
import Resource from './Resource';
import { Repository } from '../interfaces/Repository';


export default class Subject {

  constructor(data, repository: Repository) {

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
