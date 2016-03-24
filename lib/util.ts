import { Permission } from './interfaces';
import { Node } from './classes/Node';
import { Hash } from './interfaces';

export function noop() { }
export function yes() { return true; }

export function baseCompare(a: any, b: any) {
  return Number(a > b) - Number(a < b);
}

export function binaryIndexOf(arr: any[], el: any, compare = baseCompare) {
  let low = 0,
      high = arr.length - 1;

  while (low <= high) {
    const pivot = (high + low) >> 1,
          diff  = compare(el, arr[pivot]);

    if (diff > 0)       low  = pivot + 1;
    else if (diff < 0)  high = pivot - 1;
    else                return pivot;
  }

  return -1;
}

export function permissionCompare(a: Permission, b: Permission) {
  return baseCompare(a.subjectId, b.subjectId);
}

export function permissionIndexOf(arr: Permission[], subjectId: string): number {
  return binaryIndexOf(arr, { subjectId }, permissionCompare);
}

export function getClassOf(node: any): typeof Node {
  return <typeof Node> Object.getPrototypeOf(node).constructor;
}


/**
  Run topological sort on nodes
  https://en.wikipedia.org/wiki/Topological_sorting#Kahn.27s_algorithm
 */
export function topologicalSort(nodes: Hash<string>[], nameKey = 'name', parentKey = 'parent'): Hash<string>[] {
  const nodeList: Hash<string>[] = [],
        noParentList: Hash<string>[] = [],
        parentMapping = new Map<string, Hash<string>[]>(),
        remainingNodes = new Set(nodes.map(n => n[nameKey]));


  for (const schemaNode of nodes) {
    const name   = schemaNode[nameKey],
          parent = schemaNode[parentKey];

    if (!name) {
      throw new Error(`No ${nameKey} field on node = ${schemaNode}`);
    }

    if (!parent) {
      noParentList.push(schemaNode);
      remainingNodes.delete(schemaNode[nameKey]);
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
    if (parentMapping.has(rootNode[nameKey])) {
      const children = parentMapping.get(rootNode[nameKey]);
      while (children.length) {
        const child = children.pop();
        remainingNodes.delete(child[nameKey]);
        noParentList.push(child);
      }
    }
  }

  if (remainingNodes.size) {
    throw new Error(
      'Schema has a circular dependency or a missing parent! Examine definitions for '
        + [...remainingNodes].map(x => `"${x}"`).join(', ')
    );
  }

  return nodeList;
}
