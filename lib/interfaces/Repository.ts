/**
 *  Repository spec for use by Subject and Resource classes
 */

export interface Repository {
  getEntity(id: String): Promise<any>;
}
