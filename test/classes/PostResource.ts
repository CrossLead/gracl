import { MemoryRepository as Repo } from '../../lib/index';
import { BlogResource } from './BlogResource';

export const postModel = new Repo();

export class PostResource extends BlogResource {
  static repository = postModel;
  static parentId = 'blogId';
  static permissionPropertyKey = 'graclPermissions';
}
