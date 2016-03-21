import { Repository, Document } from '../interfaces';
import { Node } from '../classes/Node';
/**
 * Trivial in memory repository for example / testing
 */
export class MemoryRepository implements Repository {

  private data: { [key: string]: any };

  constructor(data = {}) {
    this.data = data;
  }

  async getEntity(id: string, node?: Node): Promise<Document> {
    return this.data[id];
  }

  async saveEntity(id: string, doc: Document, node?: Node): Promise<Document> {
    return this.data[id] = doc;
  }

}
