import { Repository, Permission, Document } from '../interfaces';
import { Subject } from './Subject';
import { Resource } from './Resource';
import { yes, getClassOf } from '../util';


/**
 * union of subclasses for inherited method signatures
 */
export type HierarchyNode = Subject | Resource;
export type DocumentData = string | Document;
export type PermOpts = {
  // additional function check for permissions.
  assertionFn?: () => boolean;
};


/**
 *  Abstract base class from which all gracl hierachy nodes inherit.
 */
export abstract class Node {


  public static displayName: string = '';


  /**
   *  String indicating the property on this nodes document
      that contains the id(s) of its parent.
   */
  public static parentId: string;


  /**
   *  The id property within the document contained by this node type, defaults to 'id'
   */
  public static id = 'id';


  /**
   *  The repository for this node type, provides async getter function.
      Must follow the Repository interface spec.
   */
  public static repository: Repository;


  /**
   *  Retrieve all class names in the hierarchy of nodes stemming from this class
   */
  public static getHierarchyClassNames() {
    const names: string[] = [];
    let nodeClass = this;

    do {
      names.push(nodeClass.displayName || nodeClass.name);
      nodeClass = getClassOf(nodeClass.prototype);
    } while (getClassOf(nodeClass.prototype) !== Node);

    return names;
  }


  /**
   *  Constructor, simply assigns the given document as a property
   */
  constructor(public doc: Document) {
    // ensure that this class has a repository
    const { name, repository, id } = this.getClass();

    if (!doc)                  throw new Error(`No document provided to ${name} constructor!`);
    if (doc[id] === undefined) throw new Error(`No ${id} property on document ${doc}!`);
    if (!repository)           throw new Error(`No repository static property defined on ${name}!`);
  }


  /**
   *  Get the name of this node
   */
  getName() {
    const thisClass = this.getClass(),
          className = thisClass.displayName || thisClass.name;

    return className;
  }


  /**
   *  Pretty printing
   */
  toString(): string {
    const nodeSubclassName = this.getNodeSubclass().name,
          id = this.getId();

    return `<${nodeSubclassName}:${this.getName()} id=${id}>`;
  }


  /**
   *  Check if this node is a particular Node subclass
   */
  isNodeType(nc: typeof Node): boolean {
    return this.getClass() === nc;
  }


  /**
   *  Get the relative super class constructor of this instance
   */
  getParentClass(): typeof Node {
    return getClassOf(this.constructor.prototype);
  }


  /**
   *  Get the class of this instance
   */
  getClass(): typeof Node {
    return getClassOf(this);
  }


  /**
   *  Check if this class direcly inherits from HierarchyNode by
      checking if the class two levels up is Node
   */
  hierarchyRoot() {
    return getClassOf(this.getParentClass().prototype) === Node;
  }


  /**
   *  Get the id value on the document contained in this node
   */
  getId(): string {
    return this.doc[this.getClass().id];
  }


  /**
   *  Get the repository for this class
   */
  getRepository(): Repository {
    return this.getClass().repository;
  }


  /**
   *  Check if a node is allowed access to this node. Must be overridden by subclasses.
   */
  async isAllowed(node: HierarchyNode, permissionType: string, options: PermOpts): Promise<Boolean> {
    console.warn(`Calling Node.isAllowed(), must implement on subclass!`);
    return false;
  }


  /**
   *  Get the parent objects of an instance of this node.
      Must be overriden by subclass unless the static parentId is defined.
   */
  async getParents(): Promise<Node[]> {
    const { parentId } = this.getClass();
    if (parentId) {
      const parentIds = <DocumentData[] | DocumentData> this.doc[parentId] || [];
      if (Array.isArray(parentIds)) {
        const promises = <Array<Promise<DocumentData>>> parentIds.map((id: DocumentData) => {
          return this.getParentNode(id);
        });
        return await Promise.all(promises);
      } else {
        return [ await this.getParentNode(parentIds) ];
      }
    } else {
      console.warn(`Calling Node.getParents() without Node.parentId, must implement on subclass!`);
      return [];
    }
  };


  /**
   *  Given an id of a parent of this node, create a Node instance of that object.
      @param data Either the <string> id of the object, or the raw document itself.
   */
  async getParentNode(data: DocumentData): Promise<Node> {
    const ParentClass = <typeof Resource | typeof Subject> this.getParentClass();
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


  /**
   *  Ensure that a given class inherits from Node
   */
  assertNodeClass(nodeClass: typeof Node) {
    if (!(nodeClass.prototype instanceof Node)) {
      throw new Error(`Link in hierarchy chain (${nodeClass.name}) is not an instance of Node!`);
    }
  }


  /**
   *  Determine what subclass of node this node is.
   */
  getNodeSubclass(): typeof Node {
    let nodeClass = this.getClass();
    this.assertNodeClass(nodeClass);
    while (getClassOf(nodeClass.prototype) !== Node) {
      nodeClass = getClassOf(nodeClass.prototype);
      this.assertNodeClass(nodeClass);
    }
    return nodeClass;
  }

  /**
   *  Determine what subclass of node this node is.
   */
  getNodeDepth(): number {
    let depth = 0;
    let nodeClass = this.getClass();
    while (getClassOf(nodeClass.prototype) !== Node) {
      depth++;
      nodeClass = getClassOf(nodeClass.prototype);
    }
    return depth;
  }



  /**
   *  Retrieve all ids in the hierarchy of nodes steming from this instance
   */
  async getHierarchyIds(): Promise<string[]> {
    let ids = [ this.getId() ];
    if (!this.hierarchyRoot()) {
      const parents = await this.getParents();
      if (parents.length) {
        const parentIds = await Promise.all(
          parents.map(p => p.getHierarchyIds())
        );
        ids = parentIds.reduce((out, idList) => {
          return out.concat(idList);
        }, ids);
      }
    }
    return ids;
  }



  /**
   *  Instance version of static method
   */
  getHierarchyClassNames(): string[] {
    return this.getClass().getHierarchyClassNames();
  }


}
