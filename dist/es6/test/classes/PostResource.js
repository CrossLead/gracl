"use strict";
const index_1 = require('../../lib/index');
const BlogResource_1 = require('./BlogResource');
exports.postModel = new index_1.MemoryRepository();
class PostResource extends BlogResource_1.BlogResource {
}
PostResource.repository = exports.postModel;
PostResource.parentId = 'blogId';
exports.PostResource = PostResource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUG9zdFJlc291cmNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jbGFzc2VzL1Bvc3RSZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0JBQXlDLGlCQUFpQixDQUFDLENBQUE7QUFDM0QsK0JBQTZCLGdCQUFnQixDQUFDLENBQUE7QUFFakMsaUJBQVMsR0FBRyxJQUFJLHdCQUFJLEVBQUUsQ0FBQztBQUVwQywyQkFBa0MsMkJBQVk7QUFHOUMsQ0FBQztBQUZRLHVCQUFVLEdBQUcsaUJBQVMsQ0FBQztBQUN2QixxQkFBUSxHQUFHLFFBQVEsQ0FBQztBQUZoQixvQkFBWSxlQUd4QixDQUFBIn0=