import { MemoryRepository as Repo } from '../../lib/index';
import { OrganizationSubject } from './Organization';
export declare const teamModel: Repo;
export declare class TeamSubject extends OrganizationSubject {
    static repository: Repo;
    static parentId: string;
    static permissionPropertyKey: string;
}
