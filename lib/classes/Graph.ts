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

    if (remainingNodes.size) throw new Error('Schema has at least one cycle!');
    return nodeList;
  }


  /**
   *  Build map of nodeName -> ResourceClass for gracl hierarchy
      NOTE: unfortunately we need to duplicate this function for subjects
            due to limitations of the way type parameters are handled
        See: https://github.com/Microsoft/TypeScript/issues/4890
   */
  static buildResourceHierachy(schemaNodes: SchemaNode[], BaseClass: typeof Resource): Map<string, typeof Resource> {
    const nodeList = Graph.sortSchemaNodes(schemaNodes),
          classGraph = new Map<string, typeof Resource>();

    for (const node of nodeList) {
      if (node.parent) {
        const ParentClass = classGraph.get(node.parent);
        classGraph.set(node.name, class extends ParentClass {
          static id = node.id || 'id';
          static parentId = node.parentId;
          static displayName = node.name;
          static repository = node.repository;
        });
      } else {
        classGraph.set(node.name, class extends BaseClass {
          static id = node.id || 'id';
          static displayName = node.name;
          static repository = node.repository;
        });
      }
    }

    return classGraph;
  }


  /**
   *  Build map of nodeName -> SubjectClass for gracl hierarchy
      NOTE: this is a duplicate of buildResourceHierachy that
            is necessary for reasons explained above due to limitations
            in the type system.
   */
  static buildSubjectHierachy(schemaNodes: SchemaNode[], BaseClass: typeof Subject): Map<string, typeof Subject> {
    const nodeList = Graph.sortSchemaNodes(schemaNodes),
          classGraph = new Map<string, typeof Subject>();

    for (const node of nodeList) {
      if (node.parent) {
        const ParentClass = classGraph.get(node.parent);
        classGraph.set(node.name, class extends ParentClass {
          static id = node.id || 'id';
          static parentId = node.parentId;
          static displayName = node.name;
          static repository = node.repository;
        });
      } else {
        classGraph.set(node.name, class extends BaseClass {
          static id = node.id || 'id';
          static displayName = node.name;
          static repository = node.repository;
        });
      }
    }

    return classGraph;
  }


  constructor(public schema: Schema) {
    this.resources = Graph.buildResourceHierachy(schema.resources, Resource);
    this.subjects = Graph.buildSubjectHierachy(schema.subjects, Subject);
  }


}
