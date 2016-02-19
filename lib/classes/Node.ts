import { Repository } from '../interfaces/Repository';

// general node class (different links in the hierarchy)
interface NodeClass {
  new (doc: any): Node,
  repository: Repository
}


export default class Node {

  // default id parameter
  static id = 'id';
  public doc: any;

  // permissions property from object
  private static repository: Repository;

  constructor(doc: any) {
    this.doc = doc;
  }

  isNodeType(c): boolean {
    return this.constructor === c;
  }

  getNodeType(): string {
    return this.constructor.name;
  }

  getParentNodeType(): string {
    return this.getParentClass().name;
  }

  async getId(): Promise<any> {
    return this.doc[Object.getPrototypeOf(this).constructor.id];
  }

  getParentClass(): NodeClass {
    // extract relative super class;
    const subClassPrototype = this.constructor.prototype,
          ParentClass = Object.getPrototypeOf(subClassPrototype).constructor;

    return ParentClass;
  }

  async getParentObject(data: any): Promise<Node> {
    const ParentClass = this.getParentClass();

    if (typeof data === 'string') {
      if (!ParentClass.repository) {
        throw new Error(`No static repository property present on ${ParentClass.name} Node!`);
      }
      data = await ParentClass.repository.find(data);
    }

    return new ParentClass(data);
  }

}
