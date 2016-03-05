import { Subject } from './Subject';
import { Resource } from './Resource';
import { Repository } from '../interfaces';


export type SchemaNode = {
  name: string;
  repository: Repository;
  id?: string;
  parent?: string;
  parentId?: string;
};


export type Schema = {
  resources: SchemaNode[];
  subjects:  SchemaNode[];
};


/**
  Class for building Resource/Subject class hierarchy based on schema
 */
export class Graph {

  /**
    Properties to contain generated classes
   */
  resources: Map<string, typeof Resource>;
  subjects: Map<string, typeof Subject>;


  /**
    Run topological sort on nodes
    https://en.wikipedia.org/wiki/Topological_sorting#Kahn.27s_algorithm
   */
  static sortSchemaNodes(schemaNodes: SchemaNode[]): SchemaNode[] {
    const nodeList: SchemaNode[] = [],
          noParentList: SchemaNode[] = [],
          parentMapping = new Map<string, SchemaNode[]>(),
          remainingNodes = new Set(schemaNodes.map(n => n.name));


    for (const schemaNode of schemaNodes) {
      const { name, parent } = schemaNode;

      if (!parent) {
        noParentList.push(schemaNode);
        remainingNodes.delete(schemaNode.name);
      } else {
        if (!parentMapping.has(parent)) {
          parentMapping.set(parent, [ schemaNode ]);
        } else {
          parentMapping.get(parent).push(schemaNode);
        }
      }
    }

    while (noParentList.length) {
      const rootNode = noParentList.pop();
      nodeList.push(rootNode);
      if (parentMapping.has(rootNode.name)) {
        const children = parentMapping.get(rootNode.name);
        while (children.length) {
          const child = children.pop();
          remainingNodes.delete(child.name);
          noParentList.push(child);
        }
      }
    }

    if (remainingNodes.size) {
      throw new Error(
        'Schema has at least one circular dependency! Examine definitions for ('
          + [...remainingNodes].join(', ') + ')'
      );
    }

    return nodeList;
  }


  /**
   *  Build map of nodeName -> ResourceClass for gracl hierarchy
      NOTE: unfortunately we need to duplicate this function for subjects
            due to limitations of the way type parameters are handled
        See: https://github.com/Microsoft/TypeScript/issues/4890
   */
  static buildResourceHierachy(schemaNodes: SchemaNode[]): Map<string, typeof Resource> {
    const nodeList = Graph.sortSchemaNodes(schemaNodes),
          classGraph = new Map<string, typeof Resource>();

    const createClass = (node: SchemaNode) => {
      if (node.parent) {
        const ParentClass = classGraph.get(node.parent);
        classGraph.set(node.name, class extends ParentClass {
          static id          = node.id || 'id';
          static parentId    = node.parentId;
          static displayName = node.name;
          static repository  = node.repository;
        });
      } else {
        classGraph.set(node.name, class extends Resource {
          static id          = node.id || 'id';
          static displayName = node.name;
          static repository  = node.repository;
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
    const nodeList = Graph.sortSchemaNodes(schemaNodes),
          classGraph = new Map<string, typeof Subject>();

    const createClass = (node: SchemaNode) => {
      if (node.parent) {
        const ParentClass = classGraph.get(node.parent);
        classGraph.set(node.name, class extends ParentClass {
          static id          = node.id || 'id';
          static parentId    = node.parentId;
          static displayName = node.name;
          static repository  = node.repository;
        });
      } else {
        classGraph.set(node.name, class extends Subject {
          static id          = node.id || 'id';
          static displayName = node.name;
          static repository  = node.repository;
        });
      }
    };

    nodeList.forEach(createClass);
    return classGraph;
  }


  constructor(public schema: Schema) {
    this.resources = Graph.buildResourceHierachy(schema.resources);
    this.subjects = Graph.buildSubjectHierachy(schema.subjects);
  }


  /**
   *  Extract a node class from the graph if it exists
   */
  getClass(name: string, type: 'subject' | 'resource'): typeof Resource | typeof Subject {
    let map: Map<string, typeof Resource | typeof Subject>;
    switch (type) {
      case 'subject':  map = this.subjects;  break;
      case 'resource': map = this.resources; break;
      default: throw new Error(`Invalid class type ${type}, must be subject or resource!`);
    }

    if (map.has(name)) return map.get(name);

    throw new Error(`No ${type} class found for ${name}!`);
  }


  /**
   *  Extract a resource class from the graph if it exists
   */
  getResource(name: string): typeof Resource {
    return <typeof Resource> this.getClass(name, 'resource');
  }


  /**
   *  Extract a subject class from the graph if it exists
   */
  getSubject(name: string): typeof Subject {
    return <typeof Subject> this.getClass(name, 'subject');
  }


}
