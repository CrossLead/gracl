import { Permission } from './interfaces';
import { Node } from './classes/Node';

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
