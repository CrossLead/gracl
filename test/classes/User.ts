import { MemoryRepository as Repo } from '../../lib/index';
import { Team } from './Team';

export const userModel = new Repo();

export class User extends Team {
  static repository = userModel;
  async getParents() {
    const teamIds: Array<string> = this.doc.teamIds;
    return Promise.all(teamIds.map(this.getParentObject.bind(this)));
  }
}
