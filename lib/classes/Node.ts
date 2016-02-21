import { Repository, Permission, Document } from '../interfaces';
import Subject from './Subject';
import Resource from './Resource';
import { yes } from '../util';


// union of subclasses for inherited method signatures
type HiearchyClass = Subject | Resource;


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


  private _getClass(node: any): NodeClass {
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


  hierarchyRoot() {
    // check if two parents up the prototype chain is the Node Class
    return this._getClass(this.getParentClass().prototype) === Node;
  }


  getId(): string {
    return this.doc[this.getClass().id];
  }


  getRepository(): Repository {
    return this.getClass().repository;
  }


  async isAllowed(node: HiearchyClass, permissionType: string, assertionFn = yes): Promise<Boolean> {
    throw new Error(`Calling isAllowed on Node, must implement on subclass!`);
  }


  async getParents(): Promise<Array<Node>> {
    throw new Error(`getParents not implemented for ${this.getClass().name}`);
  };


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


  async parentsAllowed(node: HiearchyClass, permissionType: string, assertionFn = yes) {
    if (this.hierarchyRoot()) return false;

    const parents = await this.getParents(),
          parentsAllowed = await Promise.all(
            parents.map(
              p => p.isAllowed(node, permissionType, assertionFn)
            )
          );

    return parentsAllowed.some(Boolean);
  }


}
