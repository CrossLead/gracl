import { Permission } from './interfaces';

export function noop() { }
export function yes() { return true; }

export function baseCompare(a, b) {
  return Number(a > b) - Number(a < b);
}

export function binaryIndexOf(arr: Array<any>, el, compare = baseCompare) {
  let low = 0,
      high = arr.length - 1;

  while (low <= high) {
    const pivot = (high + low) >> 1,
          diff  = compare(el, arr[pivot]);

    if (diff > 0)       low  = pivot + 1;
    else if (diff < 0)  high = pivot - 1;
    else                return pivot;
  }

  return -low - 1;
}

export function permissionCompare(a: Permission, b: Permission) {
  return baseCompare(a.subjectId, b.subjectId);
}

export function permissionIndexOf(arr: Array<Permission>, subjectId: string): number {
  return binaryIndexOf(arr, { subjectId }, permissionCompare);
}
