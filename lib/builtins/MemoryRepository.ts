import { Repository } from "../interfaces/Repository";

/**
 * Trivial in memory repository for example / testing
 */
export default class MemoryRepository implements Repository {

  private data;

  constructor(data = {}) {
    this.data = data;
  }

  async find(id: string): Promise<any> {
    return this.data[id];
  }

}
