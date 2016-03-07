import { MemoryRepository as Repo } from '../../lib/index';
import { TeamSubject } from './TeamSubject';
export declare const userModel: Repo;
export declare class UserSubject extends TeamSubject {
    static repository: Repo;
    static parentId: string;
}
