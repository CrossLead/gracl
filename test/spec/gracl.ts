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
  Team, User, Blog, Post } from '../classes/index';

import { user, team, org, post, blog } from '../helpers/index';

describe("gracl", () => {
  let orgA,
      orgB,
      teamA1,
      teamA2,
      teamA3,
      teamB1;

  before(() => {
    // setup, add documents to models
    orgA = org();
    orgB = org();
    teamA1 = team(orgB.id);
    teamA2 = team(orgB.id);
    teamA3 = team(orgB.id);
    teamB1 = team(orgB.id);
  });

});
