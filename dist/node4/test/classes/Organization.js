'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OrganizationSubject = exports.OrganizationResource = exports.orgModel = undefined;

var _index = require('../../lib/index');

const orgModel = exports.orgModel = new _index.MemoryRepository();
class OrganizationResource extends _index.Resource {}
exports.OrganizationResource = OrganizationResource;
OrganizationResource.id = 'id';
OrganizationResource.repository = orgModel;
class OrganizationSubject extends _index.Subject {}
exports.OrganizationSubject = OrganizationSubject;
OrganizationSubject.id = 'id';
OrganizationSubject.repository = orgModel;