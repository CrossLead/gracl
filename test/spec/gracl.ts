import * as _ from 'lodash';
import * as classes from '../classes/index';
import * as helpers from '../helpers/index';
import { captureLogStream } from '../helpers/captureLogStream';
import { Node } from '../../lib/classes/Node';
import { Hash } from '../../lib/interfaces';
import * as util from '../../lib/util';
import { Resource, Subject, MemoryRepository, Graph } from '../../lib/gracl';
import test from 'ava';

type TestNodeClasses = {
  PostResource: typeof Resource;
  BlogResource: typeof Resource;
  UserSubject: typeof Subject;
  TeamSubject: typeof Subject;
  OrganizationResource: typeof Resource;
  OrganizationSubject: typeof Subject;
};

const permissionKey = 'graclPermissions';

const graph = new Graph({
  resources: [
    {
      permissionProperty: permissionKey,
      name: 'Post',
      parent: 'Blog',
      parentId: 'blogId',
      repository: classes.postModel
    },
    {
      permissionProperty: permissionKey,
      name: 'Blog',
      parent: 'Organization',
      parentId: 'organizationId',
      repository: classes.blogModel
    },
    {
      permissionProperty: permissionKey,
      name: 'Organization',
      repository: classes.orgModel
    }
  ],
  subjects: [
    {
      permissionProperty: permissionKey,
      name: 'User',
      parent: 'Team',
      parentId: 'teamIds',
      repository: classes.userModel
    },
    {
      permissionProperty: permissionKey,
      name: 'Team',
      parent: 'Organization',
      parentId: 'organizationId',
      repository: classes.teamModel
    },
    {
      permissionProperty: permissionKey,
      name: 'Organization',
      repository: classes.orgModel
    }
  ]
});

const graphClasses = {
  PostResource: graph.getResource('Post'),
  BlogResource: graph.getResource('Blog'),
  UserSubject: graph.getSubject('User'),
  TeamSubject: graph.getSubject('Team'),
  OrganizationResource: graph.getResource('Organization'),
  OrganizationSubject: graph.getSubject('Organization')
};

let orgA: any,
  orgB: any,
  teamA1: any,
  teamA2: any,
  teamA3: any,
  teamB1: any,
  userA1: any,
  userA2: any,
  userB1: any,
  blogA1: any,
  blogB1: any,
  postB1a: any,
  postB1b: any,
  postA1a: any;

test.beforeEach(async () => {
  helpers.uidReset();

  // setup, add documents to models
  orgA = helpers.org();
  orgB = helpers.org();

  teamA1 = helpers.team(orgA);
  teamA2 = helpers.team(orgA);
  teamA3 = helpers.team(orgA);
  teamB1 = helpers.team(orgB);

  userA1 = helpers.user([teamA1, teamA2]);
  userA2 = helpers.user([teamA1, teamA3]);
  userB1 = helpers.user([teamB1]);

  blogA1 = helpers.blog(orgA);
  blogB1 = helpers.blog(orgB);

  postB1a = helpers.post(blogB1);
  postB1b = helpers.post(blogB1);
  postA1a = helpers.post(blogA1);

  await Promise.all([
    classes.orgModel.saveEntity(orgA.id, orgA),
    classes.orgModel.saveEntity(orgB.id, orgB),

    classes.teamModel.saveEntity(teamA1.id, teamA1),
    classes.teamModel.saveEntity(teamA2.id, teamA2),
    classes.teamModel.saveEntity(teamA3.id, teamA3),
    classes.teamModel.saveEntity(teamB1.id, teamB1),

    classes.userModel.saveEntity(userA1.id, userA1),
    classes.userModel.saveEntity(userA2.id, userA2),
    classes.userModel.saveEntity(userB1.id, userB1),

    classes.blogModel.saveEntity(blogA1.id, blogA1),
    classes.blogModel.saveEntity(blogB1.id, blogB1),

    classes.postModel.saveEntity(postA1a.id, postA1a),
    classes.postModel.saveEntity(postB1a.id, postB1a),
    classes.postModel.saveEntity(postB1b.id, postB1b)
  ]);
});

test('yes() should return true', t => {
  t.true(util.yes());
});

test('noop() should return void', t => {
  t.is(util.noop(), void 0);
});

test('baseCompare() should correctly order items', t => {
  t.is(util.baseCompare('x', 'y'), -1, 'a < b  -> -1');
  t.is(util.baseCompare('y', 'x'), 1, 'a > b  -> 1');
  t.is(util.baseCompare('x', 'x'), 0, 'a == b -> 0');
});

test('binaryIndexOf() should correctly find indexes on sorted arrays', t => {
  const A = ['a', 'b', 'c', 'd'],
    B = ['t', 'u', 'v', 'w', 'x', 'y', 'z'];

  t.is(util.binaryIndexOf(A, 'c'), 2, 'Correctly finds c in the array');
  t.is(util.binaryIndexOf(B, 'y'), 5, 'Correctly finds y in the array');
  t.is(util.binaryIndexOf(B, 'q'), -1, 'Returns -1 on not finding value');
});

test('topologicalSort should correctly sort nodes', t => {
  const nodes = <Hash<string>[]>[
    { name: 'B', parent: 'A' },
    { name: 'A', parent: 'C' },
    { name: 'C' }
  ];

  t.deepEqual(util.topologicalSort(nodes), [
    { name: 'C' },
    { name: 'A', parent: 'C' },
    { name: 'B', parent: 'A' }
  ]);
});

test('topologicalSort should throw when given a bad node', t => {
  const nodes = <Hash<string>[]>[
    { name: 'B', parent: 'A' },
    { name: 'A', parent: 'C' },
    { BAD_NODE: 'C' }
  ];

  t.throws(() => util.topologicalSort(nodes), /No name field on node/);
});

test('topologicalSort should detect circular dependencies', t => {
  const nodes = <Hash<string>[]>[
    { name: 'A', parent: 'B' },
    { name: 'B', parent: 'A' }
  ];

  t.throws(
    () => util.topologicalSort(nodes),
    /Schema has a circular dependency or a missing parent/
  );
});

/**
 *
 * TODO: this is an odd es2015 classes bug...
 *
 */

// test.serial('Creating a node subclass without a repository should throw on instantiation', (t) => {

//   t.throws(() => {
//     class TestResource extends Resource {}
//     const result = new TestResource({});
//   }, 'Instantiate Resource');
//   t.throws(() => {
//     class TestSubject extends Subject {}
//     const result = new TestSubject({});
//   }, 'Instantiate Subject');

// });

test.serial('Retrieving document from repository should work', async t => {
  t.is(
    await classes.orgModel.getEntity(orgA.id),
    orgA,
    'Memory Repository should sucessfully set items'
  );
});

test.serial('Graph classes should have proper inheritance chain', t => {
  const {
    PostResource,
    BlogResource,
    UserSubject,
    TeamSubject,
    OrganizationResource,
    OrganizationSubject
  } = graphClasses;

  const PostResourceInstance = new PostResource({ id: 1 });
  const BlogResourceInstance = new BlogResource({ id: 1 });
  const UserSubjectInstance = new UserSubject({ id: 1 });
  const TeamSubjectInstance = new TeamSubject({ id: 1 });
  const OrganizationResourceInstance = new OrganizationResource({ id: 1 });
  const OrganizationSubjectInstance = new OrganizationSubject({ id: 1 });

  t.true(PostResourceInstance instanceof BlogResource, 'Post -> Blog');
  t.true(PostResourceInstance instanceof OrganizationResource, 'Post -> Org');
  t.true(UserSubjectInstance instanceof TeamSubject, 'User -> Team');
  t.true(UserSubjectInstance instanceof OrganizationSubject, 'User -> Org');
});

test.serial('Graph classes return correct node depth', t => {
  const { BlogResource, UserSubject } = graphClasses;

  t.is(BlogResource.getNodeDepth(), 2);
  t.is(UserSubject.getNodeDepth(), 3);
});

test.serial('Graph should throw if there is an undefined parent', t => {
  const createGraph = () =>
    new Graph({
      resources: [
        {
          name: 'Post',
          parent: 'Blog',
          parentId: 'blogId',
          repository: classes.postModel
        },
        // no blog defined...
        // { name: 'Blog', parent: 'Organization', parentId: 'organizationId', repository: classes.blogModel },
        { name: 'Organization', repository: classes.orgModel }
      ],
      subjects: [
        {
          name: 'User',
          parent: 'Team',
          parentId: 'teamIds',
          repository: classes.userModel
        },
        {
          name: 'Team',
          parent: 'Organization',
          parentId: 'organizationId',
          repository: classes.teamModel
        },
        { name: 'Organization', repository: classes.orgModel }
      ]
    });

  t.throws(createGraph);
});

test.serial('Graph should throw if there is a circular dependency', t => {
  const createGraph = () =>
    new Graph({
      resources: [
        {
          name: 'Post',
          parent: 'Blog',
          parentId: 'blogId',
          repository: classes.postModel
        },
        {
          name: 'Blog',
          parent: 'Organization',
          parentId: 'organizationId',
          repository: classes.blogModel
        },
        { name: 'Organization', parent: 'Post', repository: classes.orgModel }
      ],
      subjects: [
        {
          name: 'User',
          parent: 'Team',
          parentId: 'teamIds',
          repository: classes.userModel
        },
        {
          name: 'Team',
          parent: 'Organization',
          parentId: 'organizationId',
          repository: classes.teamModel
        },
        { name: 'Organization', repository: classes.orgModel }
      ]
    });

  t.throws(createGraph);
});

test.serial(
  'Retrieving parent and child nodes from graph should succeed',
  t => {
    const UserSubject = graph.getSubject('User');
    const PostResource = graph.getResource('Post');
    const OrganizationResource = graph.getResource('Organization');
    const OrganizationSubject = graph.getResource('Organization');

    const resourceChildrenOfOrganization = graph.getChildResources(
      OrganizationResource
    );
    const subjectChildrenOfOrganization = graph.getChildSubjects(
      OrganizationSubject
    );
    const subjectParentsOfUser = graph.getParentSubjects(UserSubject);
    const resourceParentsOfPost = graph.getParentResources(PostResource);

    t.deepEqual(_.map(resourceChildrenOfOrganization, 'displayName'), [
      'Blog',
      'Post'
    ]);

    t.deepEqual(_.map(subjectChildrenOfOrganization, 'displayName'), [
      'Team',
      'User'
    ]);

    t.deepEqual(_.map(subjectParentsOfUser, 'displayName'), [
      'Team',
      'Organization'
    ]);

    t.deepEqual(_.map(resourceParentsOfPost, 'displayName'), [
      'Blog',
      'Organization'
    ]);
  }
);

test.serial(
  `Graph should throw when trying to retrieve classes that don't exist`,
  t => {
    t.throws(
      () => graph.getClass('DOESNT_EXIST', 'subject'),
      /No subject class found for DOESNT_EXIST/
    );
    t.throws(
      () => (<any>graph).getClass('User', 'INVALID'),
      /Invalid class type/
    );
  }
);

test.serial(
  'Failed assertion that nodeClass is instanceof Node should throw',
  t => {
    t.throws(
      () => (<any>Node).assertNodeClass({}),
      /is not an instance of Node/
    );
  }
);

_.forEach(
  [
    {
      description: 'user instantiated classes',
      classes: classes
    },
    {
      description: 'classes created by graph',
      classes: graphClasses
    }
  ],
  test => {
    runNodeTestsWithClasses(test.description, test.classes);
  }
);

function runNodeTestsWithClasses(
  description: string,
  nodeClasses: TestNodeClasses
) {
  test.serial(
    description + ' getRepository should return correct repository',
    t => {
      const resource = new nodeClasses.PostResource(postA1a);
      t.is(resource.getRepository(), nodeClasses.PostResource.repository);
    }
  );

  test.serial(description + ' isNodeType assertion should be correct', t => {
    const resource = new nodeClasses.PostResource(postA1a);
    t.is(resource.isNodeType(nodeClasses.PostResource), true);
    t.is(resource.isNodeType(nodeClasses.BlogResource), false);
  });

  test.serial(
    description + ' Expect Resource.getNodeDepth to return correct depth',
    t => {
      const resource = new nodeClasses.PostResource(postA1a);
      t.is(resource.getNodeDepth(), 3);
    }
  );

  test.serial(
    description + ' Expect Resource.setDoc to populate permissions',
    async t => {
      const resource = new nodeClasses.PostResource(postA1a);
      delete postA1a['graclPermissions'];
      t.falsy(postA1a['graclPermissions']);
      resource.setDoc(postA1a);
      t.truthy(postA1a['graclPermissions']);
    }
  );

  test.serial(
    description + ' getParentNode should return correct parent class',
    async t => {
      const resource = new nodeClasses.PostResource(postA1a);
      const parent = await resource.getParentNode(blogA1);
      t.true(parent instanceof nodeClasses.BlogResource);
    }
  );

  test.serial(
    description + ' getParents should warn if calling on root',
    async t => {
      const resource = new nodeClasses.OrganizationResource(orgA);
      const hook = captureLogStream(process.stderr);
      const parents = await resource.getParents();
      hook.unhook();
      t.regex(hook.captured(), /Calling Node.getParents()/);
    }
  );

  test.serial(
    description + ' calling isAllowed without overriding should throw',
    async t => {
      const resource = new nodeClasses.OrganizationResource(orgA);
      const subject = new nodeClasses.OrganizationSubject(orgA);
      const isAllowed = nodeClasses.OrganizationResource.prototype.isAllowed;
      const resourceIsAllowed = Resource.prototype.isAllowed;
      delete Resource.prototype.isAllowed;
      delete nodeClasses.OrganizationResource.prototype.isAllowed;
      let threw = false;
      try {
        await resource.isAllowed(subject, 'view');
      } catch (e) {
        t.regex(e.message, /Calling Node.isAllowed()/);
        threw = true;
      }
      t.true(threw);
      Resource.prototype.isAllowed = resourceIsAllowed;
      nodeClasses.OrganizationResource.prototype.isAllowed = isAllowed;
    }
  );

  test.serial(
    description +
      ' getParentNode should throw if there is no available repository',
    async t => {
      const resource = new nodeClasses.PostResource(postA1a);
      const repository = nodeClasses.BlogResource.repository;
      (<any>nodeClasses.BlogResource).repository = false;
      let threw = false;
      try {
        await resource.getParentNode('TEST');
      } catch (e) {
        t.regex(e.message, /No static repository property present on/);
        threw = true;
      }
      t.true(threw);
      nodeClasses.BlogResource.repository = repository;
    }
  );

  test.serial(
    description +
      ' Resource.getParents() should return Resource instances of parent objects',
    async t => {
      const resource = new nodeClasses.PostResource(postA1a);
      const [parent] = await resource.getParents();
      t.is(
        parent instanceof nodeClasses.BlogResource,
        true,
        'Returned parent should be gracl node instance.'
      );
      t.is(parent.getId(), blogA1.id, 'Correct parent should be returned.');
    }
  );

  test.serial(
    description +
      ' Resource.allow(Subject, <perm>) -> subject can access resource.',
    async t => {
      const resource = new nodeClasses.PostResource(postA1a),
        subject = new nodeClasses.UserSubject(userA1);

      const initialAllowed = await resource.isAllowed(subject, 'view');

      t.true(
        (await resource.allow(subject, 'view')) instanceof
          nodeClasses.PostResource,
        'Setting permission should return same resource type.'
      );

      const afterSetAllowed = await resource.isAllowed(subject, 'view');

      t.false(
        initialAllowed,
        'the subject should not yet be allowed to view the resource.'
      );
      t.true(
        afterSetAllowed,
        'After resource sets permission, they should have access'
      );
    }
  );

  test.serial(
    description + ' Resource and Subject methods should return same result',
    async t => {
      const resource = new nodeClasses.PostResource(postA1a),
        subject = new nodeClasses.UserSubject(userA1);

      await resource.allow(subject, 'view');

      t.deepEqual(
        await resource.isAllowed(subject, 'view'),
        await subject.isAllowed(resource, 'view'),
        'is allowed result should be the same'
      );

      t.deepEqual(
        await resource.determineAccess(subject, 'view'),
        await subject.determineAccess(resource, 'view'),
        'determine access result should be the same'
      );

      t.deepEqual(
        await resource.explainPermission(subject, 'view'),
        await subject.explainPermission(resource, 'view'),
        'explain permission result should be the same'
      );
    }
  );

  test.serial(
    description +
      ' Resource.allow(Subject, <perm>) -> resource should have permission with subjectType and resourceType set.',
    async t => {
      const resource = new nodeClasses.PostResource(postA1a),
        subject = new nodeClasses.UserSubject(userA1);

      await resource.allow(subject, 'view');

      const [permission] = resource.doc[permissionKey];
      t.is(permission.resourceType, resource.getName());
      t.is(permission.subjectType, subject.getName());
    }
  );

  test.serial(
    description +
      ' Resource.allow(Subject, <perm>) -> resource should not have permission with subjectType and resourceType set if failing assertionFn.',
    async t => {
      const resource = new nodeClasses.PostResource(postA1a),
        subject = new nodeClasses.UserSubject(userA1);

      await resource.allow(subject, 'view');

      t.false(
        await resource.isAllowed(subject, 'view', { assertionFn: () => false })
      );
    }
  );

  test.serial(
    description +
      ' Resource.allow(parentSubject, <perm>) -> child subject can access resource.',
    async t => {
      const parentResource = new nodeClasses.BlogResource(blogA1),
        childResource = new nodeClasses.PostResource(postA1a),
        subject = new nodeClasses.UserSubject(userA1);

      const initialAllowed = await childResource.isAllowed(subject, 'view');

      t.true(
        (await parentResource.allow(subject, 'view')) instanceof
          nodeClasses.BlogResource,
        'Setting permission for parentSubject should return same resource type.'
      );

      const afterSetAllowed = await childResource.isAllowed(subject, 'view');

      t.false(
        initialAllowed,
        'the child subject should not yet be allowed to view the resource.'
      );
      t.true(
        afterSetAllowed,
        'After resource sets permission, they should have access'
      );
    }
  );

  test.serial(
    description +
      ' parentResource.allow(parentSubject, <perm>) -> child subject can access child resource.',
    async t => {
      const parentResource = new nodeClasses.BlogResource(blogA1),
        childResource = new nodeClasses.PostResource(postA1a),
        parentSubject = new nodeClasses.TeamSubject(teamA1),
        childSubject = new nodeClasses.UserSubject(userA1);

      const initialAllowed = await childResource.isAllowed(
        childSubject,
        'view'
      );

      t.true(
        (await parentResource.allow(parentSubject, 'view')) instanceof
          nodeClasses.BlogResource,
        'Setting permission for parentSubject should return same resource type.'
      );

      t.true(
        (await parentResource.allow(parentSubject, 'view')) instanceof
          nodeClasses.BlogResource,
        'Calling allow twice should succeed'
      );

      const afterSetAllowed = await childResource.isAllowed(
        childSubject,
        'view'
      );

      t.false(
        initialAllowed,
        'the child subject should not yet be allowed to view the resource.'
      );
      t.true(
        afterSetAllowed,
        'After resource sets permission, they should have access'
      );
    }
  );

  test.serial(
    description +
      ' Permissions should be visible through resource.getPermissionsHierarchy()',
    async t => {
      const parentResource = new nodeClasses.BlogResource(blogA1),
        childResource = new nodeClasses.PostResource(postA1a),
        subject = new nodeClasses.UserSubject(userA1);

      await parentResource.allow(subject, 'view');

      // get hierarchy with childResource as root.
      const hiearchy = await childResource.getPermissionsHierarchy();

      t.is(
        hiearchy.node,
        childResource.toString(),
        'Node should be string representation.'
      );
      t.is(
        hiearchy.parents![0].permissions.length,
        1,
        'Parent resource should have one permission.'
      );
      t.true(
        hiearchy.parents![0].permissions[0].access!['view'],
        'View access should be true'
      );
    }
  );

  /**
   *
      Post(Blog):
        - deny team access
      Blog:
        - allow team acces
      results:
        - user and team can access whole blog, except post
   */
  test.serial(
    description +
      ' Lowest node on hierarchy wins conflicts (deny post for team)',
    async t => {
      const parentResource = new nodeClasses.BlogResource(blogA1),
        childResource = new nodeClasses.PostResource(postA1a),
        parentSubject = new nodeClasses.TeamSubject(teamA1),
        childSubject = new nodeClasses.UserSubject(userA1);

      t.false(
        await childResource.isAllowed(childSubject, 'view'),
        'User should not have access to post before permission set.'
      );

      // allow team -> blog access
      await parentResource.allow(parentSubject, 'view');
      // deny team specific access to post
      await childResource.deny(parentSubject, 'view');

      t.true(
        await parentResource.isAllowed(parentSubject, 'view'),
        'Team should have access to blog after permission set'
      );

      t.false(
        await childResource.isAllowed(parentSubject, 'view'),
        'Team should not have access to post after permission set.'
      );

      t.true(
        await parentResource.isAllowed(childSubject, 'view'),
        'User should have access to blog after permission set'
      );

      t.false(
        await childResource.isAllowed(childSubject, 'view'),
        'User should not have access to post after permission set.'
      );
    }
  );

  /**
   *
      Post(Blog):
        - deny team access
        - allow user access
      Blog:
        - deny user access
        - allow team acces
      results:
        - user can access specific post, but not blog itself
        - team can access blog wholistically, but not specific post
   */
  test.serial(
    description +
      ' Lowest node on hierarchy wins conflicts (deny post for team, but allow for user)',
    async t => {
      const parentResource = new nodeClasses.BlogResource(blogA1),
        childResource = new nodeClasses.PostResource(postA1a),
        parentSubject = new nodeClasses.TeamSubject(teamA1),
        childSubject = new nodeClasses.UserSubject(userA1);

      t.false(
        await childResource.isAllowed(childSubject, 'view'),
        'User should not have access to post before permission set.'
      );

      // allow team -> blog access
      await parentResource.allow(parentSubject, 'view');
      // deny team specific access to post
      await childResource.deny(parentSubject, 'view');
      // allow child specifically to access post
      await childResource.allow(childSubject, 'view');
      // deny child specifically to access blog
      await parentResource.deny(childSubject, 'view');

      t.true(
        await parentResource.isAllowed(parentSubject, 'view'),
        'Team should have access to blog after permission set'
      );

      t.false(
        await childResource.isAllowed(parentSubject, 'view'),
        'Team should not have access to post after permission set.'
      );

      t.false(
        await parentResource.isAllowed(childSubject, 'view'),
        'User should not have access to blog after permission set'
      );

      t.true(
        await childResource.isAllowed(childSubject, 'view'),
        'User should have access to post after permission set.'
      );
    }
  );

  test.serial(
    description +
      ' childResource.deny(parentSubject) should win over parentResource.allow(childSubject)',
    async t => {
      const parentResource = new nodeClasses.BlogResource(blogA1),
        childResource = new nodeClasses.PostResource(postA1a),
        parentSubject = new nodeClasses.TeamSubject(teamA1),
        childSubject = new nodeClasses.UserSubject(userA1);

      await parentResource.allow(childSubject, 'view');
      await childResource.deny(parentSubject, 'view');

      const access = await childResource.isAllowed(childSubject, 'view');

      t.false(access, 'should not have access');
    }
  );

  test.serial(
    description + ' Permission explainations should be accurate',
    async t => {
      const parentResource = new nodeClasses.BlogResource(blogA1),
        childResource = new nodeClasses.PostResource(postA1a),
        parentSubject = new nodeClasses.TeamSubject(teamA1),
        childSubject = new nodeClasses.UserSubject(userA1);

      // allow team -> blog access
      await parentResource.allow(parentSubject, 'view');
      // deny team specific access to post
      await childResource.deny(parentSubject, 'view');

      const reason = `Permission set on <Resource:${childResource.getName()} id=p0014> for <Subject:${parentSubject.getName()} id=t003> = false`;

      t.is(
        await childResource.explainPermission(childSubject, 'view'),
        reason,
        'Explaining why child subject cannot access child resource'
      );
    }
  );

  test.serial(
    description +
      ' Subject method results should equal resource method results',
    async t => {
      const parentResource: Resource = new nodeClasses.BlogResource(blogA1),
        childResource: Resource = new nodeClasses.PostResource(postA1a),
        parentSubject: Subject = new nodeClasses.TeamSubject(teamA1),
        childSubject: Subject = new nodeClasses.UserSubject(userA1);

      // allow team -> blog access
      await parentResource.allow(parentSubject, 'view');
      // deny team specific access to post
      await childResource.deny(parentSubject, 'view');

      t.is(
        await parentResource.isAllowed(parentSubject, 'view'),
        await parentSubject.isAllowed(parentResource, 'view'),
        'Team should have access to blog after permission set'
      );

      t.is(
        await childResource.isAllowed(parentSubject, 'view'),
        await parentSubject.isAllowed(childResource, 'view'),
        'Team should not have access to post after permission set.'
      );

      t.is(
        await parentResource.isAllowed(childSubject, 'view'),
        await childSubject.isAllowed(parentResource, 'view'),
        'User should have access to blog after permission set'
      );

      t.is(
        await childResource.isAllowed(childSubject, 'view'),
        await childSubject.isAllowed(childResource, 'view'),
        'User should have access to post after permission set.'
      );
    }
  );

  test.serial(
    description +
      ' Node.getHierarchyIds() should return flattened array of correct ids',
    async t => {
      const childResource: Resource = new nodeClasses.PostResource(postA1a);
      t.deepEqual(
        await childResource.getHierarchyIds(),
        ['p0014', 'b0010', 'o001'],
        'Post -> Blog -> Org'
      );
    }
  );

  test.serial(
    description +
      ' Node.getHierarchyClassNames() should return array of class names',
    t => {
      const childResource: Resource = new nodeClasses.PostResource(postA1a),
        childSubject: Subject = new nodeClasses.UserSubject(userA1);

      const name = (c: any) => <string>(c.displayName || c.name);

      t.deepEqual(
        childResource.getHierarchyClassNames(),
        [
          name(nodeClasses.PostResource),
          name(nodeClasses.BlogResource),
          name(nodeClasses.OrganizationResource)
        ],
        'resource class names'
      );

      t.deepEqual(
        childSubject.getHierarchyClassNames(),
        [
          name(nodeClasses.UserSubject),
          name(nodeClasses.TeamSubject),
          name(nodeClasses.OrganizationSubject)
        ],
        'subject class names'
      );
    }
  );

  test.serial(
    description + ' Should get access through parent having access to itself',
    async t => {
      const parentResource: Resource = new nodeClasses.OrganizationResource(
          orgA
        ),
        parentSubject: Subject = new nodeClasses.OrganizationSubject(orgA),
        childSubject: Subject = new nodeClasses.UserSubject(userA1);

      // allow team -> blog access
      await parentResource.allow(parentSubject, 'view');
      const perm = await parentResource.determineAccess(childSubject, 'view');
      t.true(
        perm['view'].access,
        'child should have access through parent -> parent'
      );
    }
  );

  /**
   * say a user has two teams, and one of those teams is denied access
     to a given component, while the other team is allowed access to the same
     component -- gracl should return deny. Additionally, the same
     logic should apply if there are multiple resources with conflicting access
   */
  test.serial(
    description +
      ' multiple resogetParentResources with conflicting access at the same hierarchy depth should default to deny',
    async t => {
      const subject: Subject = new nodeClasses.UserSubject(userA1);
      const resource: Resource = new nodeClasses.PostResource(postA1a);
      const [parentSubject1, parentSubject2] = await subject.getParents();

      await resource.deny(<Subject>parentSubject2, 'view');
      await resource.allow(<Subject>parentSubject1, 'view');

      t.false(await resource.isAllowed(subject, 'view'));
    }
  );

  test.serial(
    description + ' checking multiple perms should short circuit correctly',
    async t => {
      const subject: Subject = new nodeClasses.UserSubject(userA1);
      const resource: Resource = new nodeClasses.PostResource(postA1a);
      const [parentSubject1, parentSubject2] = await subject.getParents();

      await resource.deny(<Subject>parentSubject2, 'deniedPerm');
      await resource.allow(<Subject>parentSubject1, 'deniedPerm');
      await resource.allow(subject, 'allowedPerm');

      const accessResults = await resource.determineAccess(subject, [
        'deniedPerm',
        'allowedPerm'
      ]);

      t.false(
        accessResults['deniedPerm'].access,
        'conflicting parent perm should be false after short circuit'
      );
      t.true(
        accessResults['allowedPerm'].access,
        'perm with no conflict should be true'
      );
    }
  );
}
