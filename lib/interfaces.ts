
export interface Repository {
  getEntity(id: string): Promise<Document>;
  saveEntity(id: string, doc: Document): Promise<Document>;
}

export interface Permission {
  type: string,
  ids: Array<string>
}

export interface Document {
  permissions?: Array<Permission>
}
