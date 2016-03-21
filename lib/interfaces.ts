import { Node } from './classes/Node';
/**
 * External repository / database / storage engine
 */
export interface Repository {
  getEntity(id: string, node?: Node): Promise<Document>;
  saveEntity(id: string, doc: Document, node?: Node): Promise<Document>;
};


/**
 * Permission object added by Resource nodes
 */
export type Permission = {
  [key: string]: any,
  subjectId: string;
  resourceId: string,
  subjectType: string,
  resourceType: string,
  access?: {
    [key: string]: boolean;
  };
};


export type Document = any;
