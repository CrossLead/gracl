# [`gracl`](https://github.com/CrossLead/gracl) - Graph ACL [![Build Status](https://travis-ci.org/CrossLead/gracl.svg?branch=master)](https://travis-ci.org/CrossLead/gracl)

  `gracl` is an Access Control List library for managing permission models utilizing a hierarchy. In `gracl`, the permissions
  hierarchy is implemented using the prototype chain, and (Java/Type)script's great reflection capabilities.

## Usage Example

### Example problem...

Say you built an app for managing blogs within organizations. Within your database, you may different organizations (clients),
which each have different blogs, which each have unique posts. Additionally, users within each organization belong to specific
teams. Overall, we can define two hierarchies within the database, one for Subjects and one for resources.

In this lingo, we are defining "Subjects" as objects which are allowed or denied access to "Resources".

```
Subject Hierarchy           Resource Hierarchy

  +------------+             +------------+
  |Organization|             |Organization|
  +------+-----+             +------+-----+
         |                          |
         v                          v
      +--+-+                     +--+-+
      |Team|                     |Blog|
      +--+-+                     +--+-+
         |                          |
         v                          v
      +--+-+                     +--+-+
      |User|                     |Post|
      +----+                     +----+
```

First looking at the subject Hierarchy, we see users are the lowest unit, above them are teams, and above teams
are organizations. This means that when checking if a user has access to a given resource, we first check to see if
they specifically have access to the resource. If not, we then check if any of their teams have access to the resource,
and finally, if still no answer, we check if the organization the user has access to has access to the specific resource.

This is all well and good if we define specific permissions for each blog post, but that doesn't seem practical does it!
However, we don't want to just give the user access to all the posts in the blog (maybe there are executive eyes only posts).

To reconcile this, we also need to introduce a resource hierarchy. This means, for each check on a given subject, we need to check
if that subject has access to the resource at any point in the hierarchy. Moving back to the example, we would first check
to see if the subject has access to a blog post, if no permission was specifically set for the blog post, we then need
to check if the subject has access to the whole blog itself, and then finally if the subject has access to __all__ blogs
for a given organization.

Note, in this example, organizations are __both__ subjects and resources.

### Conflict Resolution

Inevitably, conflicts between allows and denies of specific permissions will arise. For example (using the hierarchies above), consider a user being given acces to a specific post within a blog, but being denied the blog as a whole...

```javascript
await post.allow(user, 'view');
await blog.deny(user, 'view');
```

That is, the user is denied access to the blog itself, but allowed to look at a
specific post. `gracl` reconciles this by making the lowest node in the hierarchy win.
That means that if a user tries to access the post, it will be granted access, but
if the user tries to access the blog, it will be denied.


### Example code

To implement this example model using `gracl`, we would implement the requisite resource and subject classes.

```javascript
// =>> graclClasses.js

// for this example, assume we use mongodb, with separate collections for each entity
// assume we have models defined with getEntity(id: string) => Promise<Document> methods defined
import { OrganizationModel, TeamModel, UserModel, BlogModel, PostModel } from './models';

// import the gracl base classes
import { Subject, Resource } from 'gracl';

export class OrganizationResource extends Resource {
  static id = '_id';
  static repository = OrganizationModel;
}

export class OrganizationSubject extends Subject {
  static id = '_id';
  static repository = OrganizationModel;
}

// Moving down the subject hierarchy chain, we simply extend the upper class
export class TeamSubject extends OrganizationSubject {
  static repository = TeamModel;
  // we need to define the property on Team documents which contains the parent id(s)
  // -- alternatively, a method of signature getParents() => Promise<Resource|Subject> can be
  //    directly defined.
  static parentId = 'organizationId';
}

export class UserSubject extends TeamSubject {
  static repository = UserModel;
  static parentId = 'teamIds';
}

export class BlogResource extends OrganizationResource {
  static repository = BlogModel;
  static parentId = 'organizationId';
}

export class PostResource extends BlogResource {
  static repository = PostModel;
  static parentId = 'blogId';
}

```

Once we've implemented the classes, we can use them to add / deny permission and check for access.

```javascript
import {
  UserSubject,
  PostResource
} from './graclClasses';


export async function giveUserViewPermissionForPost(user, post) {
  const subject = new UserSubject(user),
        resource = new PostResource(post);

  /**
   *  add specific permission for this subject to view this resource.

      Note: the permission values here (second parameter of allow()) can be
      any arbitrary string. calling resource.allow(subject, permissionString)
      will create a permissions entry on the resource as follows:

      resource === {
        ...other_properties,
        permissions: [
          { subjectId: <subjectId>,
            access: {
              [permissionString]: true,
              ...(other permissions if exist)
            }
          }, ...(other subjects if exist)
        ]
      }
   */
  return await resource.allow(subject, 'view');
}

export async function checkUserViewPermissionForPost(user, post) {
  const subject = new UserSubject(user),
        resource = new PostResource(post);

  // recursively check entire hierarchy
  return await subject.isAllowed(resource, 'view');
}
```

## Dev setup

  1. run `npm install`
  2. run `npm run build`

## Development tasks (`npm run <task>`)
  - `build` : install type definintions and compile the project
  - `pretest` : recompile for testing
  - `test` : run mocha tests
  - `tscompile` : compile typescript -> es6
  - `typings` : install type definitions
  - `browserify` : compile es6 -> es5
  - `minify` : minify es5 output
  - `docs` : build documentation locally
  - `gh-pages` : build documentation and publish to github pages
  - `lint` : run tslint on project
