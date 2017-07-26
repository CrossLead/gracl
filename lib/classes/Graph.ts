import { Node } from './Node';
import { Subject } from './Subject';
import { Resource } from './Resource';
import { Repository } from '../interfaces';
import { topologicalSort } from '../util';


export interface SchemaNode {
  name: string;
  repository: Repository;
  id?: string;
  parent?: string;
  parentId?: string;
  permissionProperty?: string;
  getParents?: typeof Node.prototype.getParents;
  getPermission?: typeof Resource.prototype.getPermission;
}


export type Schema = {
  resources: SchemaNode[];
  subjects:  SchemaNode[];
};


/**
  Class for building Resource/Subject class hierarchy based on schema
 */
export class Graph {

  /**
   *  Build map of nodeName -> ResourceClass for gracl hierarchy
      NOTE: unfortunately we need to duplicate this function for subjects
            due to limitations of the way type parameters are handled
        See: https://github.com/Microsoft/TypeScript/issues/4890
   */
  static buildResourceHierachy(schemaNodes: SchemaNode[]): Map<string, typeof Resource> {
    const nodeList = topologicalSort(schemaNodes),
          classGraph = new Map<string, typeof Resource>();

    const createClass = (node: SchemaNode) => {
      const getParentsMethod = node.getParents || Node.prototype.getParents;
      const getPermissionMethod = node.getPermission || Resource.prototype.getPermission;


      if (node.parent) {
        const ParentClass = classGraph.get(node.parent)!;
        classGraph.set(node.name, class extends ParentClass {
          static id          = node.id || 'id';
          static parentId    = node.parentId!;
          static displayName = node.name;
          static repository  = node.repository;
          static permissionPropertyKey = node.permissionProperty || 'permissions';
          getParents() { return getParentsMethod.call(this); }
          getPermission(subject: Subject) { return getPermissionMethod.call(this, subject); }
        });
      } else {
        classGraph.set(node.name, class extends Resource {
          static id          = node.id || 'id';
          static displayName = node.name;
          static repository  = node.repository;
          static permissionPropertyKey = node.permissionProperty || 'permissions';
          getPermission(subject: Subject) { return getPermissionMethod.call(this, subject); }
        });
      }
    };

    nodeList.forEach(createClass);
    return classGraph;
  }


  /**
   *  Build map of nodeName -> SubjectClass for gracl hierarchy
      NOTE: this is a duplicate of buildResourceHierachy that
            is necessary for reasons explained above due to limitations
            in the type system.
   */
  static buildSubjectHierachy(schemaNodes: SchemaNode[]): Map<string, typeof Subject> {
    const nodeList = topologicalSort(schemaNodes),
          classGraph = new Map<string, typeof Subject>();

    const createClass = (node: SchemaNode) => {
      const getParentsMethod = node.getParents || Node.prototype.getParents;

      if (node.parent) {
        const ParentClass = classGraph.get(node.parent)!;
        classGraph.set(node.name, class extends ParentClass {
          static id          = node.id || 'id';
          static parentId    = node.parentId!;
          static displayName = node.name;
          static repository  = node.repository;
          static permissionPropertyKey = node.permissionProperty || 'permissions';
          getParents() { return getParentsMethod.call(this); }
        });
      } else {
        classGraph.set(node.name, class extends Subject {
          static id          = node.id || 'id';
          static displayName = node.name;
          static repository  = node.repository;
          static permissionPropertyKey = node.permissionProperty || 'permissions';
        });
      }
    };

    nodeList.forEach(createClass);

    return classGraph;
  }


  static resolveNodeName(node: string | typeof Node): string {
    return typeof node === 'string'
      ? node
      : node.displayName;
  }


  /**
    Properties to contain generated classes
   */
  resources: Map<string, typeof Resource>;
  subjects: Map<string, typeof Subject>;
  subjectChildMap = new Map<string, Map<string, typeof Subject>>();
  resourceChildMap = new Map<string, Map<string, typeof Resource>>();


  constructor(public schema: Schema) {
    this.resources = Graph.buildResourceHierachy(schema.resources);
    this.subjects = Graph.buildSubjectHierachy(schema.subjects);

    // invert resource graph
    this.resources.forEach((ChildResource, childName) => {
      const parentResources = ChildResource.getHierarchyClassNames();
      parentResources.forEach(parentName => {
        if (!this.resourceChildMap.has(parentName)) this.resourceChildMap.set(parentName, new Map());
        if (parentName !== childName) this.resourceChildMap.get(parentName)!.set(childName, ChildResource);
      });
    });

    // invert subject graph
    this.subjects.forEach((ChildSubject, childName) => {
      const parentSubjects = ChildSubject.getHierarchyClassNames();
      parentSubjects.forEach(parentName => {
        if (!this.subjectChildMap.has(parentName)) this.subjectChildMap.set(parentName, new Map());
        if (parentName !== childName) this.subjectChildMap.get(parentName)!.set(childName, ChildSubject);
      });
    });
  }


  /**
   *  Extract a node class from the graph if it exists
   */
  getClass(node: string | typeof Node, type: 'subject' | 'resource'): typeof Resource | typeof Subject {
    const name = Graph.resolveNodeName(node);

    let map: Map<string, typeof Resource | typeof Subject>;
    switch (type) {
      case 'subject':  map = this.subjects;  break;
      case 'resource': map = this.resources; break;
      default: throw new Error(`Invalid class type ${type}, must be subject or resource!`);
    }

    if (map.has(name)) return map.get(name)!;

    throw new Error(`No ${type} class found for ${name}!`);
  }


  /**
   *  Extract a resource class from the graph if it exists
   */
  getResource(node: string | typeof Node): typeof Resource {
    const name = Graph.resolveNodeName(node);
    return <typeof Resource> this.getClass(name, 'resource');
  }

  /**
   *  Extract a subject class from the graph if it exists
   */
  getSubject(node: string | typeof Node): typeof Subject {
    const name = Graph.resolveNodeName(node);
    return <typeof Subject> this.getClass(name, 'subject');
  }

  getChildResources(node: string | typeof Node): Array<typeof Resource> {
    const name = Graph.resolveNodeName(node);
    if (!this.resources.has(name)) throw new Error(`No resource class found for ${name}!`);
    return Array.from(this.resourceChildMap.get(name)!.values());
  }

  getChildSubjects(node: string | typeof Node): Array<typeof Subject> {
    const name = Graph.resolveNodeName(node);
    if (!this.subjects.has(name)) throw new Error(`No subject class found for ${name}!`);
    return Array.from(this.subjectChildMap.get(name)!.values());
  }

  getParentResources(node: string | typeof Node): Array<typeof Resource> {
    const name = Graph.resolveNodeName(node);
    const ResourceClass = this.getResource(name);
    return ResourceClass
      .getHierarchyClassNames()
      .filter(n => n !== name)
      .map(n => this.getResource(n));
  }

  getParentSubjects(node: string | typeof Node): Array<typeof Subject> {
    const name = Graph.resolveNodeName(node);
    const SubjectClass = this.getSubject(name);
    return SubjectClass
      .getHierarchyClassNames()
      .filter(n => n !== name)
      .map(n => this.getSubject(n));
  }

}
