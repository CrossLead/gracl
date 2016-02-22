/**
 * External repository / database / storage engine
 */
export interface Repository {
  getEntity(id: string): Promise<Document>;
  saveEntity(id: string, doc: Document): Promise<Document>;
}


/**
 * Permission object added by Resource nodes
 */
export interface Permission {
  subjectId: string;
  access?: {
    [key: string]: boolean
  };
}


export type Document = any;
