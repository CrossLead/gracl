'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PostResource = exports.postModel = undefined;

var _index = require('../../lib/index');

var _BlogResource = require('./BlogResource');

const postModel = exports.postModel = new _index.MemoryRepository();
class PostResource extends _BlogResource.BlogResource {}
exports.PostResource = PostResource;
PostResource.repository = postModel;
PostResource.parentId = 'blogId';
PostResource.permissionPropertyKey = 'graclPermissions';