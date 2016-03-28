import { MemoryRepository as Repo, Subject, Resource } from '../../lib/index';
export declare const orgModel: Repo;
export declare class OrganizationResource extends Resource {
    static id: string;
    static repository: Repo;
    static permissionPropertyKey: string;
}
export declare class OrganizationSubject extends Subject {
    static id: string;
    static repository: Repo;
    static permissionPropertyKey: string;
}
