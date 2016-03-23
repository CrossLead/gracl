'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BlogResource = exports.blogModel = undefined;

var _index = require('../../lib/index');

var _Organization = require('./Organization');

const blogModel = exports.blogModel = new _index.MemoryRepository();
class BlogResource extends _Organization.OrganizationResource {}
exports.BlogResource = BlogResource;
BlogResource.repository = blogModel;
BlogResource.parentId = 'organizationId';