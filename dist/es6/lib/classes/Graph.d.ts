import { Node } from './Node';
import { Subject } from './Subject';
import { Resource } from './Resource';
import { Repository } from '../interfaces';
export declare type SchemaNode = {
    [key: string]: any;
    name: string;
    repository: Repository;
    id?: string;
    parent?: string;
    parentId?: string;
    permissionProperty?: string;
    getParents?: () => Promise<Node[]>;
};
export declare type Schema = {
    resources: SchemaNode[];
    subjects: SchemaNode[];
};
export declare class Graph {
    schema: Schema;
    resources: Map<string, typeof Resource>;
    subjects: Map<string, typeof Subject>;
    static buildResourceHierachy(schemaNodes: SchemaNode[]): Map<string, typeof Resource>;
    static buildSubjectHierachy(schemaNodes: SchemaNode[]): Map<string, typeof Subject>;
    constructor(schema: Schema);
    getClass(name: string, type: 'subject' | 'resource'): typeof Resource | typeof Subject;
    getResource(name: string): typeof Resource;
    getSubject(name: string): typeof Subject;
}
