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
exports.orgModel = new index_1.MemoryRepository();

var OrganizationResource = function (_index_1$Resource) {
  (0, _inherits3.default)(OrganizationResource, _index_1$Resource);

  function OrganizationResource() {
    (0, _classCallCheck3.default)(this, OrganizationResource);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(OrganizationResource).apply(this, arguments));
  }

  return OrganizationResource;
}(index_1.Resource);

OrganizationResource.id = 'id';
OrganizationResource.repository = exports.orgModel;
exports.OrganizationResource = OrganizationResource;

var OrganizationSubject = function (_index_1$Subject) {
  (0, _inherits3.default)(OrganizationSubject, _index_1$Subject);

  function OrganizationSubject() {
    (0, _classCallCheck3.default)(this, OrganizationSubject);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(OrganizationSubject).apply(this, arguments));
  }

  return OrganizationSubject;
}(index_1.Subject);

OrganizationSubject.id = 'id';
OrganizationSubject.repository = exports.orgModel;
exports.OrganizationSubject = OrganizationSubject;