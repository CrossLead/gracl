import { Repository } from '../interfaces/Repository';

export default class Node {

  // default id parameter
  static id = 'id';
  public doc: any;

  // permissions property from object
  private static repository: Repository;

  constructor(doc) {
    this.doc = doc;
  }

  isNodeType(c) {
    return this.constructor === c;
  }

  getNodeType() {
    return this.constructor.name;
  }

  getParentNodeType() {
    return this.getParentClass().name;
  }

  async getId() {
    return this.doc[Object.getPrototypeOf(this).constructor.id];
  }

  getParentClass() {
    // extract relative super class;
    const subClassPrototype = this.constructor.prototype,
          ParentClass = Object.getPrototypeOf(subClassPrototype).constructor;

    return ParentClass;
  }

  async getParentObject(data) {
    const ParentClass = this.getParentClass();

    if (typeof data === 'string') {
      if (!ParentClass.model) {
        throw new Error(`No static model property present on ${ParentClass.name} Node!`);
      }
      data = await ParentClass.model.find(data);
    }

    return new ParentClass(data);
  }

}
