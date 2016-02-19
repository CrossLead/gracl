import { yes } from '../common';
import Subject from './Subject';
import Node from './Node';
import { Permission } from '../interfaces/Permission';


export default class Resource extends Node {

  async isAllowed(subject: Subject, permissionType: string, assertionFn = yes): Promise<Boolean> {
    return true;
  }

  async allow(subject: Subject, permissionType: string) {
    this.doc.permissions;
  }

  async deny(subject: Subject, permissionType: string) {

  }

}
