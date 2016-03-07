import { Repository, Document } from '../interfaces';
export declare class MemoryRepository implements Repository {
    private data;
    constructor(data?: {});
    getEntity(id: string): Promise<Document>;
    saveEntity(id: string, doc: Document): Promise<Document>;
}
