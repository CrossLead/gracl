/**
 * Interfaces for externally defined objects
 */


export interface Repository {
  getEntity(id: string): Promise<Document>;
  saveEntity(id: string, doc: Document): Promise<Document>;
}


export interface Permission {
  subjectId: string,
  access?: {
    [key: string]: boolean
  }
}


export interface Document {
  permissions?: Array<Permission>
}
