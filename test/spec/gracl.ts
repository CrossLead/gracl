/// <reference path='../../typings/main.d.ts' />
import { expect } from 'chai';
import * as classes from '../classes/index';
import * as helpers from '../helpers/index';

describe('gracl', () => {
  let orgA,
      orgB,
      teamA1,
      teamA2,
      teamA3,
      teamB1,
      userA1,
      userA2,
      userB1,
      blogA1,
      blogB1,
      postB1a,
      postB1b,
      postA1a;

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

  // run before each test
  beforeEach(resetTestData);


  it('Retrieving document from repository should work', async() => {
    expect(
      await classes.orgModel.getEntity(orgA.id),
      'Memory Repository should sucessfully set items'
    ).to.equal(orgA);
  });


  it('Resource.getParents() should return Resource instances of parent objects', async() => {
    const resource = new classes.Post(postA1a);
    const [ parent ] = await resource.getParents();
    expect(parent, 'Returned parent should be gracl node instance.').to.be.instanceof(classes.Blog);
    expect(parent.getId(), 'Correct parent should be returned.').to.equal(blogA1.id);
  });


  it('Resource.allow(Subject, <perm>) -> subject can access resource.', async() => {
    const resource = new classes.Post(postA1a),
          subject = new classes.User(userA1);

    const initialAllowed = await resource.isAllowed(subject, 'view');

    expect(
      await resource.allow(subject, 'view'),
      'Setting permission should return same resource type.'
    ).to.be.instanceof(classes.Post);

    const afterSetAllowed = await resource.isAllowed(subject, 'view');

    expect(initialAllowed, 'the subject should not yet be allowed to view the resource.').to.equal(false);
    expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
  });


  it('Resource.allow(parentSubject, <perm>) -> child subject can access resource.', async() => {
    const parentResource = new classes.Blog(blogA1),
          childResource = new classes.Post(postA1a),
          subject = new classes.User(userA1);

    const initialAllowed = await childResource.isAllowed(subject, 'view');

    expect(
      await parentResource.allow(subject, 'view'),
      'Setting permission for parentSubject should return same resource type.'
    ).to.be.instanceof(classes.Blog);

    const afterSetAllowed = await childResource.isAllowed(subject, 'view');

    expect(initialAllowed, 'the child subject should not yet be allowed to view the resource.').to.equal(false);
    expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
  });


  it('parentResource.allow(parentSubject, <perm>) -> child subject can access child resource.', async() => {
    const parentResource = new classes.Blog(blogA1),
          childResource  = new classes.Post(postA1a),
          parentSubject  = new classes.Team(teamA1),
          childSubject   = new classes.User(userA1);

    const initialAllowed = await childResource.isAllowed(childSubject, 'view');

    expect(
      await parentResource.allow(parentSubject, 'view'),
      'Setting permission for parentSubject should return same resource type.'
    ).to.be.instanceof(classes.Blog);

    const afterSetAllowed = await childResource.isAllowed(childSubject, 'view');

    expect(initialAllowed, 'the child subject should not yet be allowed to view the resource.').to.equal(false);
    expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
  });


  it('Permissions should be visible through resource.getPermissionsHierarchy()', async() => {
    const parentResource = new classes.Blog(blogA1),
          childResource = new classes.Post(postA1a),
          subject = new classes.User(userA1);

    await parentResource.allow(subject, 'view');

    // get hierarchy with childResource as root.
    const hiearchy = await childResource.getPermissionsHierarchy();

    expect(hiearchy.node, 'Node should be string representation.').to.equal(childResource.toString());
    expect(hiearchy.parents[0].permissions, 'Parent resource should have one permission.').to.have.length(1);
    expect(hiearchy.parents[0].permissions[0].access['view'], 'View access should be true').to.equal(true);
  });


});
