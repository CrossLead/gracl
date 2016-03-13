import { Permission } from './interfaces';
import { Node } from './classes/Node';
export declare function noop(): void;
export declare function yes(): boolean;
export declare function baseCompare(a: any, b: any): number;
export declare function binaryIndexOf(arr: any[], el: any, compare?: typeof baseCompare): number;
export declare function permissionCompare(a: Permission, b: Permission): number;
export declare function permissionIndexOf(arr: Permission[], subjectId: string): number;
export declare function getClassOf(node: any): typeof Node;
