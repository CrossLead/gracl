import { Subject } from './Subject';
import { Node, PermOpts } from './Node';
import { Document, Permission } from '../interfaces';
export declare type AccessResult = {
    type: string;
    access: boolean;
    reason: string;
};
export declare type PermissionsHierarchy = {
    node: string;
    nodeId: string;
    permissions: Permission[];
    parents?: PermissionsHierarchy[];
};
export declare class Resource extends Node {
    constructor(doc: Document);
    sortPermissions(): this;
    setDoc(doc: Document): this;
    getPermission(subject: Subject): Permission;
    determineAccess(subject: Subject, permissionType: string, options?: PermOpts): Promise<AccessResult>;
    isAllowed(subject: Subject, permissionType: string, options?: PermOpts): Promise<boolean>;
    explainPermission(subject: Subject, permissionType: string, options?: PermOpts): Promise<string>;
    updatePermission(subject: Subject, action: (p: Permission) => Permission): Promise<Resource>;
    setPermissionAccess(subject: Subject, permissionType: string, access: boolean): Promise<Resource>;
    allow(subject: Subject, permissionType: string): Promise<Resource>;
    deny(subject: Subject, permissionType: string): Promise<Resource>;
    getPermissionsHierarchy(): Promise<PermissionsHierarchy>;
}
