import { MemoryRepository as Repo } from '../../lib/index';
import { BlogResource } from './BlogResource';
export const postModel = new Repo();
export class PostResource extends BlogResource {
}
PostResource.repository = postModel;
PostResource.parentId = 'blogId';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9zdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY2xhc3Nlcy9Qb3N0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQUUsZ0JBQWdCLElBQUksSUFBSSxFQUFFLE1BQU0saUJBQWlCO09BQ25ELEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCO0FBRTdDLE9BQU8sTUFBTSxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUVwQyxrQ0FBa0MsWUFBWTtBQUc5QyxDQUFDO0FBRlEsdUJBQVUsR0FBRyxTQUFTLENBQUM7QUFDdkIscUJBQVEsR0FBRyxRQUFRLENBQzNCIn0=