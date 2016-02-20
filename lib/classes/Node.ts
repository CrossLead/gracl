import { Repository } from '../interfaces/Repository';

// general node class (different links in the hierarchy)
interface NodeClass {
  new (doc: any): Node,
  repository: Repository,
  id: string
}

export default class Node {

  static id = 'id';
  public doc: any;
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

  getParentClass(): NodeClass {
    // extract relative super class
    const thisPrototype = this.constructor.prototype,
          ParentClass: NodeClass = Object.getPrototypeOf(thisPrototype).constructor;

    return ParentClass;
  }

  async getId(): Promise<string> {
    const thisClass: NodeClass = Object.getPrototypeOf(this).constructor;
    return this.doc[thisClass.id];
  }

  async getParentObject(data: any): Promise<Node> {
    const ParentClass = this.getParentClass();

    // data is the id, retrieve from repository
    if (typeof data === 'string') {
      if (!ParentClass.repository) {
        throw new Error(`No static repository property present on ${ParentClass.name} Node!`);
      }
      data = await ParentClass.repository.find(data);
    }

    return new ParentClass(data);
  }

}
