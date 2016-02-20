import { Repository } from '../interfaces/Repository';

// general node class (different links in the hierarchy)
interface NodeClass {
  new (doc: any): Node,
  repository: Repository,
  id: string
}

export default class Node {

  public doc: any;
  public static id = 'id';
  private static repository: Repository;

  constructor(doc: any) {
    this.doc = doc;
  }

  isNodeType(nc: NodeClass): boolean {
    return this.constructor === nc;
  }

  getNodeType(): NodeClass {
    return <NodeClass>this.constructor;
  }

  getParentNodeType(): NodeClass {
    return this.getParentClass();
  }

  getParentClass(): NodeClass {
    // extract relative super class
    const thisPrototype = this.constructor.prototype,
          ParentClass: NodeClass = Object.getPrototypeOf(thisPrototype).constructor;

    return ParentClass;
  }

  async getId(): Promise<string> {
    const thisClass = <NodeClass>Object.getPrototypeOf(this).constructor;
    return this.doc[thisClass.id];
  }

  async getParentObject(data: any): Promise<Node> {
    const ParentClass = this.getParentClass();

    // data is the id, retrieve from repository
    if (typeof data === 'string') {
      if (!ParentClass.repository) {
        throw new Error(`No static repository property present on ${ParentClass.name} Node!`);
      }
      data = await ParentClass.repository.getEntity(data);
    }

    return new ParentClass(data);
  }

}
