import { MemoryRepository as Repo } from '../../lib/index';
import { TeamSubject } from './TeamSubject';

export const userModel = new Repo();

export class UserSubject extends TeamSubject {
  static repository = userModel;
  static parentId = 'teamIds';
  static permissionPropertyKey = 'graclPermissions';
}
