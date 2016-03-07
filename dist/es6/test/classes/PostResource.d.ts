import { MemoryRepository as Repo } from '../../lib/index';
import { BlogResource } from './BlogResource';
export declare const postModel: Repo;
export declare class PostResource extends BlogResource {
    static repository: Repo;
    static parentId: string;
}
