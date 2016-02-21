# Graph ACL [![Build Status](https://travis-ci.org/CrossLead/gracl.svg?branch=master)](https://travis-ci.org/CrossLead/gracl)

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

### Example code

To implement this example model using `gracl`, we would implement the requisite resource and subject classes.

## Dev setup

  1. run `npm install`
  2. run `npm run build`

## Build chain
  1. Compile with `tsc` targeting ES6 to allow async functions, outputting directory to `./dist`
  2. Run `browserify` with `babelify` to convert ES6 -> ES5 and pull in modules, writing to `./dist/gracl.js`
  3. Uglify `./dist/gracl.js` -> `./dist/gracl.min.js`
