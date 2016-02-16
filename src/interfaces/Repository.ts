export interface Repository {
  getEntity(id: String): Promise<any>;
}
