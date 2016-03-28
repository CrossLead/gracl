'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TeamSubject = exports.teamModel = undefined;

var _index = require('../../lib/index');

var _Organization = require('./Organization');

const teamModel = exports.teamModel = new _index.MemoryRepository();
class TeamSubject extends _Organization.OrganizationSubject {}
exports.TeamSubject = TeamSubject;
TeamSubject.repository = teamModel;
TeamSubject.parentId = 'organizationId';
TeamSubject.permissionPropertyKey = 'graclPermissions';