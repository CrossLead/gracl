import { MemoryRepository as Repo } from '../../lib/index';
import { OrganizationResource } from './Organization';
export const blogModel = new Repo();
export class BlogResource extends OrganizationResource {
}
BlogResource.repository = blogModel;
BlogResource.parentId = 'organizationId';
BlogResource.permissionPropertyKey = 'graclPermissions';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmxvZ1Jlc291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jbGFzc2VzL0Jsb2dSZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFFLGdCQUFnQixJQUFJLElBQUksRUFBRSxNQUFNLGlCQUFpQjtPQUNuRCxFQUFFLG9CQUFvQixFQUFFLE1BQU0sZ0JBQWdCO0FBRXJELE9BQU8sTUFBTSxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUVwQyxrQ0FBa0Msb0JBQW9CO0FBSXRELENBQUM7QUFIUSx1QkFBVSxHQUFHLFNBQVMsQ0FBQztBQUN2QixxQkFBUSxHQUFHLGdCQUFnQixDQUFDO0FBQzVCLGtDQUFxQixHQUFHLGtCQUFrQixDQUNsRCJ9