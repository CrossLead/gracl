import { Repository, Document } from '../interfaces';
import { Subject } from './Subject';
import { Resource } from './Resource';
export declare type HierarchyNode = Subject | Resource;
export declare type DocumentData = string | Document;
export declare type PermOpts = {
    assertionFn?: () => boolean;
};
export declare class Node {
    doc: Document;
    static displayName: string;
    static parentId: string;
    static id: string;
    static repository: Repository;
    static getHierarchyClassNames(): string[];
    constructor(doc: Document);
    getName(): string;
    toString(): string;
    isNodeType(nc: typeof Node): boolean;
    getParentClass(): typeof Node;
    getClass(): typeof Node;
    hierarchyRoot(): boolean;
    getId(): string;
    getRepository(): Repository;
    isAllowed(node: HierarchyNode, permissionType: string, options: PermOpts): Promise<Boolean>;
    getParents(): Promise<Node[]>;
    getParentNode(data: DocumentData): Promise<Node>;
    assertNodeClass(nodeClass: typeof Node): void;
    getNodeSubclass(): typeof Node;
    getNodeDepth(): number;
    getHierarchyIds(): Promise<string[]>;
    getHierarchyClassNames(): string[];
}
