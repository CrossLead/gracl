import { Repository, Document } from '../interfaces';
import { Node } from '../classes/Node';
export declare class MemoryRepository implements Repository {
    private data;
    constructor(data?: {});
    getEntity(id: string, node?: Node): Promise<Document>;
    saveEntity(id: string, doc: Document, node?: Node): Promise<Document>;
}
