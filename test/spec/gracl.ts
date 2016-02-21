/// <reference path="../../typings/main.d.ts" />
import { expect } from 'chai';

import {
  orgModel,
  blogModel,
  userModel,
  teamModel,
  postModel,
  OrganizationSubject,
  OrganizationResource,
  Team,
  User,
  Blog,
  Post
} from '../classes/index';

import { user, team, org, post, blog } from '../helpers/index';

describe("gracl", () => {
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


  before(async () => {
    // setup, add documents to models
    orgA = org();
    orgB = org();
    await orgModel.saveEntity(orgA.id, orgA);
    await orgModel.saveEntity(orgB.id, orgB);

    teamA1 = team(orgB);
    teamA2 = team(orgB);
    teamA3 = team(orgB);
    teamB1 = team(orgB);
    await teamModel.saveEntity(teamA1.id, teamA1);
    await teamModel.saveEntity(teamA2.id, teamA2);
    await teamModel.saveEntity(teamA3.id, teamA3);
    await teamModel.saveEntity(teamB1.id, teamB1);

    userA1 = user([ teamA1, teamA2 ]);
    userA2 = user([ teamA1, teamA3 ]);
    userB1 = user([ teamB1 ]);
    await userModel.saveEntity(userA1.id, userA1);
    await userModel.saveEntity(userA2.id, userA2);
    await userModel.saveEntity(userB1.id, userB1);

    blogA1 = blog(orgA);
    blogB1 = blog(orgB);
    await blogModel.saveEntity(blogA1.id, blogA1);
    await blogModel.saveEntity(blogB1.id, blogB1);

    postB1a = post(blogB1);
    postB1b = post(blogB1);
    postA1a = post(blogA1);
    await postModel.saveEntity(postA1a.id, postA1a);
    await postModel.saveEntity(postB1a.id, postB1a);
    await postModel.saveEntity(postB1b.id, postB1b);
  });


  it('Retrieving document from repository should work', async() => {
    expect(
      await orgModel.getEntity(orgA.id),
      'Memory Repository should sucessfully set items'
    ).to.equal(orgA);
  });


  it('Resource.getParents() should return Resource instances of parent objects', async() => {
    const resource = new Post(postA1a);
    const [ parent ] = await resource.getParents();
    expect(parent, 'Returned parent should be gracl node instance.').to.be.instanceof(Blog);
    expect(parent.getId(), 'Correct parent should be returned.').to.equal(blogA1.id);
  });


  it('Resource.allow(Subject, <permission>) should set access to true for permission for subject.', async() => {
    const resource = new Post(postA1a),
          subject = new User(userA1);

    const initiallAllowed = await resource.isAllowed(subject, 'view');
    await resource.allow(subject, 'view');
    const afterSetAllowed = await resource.isAllowed(subject, 'view');

    expect(initiallAllowed, 'the subject should not yet be allowed to view the resource.').to.equal(false);
    expect(afterSetAllowed, 'After resource sets permission, they should have access').to.equal(true);
  });


});
