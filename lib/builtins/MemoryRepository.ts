import { Repository, Document } from "../interfaces";

/**
 * Trivial in memory repository for example / testing
 */
export class MemoryRepository implements Repository {

  private data;

  constructor(data = {}) {
    this.data = data;
  }

  async getEntity(id: string): Promise<Document> {
    return this.data[id];
  }

  async saveEntity(id: string, doc: Document): Promise<Document> {
    return this.data[id] = doc;
  }

}
