/// <reference path='../../typings/main.d.ts' />
import { expect } from 'chai';
import * as classes from '../classes/index';
import * as helpers from '../helpers/index';
import { Resource, Subject, MemoryRepository, Graph } from '../../lib/index';

type TestNodeClasses = {
  PostResource: typeof Resource;
  BlogResource: typeof Resource;
  UserSubject: typeof Subject;
  TeamSubject: typeof Subject;
  OrganizationResource: typeof Resource;
  OrganizationSubject: typeof Subject;
}

const permissionKey = 'graclPermissions';

const graph = new Graph({
  resources: [
    { permissionProperty: permissionKey, name: 'Post', parent: 'Blog', parentId: 'blogId', repository: classes.postModel },
    { permissionProperty: permissionKey, name: 'Blog', parent: 'Organization', parentId: 'organizationId', repository: classes.blogModel },
    { permissionProperty: permissionKey, name: 'Organization', repository: classes.orgModel }
  ],
  subjects: [
    { permissionProperty: permissionKey, name: 'User', parent: 'Team', parentId: 'teamIds', repository: classes.userModel },
    { permissionProperty: permissionKey, name: 'Team', parent: 'Organization', parentId: 'organizationId', repository: classes.teamModel },
    { permissionProperty: permissionKey, name: 'Organization', repository: classes.orgModel }
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

describe('gracl', () => {
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

  const resetTestData = async () => {
    helpers.uidReset();

    // setup, add documents to models
    orgA = helpers.org();
    orgB = helpers.org();

    teamA1 = helpers.team(orgB);
    teamA2 = helpers.team(orgB);
    teamA3 = helpers.team(orgB);
    teamB1 = helpers.team(orgB);

    userA1 = helpers.user([ teamA1, teamA2 ]);
    userA2 = helpers.user([ teamA1, teamA3 ]);
    userB1 = helpers.user([ teamB1 ]);

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

  };

  describe('- Class tests', () => {

    // run before each test
    beforeEach(resetTestData);

    it('Creating a node subclass without a repository should throw on instantiation', () => {
      class TestResource extends Resource {};
      class TestSubject extends Subject {};
      expect(() => new TestResource({}), 'Instantiate Resource').to.throw();
      expect(() => new TestResource({}), 'Instantiate Subject').to.throw();
    });

    it('Should use displayName if provided in Node.toString()', () => {
      class TestResource extends Resource {
        static displayName = 'MY_RESOURCE';
        static repository = new MemoryRepository();
      }

      const node = new TestResource({ id: 1 });
      expect(node.getName()).to.equal(TestResource.displayName);
      expect(node.toString()).to.equal(`<Resource:${TestResource.displayName} id=1>`);
    });


    it('Retrieving document from repository should work', async() => {
      expect(
        await classes.orgModel.getEntity(orgA.id),
        'Memory Repository should sucessfully set items'
      ).to.equal(orgA);
    });

  });

  describe('- Graph specific tests', () => {

    // run before each test
    beforeEach(resetTestData);

    it('Graph classes should have proper inheritance chain', () => {
      const {
        PostResource,
        BlogResource,
        UserSubject,
        TeamSubject,
        OrganizationResource,
        OrganizationSubject
      } = graphClasses;

      const PostResourceInstance         = new PostResource({ id: 1 });
      const BlogResourceInstance         = new BlogResource({ id: 1 });
      const UserSubjectInstance          = new UserSubject({ id: 1 });
      const TeamSubjectInstance          = new TeamSubject({ id: 1 });
      const OrganizationResourceInstance = new OrganizationResource({ id: 1 });
      const OrganizationSubjectInstance  = new OrganizationSubject({ id: 1 });


      expect(PostResourceInstance, 'Post -> Blog').to.be.instanceof(BlogResource);
      expect(PostResourceInstance, 'Post -> Org').to.be.instanceof(OrganizationResource);
      expect(UserSubjectInstance, 'User -> Team').to.be.instanceof(TeamSubject);
      expect(UserSubjectInstance, 'User -> Org').to.be.instanceof(OrganizationSubject);
    });

    it('Graph should throw if there is an undefined parent', () => {
      const createGraph = () => new Graph({
        resources: [
          { name: 'Post', parent: 'Blog', parentId: 'blogId', repository: classes.postModel },
          // no blog defined...
          // { name: 'Blog', parent: 'Organization', parentId: 'organizationId', repository: classes.blogModel },
          { name: 'Organization', repository: classes.orgModel }
        ],
        subjects: [
          { name: 'User', parent: 'Team', parentId: 'teamIds', repository: classes.userModel },
          { name: 'Team', parent: 'Organization', parentId: 'organizationId', repository: classes.teamModel },
          { name: 'Organization', repository: classes.orgModel }
        ]
      });

      expect(createGraph).to.throw();
    });


    it('Graph should throw if there is a circular dependency', () => {
      const createGraph = () => new Graph({
        resources: [
          { name: 'Post', parent: 'Blog', parentId: 'blogId', repository: classes.postModel },
          { name: 'Blog', parent: 'Organization', parentId: 'organizationId', repository: classes.blogModel },
          { name: 'Organization', parent: 'Post', repository: classes.orgModel }
        ],
        subjects: [
          { name: 'User', parent: 'Team', parentId: 'teamIds', repository: classes.userModel },
          { name: 'Team', parent: 'Organization', parentId: 'organizationId', repository: classes.teamModel },
          { name: 'Organization', repository: classes.orgModel }
        ]
      });

      expect(createGraph).to.throw();
    });

  });


  describe('- Node permission tests', () => {

    // run before each test
    beforeEach(resetTestData);

    const testCases = [
      {
        description: 'user instantiated classes',
        classes: classes
      },
      {
        description: 'classes created by graph',
        classes: graphClasses
      }
    ];


    testCases.forEach(test => {
      describe('- Permissions tests using ' + test.description, () => {
        runNodeTestsWithClasses(test.classes);
      });
    });


    function runNodeTestsWithClasses(nodeClasses: TestNodeClasses) {


      it('Resource.getParents() should return Resource instances of parent objects', async() => {
        const resource = new nodeClasses.PostResource(postA1a);
        const [ parent ] = await resource.getParents();
        expect(parent, 'Returned parent should be gracl node instance.').to.be.instanceof(nodeClasses.BlogResource);
        expect(parent.getId(), 'Correct parent should be returned.').to.equal(blogA1.id);
      });


      it('Resource.allow(Subject, <perm>) -> subject can access resource.', async() => {
        const resource = new nodeClasses.PostResource(postA1a),
              subject = new nodeClasses.UserSubject(userA1);

        const initialAllowed = await resource.isAllowed(subject, 'view');

        expect(
          await resource.allow(subject, 'view'),
          'Setting permission should return same resource type.'
        ).to.be.instanceof(nodeClasses.PostResource);

        const afterSetAllowed = await resource.isAllowed(subject, 'view');

        expect(initialAllowed, 'the subject should not yet be allowed to view the resource.').to.equal(false);
        expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
      });


      it('Resource.allow(Subject, <perm>) -> resource should have permission with subjectType and resourceType set.', async() => {
        const resource = new nodeClasses.PostResource(postA1a),
              subject = new nodeClasses.UserSubject(userA1);

        await resource.allow(subject, 'view');

        const [ permission ] = resource.doc[permissionKey];
        expect(permission.resourceType).to.equal(resource.getName());
        expect(permission.subjectType).to.equal(subject.getName());
      });


      it('Resource.allow(parentSubject, <perm>) -> child subject can access resource.', async() => {
        const parentResource = new nodeClasses.BlogResource(blogA1),
              childResource = new nodeClasses.PostResource(postA1a),
              subject = new nodeClasses.UserSubject(userA1);

        const initialAllowed = await childResource.isAllowed(subject, 'view');

        expect(
          await parentResource.allow(subject, 'view'),
          'Setting permission for parentSubject should return same resource type.'
        ).to.be.instanceof(nodeClasses.BlogResource);

        const afterSetAllowed = await childResource.isAllowed(subject, 'view');

        expect(initialAllowed, 'the child subject should not yet be allowed to view the resource.').to.equal(false);
        expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
      });


      it('parentResource.allow(parentSubject, <perm>) -> child subject can access child resource.', async() => {
        const parentResource = new nodeClasses.BlogResource(blogA1),
              childResource  = new nodeClasses.PostResource(postA1a),
              parentSubject  = new nodeClasses.TeamSubject(teamA1),
              childSubject   = new nodeClasses.UserSubject(userA1);

        const initialAllowed = await childResource.isAllowed(childSubject, 'view');

        expect(
          await parentResource.allow(parentSubject, 'view'),
          'Setting permission for parentSubject should return same resource type.'
        ).to.be.instanceof(nodeClasses.BlogResource);

        const afterSetAllowed = await childResource.isAllowed(childSubject, 'view');

        expect(initialAllowed, 'the child subject should not yet be allowed to view the resource.').to.equal(false);
        expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
      });


      it('Permissions should be visible through resource.getPermissionsHierarchy()', async() => {
        const parentResource = new nodeClasses.BlogResource(blogA1),
              childResource = new nodeClasses.PostResource(postA1a),
              subject = new nodeClasses.UserSubject(userA1);

        await parentResource.allow(subject, 'view');

        // get hierarchy with childResource as root.
        const hiearchy = await childResource.getPermissionsHierarchy();

        expect(hiearchy.node, 'Node should be string representation.').to.equal(childResource.toString());
        expect(hiearchy.parents[0].permissions, 'Parent resource should have one permission.').to.have.length(1);
        expect(hiearchy.parents[0].permissions[0].access['view'], 'View access should be true').to.equal(true);
      });


      /**
       *
          Post(Blog):
            - deny team access

          Blog:
            - allow team acces

          results:
            - user and team can access whole blog, except post
       */
      it('Lowest node on hierarchy wins conflicts (deny post for team)', async () => {
        const parentResource = new nodeClasses.BlogResource(blogA1),
              childResource  = new nodeClasses.PostResource(postA1a),
              parentSubject  = new nodeClasses.TeamSubject(teamA1),
              childSubject   = new nodeClasses.UserSubject(userA1);

        expect(
          await childResource.isAllowed(childSubject, 'view'),
          'User should not have access to post before permission set.'
        ).to.equal(false);

        // allow team -> blog access
        await parentResource.allow(parentSubject, 'view');
        // deny team specific access to post
        await childResource.deny(parentSubject, 'view');

        expect(
          await parentResource.isAllowed(parentSubject, 'view'),
          'Team should have access to blog after permission set'
        ).to.equal(true);

        expect(
          await childResource.isAllowed(parentSubject, 'view'),
          'Team should not have access to post after permission set.'
        ).to.equal(false);

        expect(
          await parentResource.isAllowed(childSubject, 'view'),
          'User should have access to blog after permission set'
        ).to.equal(true);

        expect(
          await childResource.isAllowed(childSubject, 'view'),
          'User should not have access to post after permission set.'
        ).to.equal(false);
      });


      it('Explicit false set for permission should win over true set somewhere else in hierarchy (resource)', async () => {
        const parentResource = new nodeClasses.BlogResource(blogA1),
              childResource  = new nodeClasses.PostResource(postA1a),
              subject        = new nodeClasses.UserSubject(userA1);

        await childResource.allow(subject, 'view');
        const preDenyAccess = await childResource.isAllowed(subject, 'view');

        await parentResource.deny(subject, 'view');
        const postDenyAccess = await childResource.isAllowed(subject, 'view');

        expect(preDenyAccess, 'before denying parent, should have access').to.equal(true);
        expect(postDenyAccess, 'after denying parent, should have access').to.equal(false);
      });


      it('Explicit false set for permission should win over true set somewhere else in hierarchy (subject)', async () => {
        const resource = new nodeClasses.BlogResource(blogA1),
              parentSubject  = new nodeClasses.TeamSubject(teamA1),
              childSubject   = new nodeClasses.UserSubject(userA1);

        await resource.allow(childSubject, 'view');
        const preDenyAccess = await resource.isAllowed(childSubject, 'view');

        await resource.deny(parentSubject, 'view');
        const postDenyAccess = await resource.isAllowed(childSubject, 'view');

        expect(preDenyAccess, 'before denying parent, should have access').to.equal(true);
        expect(postDenyAccess, 'after denying parent, should have access').to.equal(false);
      });


      it('Permission explainations should be accurate', async () => {
        const parentResource = new nodeClasses.BlogResource(blogA1),
              childResource  = new nodeClasses.PostResource(postA1a),
              parentSubject  = new nodeClasses.TeamSubject(teamA1),
              childSubject   = new nodeClasses.UserSubject(userA1);

        // allow team -> blog access
        await parentResource.allow(parentSubject, 'view');
        // deny team specific access to post
        await childResource.deny(parentSubject, 'view');

        const reason = `Permission set on <Resource:${childResource.getName()} id=p0014> for <Subject:${parentSubject.getName()} id=t003> = false`;

        expect(
          await childResource.explainPermission(childSubject, 'view'),
          'Explaining why child subject cannot access child resource'
        ).to.equal(reason);
      });


      it('Subject method results should equal resource method results', async () => {
        const parentResource: Resource = new nodeClasses.BlogResource(blogA1),
              childResource: Resource  = new nodeClasses.PostResource(postA1a),
              parentSubject: Subject  = new nodeClasses.TeamSubject(teamA1),
              childSubject: Subject   = new nodeClasses.UserSubject(userA1);

        // allow team -> blog access
        await parentResource.allow(parentSubject, 'view');
        // deny team specific access to post
        await childResource.deny(parentSubject, 'view');

        expect(
          await parentResource.isAllowed(parentSubject, 'view'),
          'Team should have access to blog after permission set'
        ).to.equal(await parentSubject.isAllowed(parentResource, 'view'));

        expect(
          await childResource.isAllowed(parentSubject, 'view'),
          'Team should not have access to post after permission set.'
        ).to.equal(await parentSubject.isAllowed(childResource, 'view'));

        expect(
          await parentResource.isAllowed(childSubject, 'view'),
          'User should have access to blog after permission set'
        ).to.equal(await childSubject.isAllowed(parentResource, 'view'));

        expect(
          await childResource.isAllowed(childSubject, 'view'),
          'User should have access to post after permission set.'
        ).to.equal(await childSubject.isAllowed(childResource, 'view'));
      });

      it('Node.getHierarchyIds() should return flattened array of correct ids', async() => {
        const childResource: Resource  = new nodeClasses.PostResource(postA1a);
        expect(
          await childResource.getHierarchyIds(),
          'Post -> Blog -> Org'
        ).to.deep.equal([ 'p0014', 'b0010', 'o001' ]);
      });

      it('Node.getHierarchyClassNames() should return array of class names', () => {
        const childResource: Resource = new nodeClasses.PostResource(postA1a),
              childSubject: Subject   = new nodeClasses.UserSubject(userA1);

        const name = (c: any) => <string> (c.displayName || c.name);

        expect(childResource.getHierarchyClassNames(), 'resource class names')
          .to.deep.equal(
            [ name(nodeClasses.PostResource), name(nodeClasses.BlogResource), name(nodeClasses.OrganizationResource) ]
          );

        expect(childSubject.getHierarchyClassNames(), 'subject class names')
          .to.deep.equal(
            [ name(nodeClasses.UserSubject), name(nodeClasses.TeamSubject), name(nodeClasses.OrganizationSubject) ]
          );

      });
    }

  });


});
