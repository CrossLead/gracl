import { Node } from './classes/Node';
export interface Repository {
    getEntity(id: string, node?: Node): Promise<Document>;
    saveEntity(id: string, doc: Document, node?: Node): Promise<Document>;
}
export declare type Permission = {
    [key: string]: any;
    subjectId: string;
    resourceId: string;
    access?: {
        [key: string]: boolean;
    };
};
export declare type Document = any;
