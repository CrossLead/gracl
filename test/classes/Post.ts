import { MemoryRepository as Repo } from '../../lib/index';
import { Blog } from './Blog';

export const postModel = new Repo();

export class Post extends Blog {
  static repository = postModel;
  async getParents() {
    return [ await this.getParentObject(this.doc.blogId) ];
  }
}
