import { MemoryRepository as Repo } from '../../lib/index';
import { OrganizationSubject } from './Organization';
export const teamModel = new Repo();
export class TeamSubject extends OrganizationSubject {
}
TeamSubject.repository = teamModel;
TeamSubject.parentId = 'organizationId';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVhbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY2xhc3Nlcy9UZWFtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUUsZ0JBQWdCLElBQUksSUFBSSxFQUFFLE1BQU0saUJBQWlCO09BQ25ELEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxnQkFBZ0I7QUFFcEQsT0FBTyxNQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBR3BDLGlDQUFpQyxtQkFBbUI7QUFHcEQsQ0FBQztBQUZRLHNCQUFVLEdBQUcsU0FBUyxDQUFDO0FBQ3ZCLG9CQUFRLEdBQUcsZ0JBQWdCLENBQ25DIn0=