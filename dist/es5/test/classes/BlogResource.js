"use strict";

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var index_1 = require('../../lib/index');
var Organization_1 = require('./Organization');
exports.blogModel = new index_1.MemoryRepository();

var BlogResource = function (_Organization_1$Organ) {
  (0, _inherits3.default)(BlogResource, _Organization_1$Organ);

  function BlogResource() {
    (0, _classCallCheck3.default)(this, BlogResource);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(BlogResource).apply(this, arguments));
  }

  return BlogResource;
}(Organization_1.OrganizationResource);

BlogResource.repository = exports.blogModel;
BlogResource.parentId = 'organizationId';
exports.BlogResource = BlogResource;