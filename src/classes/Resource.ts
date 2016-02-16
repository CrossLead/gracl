import { yes } from '../common';

export default class Resource {

  constructor() {

  }

  getId() {

  }

  getParents() {

  }

  async isAllowed(subject, permission, assertionFn = yes) {

  }

  async allow(subject, permission) {

  }

  async deny(subject, permission) {

  }

}
