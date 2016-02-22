import { MemoryRepository as Repo } from '../../lib/index';
import { Team } from './Team';

export const userModel = new Repo();

export class User extends Team {
  static repository = userModel;
  static parentIdProperty = 'teamIds';
}
