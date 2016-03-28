'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserSubject = exports.userModel = undefined;

var _index = require('../../lib/index');

var _TeamSubject = require('./TeamSubject');

const userModel = exports.userModel = new _index.MemoryRepository();
class UserSubject extends _TeamSubject.TeamSubject {}
exports.UserSubject = UserSubject;
UserSubject.repository = userModel;
UserSubject.parentId = 'teamIds';
UserSubject.permissionPropertyKey = 'graclPermissions';