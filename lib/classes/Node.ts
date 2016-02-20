import { Repository, Permission, Document } from '../interfaces';


export interface NodeClass {
  new (doc: Document): Node,
  repository: Repository,
  id: string
}


export default class Node {

  public doc: Document;
  public static id = 'id';
  public static repository: Repository;

  constructor(doc: Document) {
    this.doc = doc;
  }

  private _getClass(node: Node) {
    return <NodeClass> Object.getPrototypeOf(node).constructor;
  }

  isNodeType(nc: NodeClass): boolean {
    return this.getClass() === nc;
  }

  getParentClass(): NodeClass {
    return this._getClass(this.constructor.prototype);
  }

  getClass(): NodeClass {
    return this._getClass(this);
  }

  getId(): string {
    return this.doc[this.getClass().id];
  }

  getRepository(): Repository {
    return this.getClass().repository;
  }

  async getParentObject(data: string|Document): Promise<Node> {
    const ParentClass = this.getParentClass();
    let doc: Document;

    // data is the id, retrieve from repository
    if (typeof data === 'string') {
      if (!ParentClass.repository) {
        throw new Error(`No static repository property present on ${ParentClass.name} Node!`);
      }
      doc = await ParentClass.repository.getEntity(<string> data);
    } else {
      doc = data;
    }

    return new ParentClass(doc);
  }

}
