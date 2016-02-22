import { Repository, Permission, Document } from '../interfaces';
import { Subject } from './Subject';
import { Resource } from './Resource';
import { yes } from '../util';


/**
 * union of subclasses for inherited method signatures
 */
type HierarchyNode = Subject | Resource;


export interface PermissionsGraph {
  node: string;
  permissions: Array<Permission>;
  parents?: Array<PermissionsGraph>;
}


/**
 *  General NodeClass metaclass type -- Node and any derivative classes.
    Example instances:
      - Node
      - Subject
      - Resource
 */
export interface NodeClass {
  new (doc: Document): Node;
  repository: Repository;
  id: string;
}


/**
 *  Abstract base class from which all gracl hierachy nodes inherit.
 */
export class Node {


  /**
   *  The actual data document assigned to the node,
      contains arbitrary properties. gracl will set doc.permissions
      to contain the acl permissions.
   */
  public doc: Document;


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
   *  Constructor, simply assigns the given document as a property
   */
  constructor(doc: Document) {
    this.doc = doc;
  }


  /**
   *  Internal method for determining the class of a given instance of a Node subclass
   */
  private _getClassOf(node: any): NodeClass {
    return <NodeClass> Object.getPrototypeOf(node).constructor;
  }


  /**
   *  Pretty printing
   */
  toString(): string {
    const nodeSubclassName = this.getNodeSubclass().name,
          className = this.getClass().name,
          id = this.getId();

    return `<${nodeSubclassName}:${className} id=${id}>`;
  }


  /**
   *  Check if this node is a particular Node subclass
   */
  isNodeType(nc: NodeClass): boolean {
    return this.getClass() === nc;
  }


  /**
   *  Get the relative super class constructor of this instance
   */
  getParentClass(): NodeClass {
    return this._getClassOf(this.constructor.prototype);
  }


  /**
   *  Get the class of this instance
   */
  getClass(): NodeClass {
    return this._getClassOf(this);
  }


  /**
   *  Check if this class direcly inherits from HierarchyNode by
      checking if the class two levels up is Node
   */
  hierarchyRoot() {
    return this._getClassOf(this.getParentClass().prototype) === Node;
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
  async isAllowed(node: HierarchyNode, permissionType: string, assertionFn = yes): Promise<Boolean> {
    console.warn(`Calling Node.isAllowed(), must implement on subclass!`);
    return false;
  }


  /**
   *  Get the parent objects of an instance of this node. Must be overriden by subclass.
   */
  async getParents(): Promise<Array<Node>> {
    console.warn(`Calling Node.getParents(), must implement on subclass!`);
    return [];
  };


  /**
   *  Given an id of a parent of this node, create a Node instance of that object.
      @param data Either the <string> id of the object, or the raw document itself.
   */
  async getParentObject(data: string | Document): Promise<Node> {
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


  /**
   *  Check if other node is allowed access to any of this nodes parents.
   */
  async parentsAllowed(node: HierarchyNode, permissionType: string, assertionFn = yes) {
    if (this.hierarchyRoot()) return false;

    const parents = await this.getParents() || [],
          parentsAllowed = await Promise.all(
            parents.map(p => p.isAllowed(node, permissionType, assertionFn))
          );

    return parentsAllowed.some(Boolean);
  }


  /**
   *  Determine what subclass of node this node is.
   */
  getNodeSubclass(): NodeClass {
    let nodeClass = this.getClass();
    while (this._getClassOf(nodeClass.prototype) !== Node) {
      nodeClass = this._getClassOf(nodeClass.prototype);
    }
    return nodeClass;
  }


  /**
   *  Retrieve permissions hierarchy for this node.
   */
  async getPermissionsHierarchy(): Promise<PermissionsGraph> {
    const { permissions = [] } = this.doc;

    const graph = {
      node: this.toString(),
      permissions: <Array<Permission>> permissions
    };

    if (!this.hierarchyRoot()) {
      const parents = await this.getParents();
      if (parents.length) {
        graph['parents'] = await Promise.all(parents.map(p => p.getPermissionsHierarchy()));
      }
    }

    return graph;
  }


}
