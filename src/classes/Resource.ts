import { yes } from '../common';
import Subject from './Subject';
import { Repository } from '../interfaces/Repository';


export default class Resource {

  constructor(data, repository: Repository) {

  }

  getId(): String {
    return "";
  }

  getParents(): Array<Resource> {
    return [];
  }

  async isAllowed(subject: Subject, permission, assertionFn = yes): Promise<Boolean> {
    return true;
  }

  async allow(subject: Subject, permission) {

  }

  async deny(subject: Subject, permission) {

  }

}
