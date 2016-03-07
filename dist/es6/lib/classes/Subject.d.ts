import { Resource, AccessResult } from './Resource';
import { Node, PermOpts } from './Node';
export declare class Subject extends Node {
    determineAccess(resource: Resource, permissionType: string, options?: PermOpts): Promise<AccessResult>;
    isAllowed(resource: Resource, permissionType: string, options?: PermOpts): Promise<boolean>;
    explainPermission(resource: Resource, permissionType: string, options?: PermOpts): Promise<string>;
}
