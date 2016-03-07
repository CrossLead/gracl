export interface Repository {
    getEntity(id: string): Promise<Document>;
    saveEntity(id: string, doc: Document): Promise<Document>;
}
export declare type Permission = {
    subjectId: string;
    access?: {
        [key: string]: boolean;
    };
};
export declare type Document = any;
