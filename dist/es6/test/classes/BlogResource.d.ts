import { MemoryRepository as Repo } from '../../lib/index';
import { OrganizationResource } from './Organization';
export declare const blogModel: Repo;
export declare class BlogResource extends OrganizationResource {
    static repository: Repo;
    static parentId: string;
}
