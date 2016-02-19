/**
 *  Repository spec for use by Subject and Resource classes
 */

export interface Repository {
  find(id: String): Promise<any>;
}
