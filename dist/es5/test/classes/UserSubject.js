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
var TeamSubject_1 = require('./TeamSubject');
exports.userModel = new index_1.MemoryRepository();

var UserSubject = function (_TeamSubject_1$TeamSu) {
  (0, _inherits3.default)(UserSubject, _TeamSubject_1$TeamSu);

  function UserSubject() {
    (0, _classCallCheck3.default)(this, UserSubject);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(UserSubject).apply(this, arguments));
  }

  return UserSubject;
}(TeamSubject_1.TeamSubject);

UserSubject.repository = exports.userModel;
UserSubject.parentId = 'teamIds';
exports.UserSubject = UserSubject;