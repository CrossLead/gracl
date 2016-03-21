"use strict";

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = _promise2.default))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var Node_1 = require('./Node');
var util_1 = require('../util');

var Resource = function (_Node_1$Node) {
    (0, _inherits3.default)(Resource, _Node_1$Node);

    function Resource(doc) {
        (0, _classCallCheck3.default)(this, Resource);

        var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Resource).call(this, doc));

        if (!_this.doc.permissions) {
            _this.doc.permissions = [];
        }
        _this.sortPermissions();
        return _this;
    }

    (0, _createClass3.default)(Resource, [{
        key: 'sortPermissions',
        value: function sortPermissions() {
            this.doc.permissions.sort(util_1.permissionCompare);
            return this;
        }
    }, {
        key: 'setDoc',
        value: function setDoc(doc) {
            this.doc = doc;
            if (!this.doc.permissions) {
                this.doc.permissions = [];
            }
            this.sortPermissions();
            return this;
        }
    }, {
        key: 'getPermission',
        value: function getPermission(subject) {
            var subjectId = subject.getId();var permissions = this.doc.permissions;

            return permissions[util_1.permissionIndexOf(permissions, subjectId)] || { subjectId: subjectId, access: {} };
        }
    }, {
        key: 'determineAccess',
        value: function determineAccess(subject, permissionType, options) {
            return __awaiter(this, void 0, _promise2.default, _regenerator2.default.mark(function _callee() {
                var _ref, _ref$assertionFn, assertionFn, result, resources, currentResources, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, res, access, parentResources, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, thisParents, currentSubjects, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, sub, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, parentSubjects, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4;

                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _ref = options || {};
                                _ref$assertionFn = _ref.assertionFn;
                                assertionFn = _ref$assertionFn === undefined ? util_1.yes : _ref$assertionFn;
                                result = {
                                    type: permissionType,
                                    access: false,
                                    reason: 'No permissions were set specifically for this subject/resource combination.'
                                };
                                _context.next = 6;
                                return assertionFn();

                            case 6:
                                if (_context.sent) {
                                    _context.next = 10;
                                    break;
                                }

                                result.access = false;
                                result.reason = 'Failed assertion function check.';
                                return _context.abrupt('return', result);

                            case 10:
                                resources = [];
                                currentResources = [this];

                            case 12:
                                if (!currentResources.length) {
                                    _context.next = 76;
                                    break;
                                }

                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context.prev = 16;
                                _iterator = (0, _getIterator3.default)(currentResources);

                            case 18:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context.next = 28;
                                    break;
                                }

                                res = _step.value;
                                access = res.getPermission(subject).access[permissionType];

                                if (!(access === true || access === false)) {
                                    _context.next = 25;
                                    break;
                                }

                                result.access = access;
                                result.reason = 'Permission set on ' + res.toString() + ' for ' + subject.toString() + ' = ' + access;
                                return _context.abrupt('return', result);

                            case 25:
                                _iteratorNormalCompletion = true;
                                _context.next = 18;
                                break;

                            case 28:
                                _context.next = 34;
                                break;

                            case 30:
                                _context.prev = 30;
                                _context.t0 = _context['catch'](16);
                                _didIteratorError = true;
                                _iteratorError = _context.t0;

                            case 34:
                                _context.prev = 34;
                                _context.prev = 35;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 37:
                                _context.prev = 37;

                                if (!_didIteratorError) {
                                    _context.next = 40;
                                    break;
                                }

                                throw _iteratorError;

                            case 40:
                                return _context.finish(37);

                            case 41:
                                return _context.finish(34);

                            case 42:
                                resources.push.apply(resources, (0, _toConsumableArray3.default)(currentResources));
                                parentResources = [];
                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context.prev = 47;
                                _iterator2 = (0, _getIterator3.default)(currentResources);

                            case 49:
                                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                                    _context.next = 59;
                                    break;
                                }

                                res = _step2.value;

                                if (res.hierarchyRoot()) {
                                    _context.next = 56;
                                    break;
                                }

                                _context.next = 54;
                                return res.getParents();

                            case 54:
                                thisParents = _context.sent;

                                parentResources.push.apply(parentResources, (0, _toConsumableArray3.default)(thisParents));

                            case 56:
                                _iteratorNormalCompletion2 = true;
                                _context.next = 49;
                                break;

                            case 59:
                                _context.next = 65;
                                break;

                            case 61:
                                _context.prev = 61;
                                _context.t1 = _context['catch'](47);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context.t1;

                            case 65:
                                _context.prev = 65;
                                _context.prev = 66;

                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }

                            case 68:
                                _context.prev = 68;

                                if (!_didIteratorError2) {
                                    _context.next = 71;
                                    break;
                                }

                                throw _iteratorError2;

                            case 71:
                                return _context.finish(68);

                            case 72:
                                return _context.finish(65);

                            case 73:
                                currentResources = parentResources;
                                _context.next = 12;
                                break;

                            case 76:
                                resources.sort(function (a, b) {
                                    var aDepth = a.getNodeDepth(),
                                        bDepth = b.getNodeDepth();
                                    return 0 - util_1.baseCompare(aDepth, bDepth);
                                });
                                currentSubjects = [subject];

                            case 78:
                                if (!currentSubjects.length) {
                                    _context.next = 165;
                                    break;
                                }

                                _iteratorNormalCompletion3 = true;
                                _didIteratorError3 = false;
                                _iteratorError3 = undefined;
                                _context.prev = 82;
                                _iterator3 = (0, _getIterator3.default)(currentSubjects);

                            case 84:
                                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                                    _context.next = 118;
                                    break;
                                }

                                sub = _step3.value;
                                _iteratorNormalCompletion5 = true;
                                _didIteratorError5 = false;
                                _iteratorError5 = undefined;
                                _context.prev = 89;
                                _iterator5 = (0, _getIterator3.default)(resources);

                            case 91:
                                if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
                                    _context.next = 101;
                                    break;
                                }

                                res = _step5.value;
                                access = res.getPermission(sub).access[permissionType];

                                if (!(access === true || access === false)) {
                                    _context.next = 98;
                                    break;
                                }

                                result.access = access;
                                result.reason = 'Permission set on ' + res.toString() + ' for ' + sub.toString() + ' = ' + access;
                                return _context.abrupt('return', result);

                            case 98:
                                _iteratorNormalCompletion5 = true;
                                _context.next = 91;
                                break;

                            case 101:
                                _context.next = 107;
                                break;

                            case 103:
                                _context.prev = 103;
                                _context.t2 = _context['catch'](89);
                                _didIteratorError5 = true;
                                _iteratorError5 = _context.t2;

                            case 107:
                                _context.prev = 107;
                                _context.prev = 108;

                                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                    _iterator5.return();
                                }

                            case 110:
                                _context.prev = 110;

                                if (!_didIteratorError5) {
                                    _context.next = 113;
                                    break;
                                }

                                throw _iteratorError5;

                            case 113:
                                return _context.finish(110);

                            case 114:
                                return _context.finish(107);

                            case 115:
                                _iteratorNormalCompletion3 = true;
                                _context.next = 84;
                                break;

                            case 118:
                                _context.next = 124;
                                break;

                            case 120:
                                _context.prev = 120;
                                _context.t3 = _context['catch'](82);
                                _didIteratorError3 = true;
                                _iteratorError3 = _context.t3;

                            case 124:
                                _context.prev = 124;
                                _context.prev = 125;

                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }

                            case 127:
                                _context.prev = 127;

                                if (!_didIteratorError3) {
                                    _context.next = 130;
                                    break;
                                }

                                throw _iteratorError3;

                            case 130:
                                return _context.finish(127);

                            case 131:
                                return _context.finish(124);

                            case 132:
                                parentSubjects = [];
                                _iteratorNormalCompletion4 = true;
                                _didIteratorError4 = false;
                                _iteratorError4 = undefined;
                                _context.prev = 136;
                                _iterator4 = (0, _getIterator3.default)(currentSubjects);

                            case 138:
                                if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                                    _context.next = 148;
                                    break;
                                }

                                sub = _step4.value;

                                if (sub.hierarchyRoot()) {
                                    _context.next = 145;
                                    break;
                                }

                                _context.next = 143;
                                return sub.getParents();

                            case 143:
                                thisParents = _context.sent;

                                parentSubjects.push.apply(parentSubjects, (0, _toConsumableArray3.default)(thisParents));

                            case 145:
                                _iteratorNormalCompletion4 = true;
                                _context.next = 138;
                                break;

                            case 148:
                                _context.next = 154;
                                break;

                            case 150:
                                _context.prev = 150;
                                _context.t4 = _context['catch'](136);
                                _didIteratorError4 = true;
                                _iteratorError4 = _context.t4;

                            case 154:
                                _context.prev = 154;
                                _context.prev = 155;

                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }

                            case 157:
                                _context.prev = 157;

                                if (!_didIteratorError4) {
                                    _context.next = 160;
                                    break;
                                }

                                throw _iteratorError4;

                            case 160:
                                return _context.finish(157);

                            case 161:
                                return _context.finish(154);

                            case 162:
                                currentSubjects = parentSubjects;
                                _context.next = 78;
                                break;

                            case 165:
                                return _context.abrupt('return', result);

                            case 166:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[16, 30, 34, 42], [35,, 37, 41], [47, 61, 65, 73], [66,, 68, 72], [82, 120, 124, 132], [89, 103, 107, 115], [108,, 110, 114], [125,, 127, 131], [136, 150, 154, 162], [155,, 157, 161]]);
            }));
        }
    }, {
        key: 'isAllowed',
        value: function isAllowed(subject, permissionType, options) {
            return __awaiter(this, void 0, _promise2.default, _regenerator2.default.mark(function _callee2() {
                var result;
                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.determineAccess(subject, permissionType, options);

                            case 2:
                                result = _context2.sent;
                                return _context2.abrupt('return', result.access);

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        }
    }, {
        key: 'explainPermission',
        value: function explainPermission(subject, permissionType, options) {
            return __awaiter(this, void 0, _promise2.default, _regenerator2.default.mark(function _callee3() {
                var result;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.determineAccess(subject, permissionType, options);

                            case 2:
                                result = _context3.sent;
                                return _context3.abrupt('return', result.reason);

                            case 4:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));
        }
    }, {
        key: 'updatePermission',
        value: function updatePermission(subject, action) {
            return __awaiter(this, void 0, _promise2.default, _regenerator2.default.mark(function _callee4() {
                var doc, permissions, subjectId, subjectType, resourceId, resourceType, existingPermissionIndex, CurrentResourceClass, id, updated;
                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                doc = this.doc;
                                permissions = doc.permissions;
                                subjectId = subject.getId();
                                subjectType = subject.getName();
                                resourceId = this.getId();
                                resourceType = this.getName();
                                existingPermissionIndex = util_1.permissionIndexOf(permissions, subjectId), CurrentResourceClass = this.getClass();

                                if (existingPermissionIndex >= 0) {
                                    permissions[existingPermissionIndex] = action(permissions[existingPermissionIndex]);
                                } else {
                                    permissions.push(action({ subjectId: subjectId, resourceId: resourceId, resourceType: resourceType, subjectType: subjectType }));
                                }
                                id = this.getId();
                                _context4.next = 11;
                                return CurrentResourceClass.repository.saveEntity(id, doc, this);

                            case 11:
                                updated = _context4.sent;
                                return _context4.abrupt('return', this.setDoc(updated));

                            case 13:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));
        }
    }, {
        key: 'setPermissionAccess',
        value: function setPermissionAccess(subject, permissionType, access) {
            return this.updatePermission(subject, function (permission) {
                (permission.access = permission.access || {})[permissionType] = access;
                return permission;
            });
        }
    }, {
        key: 'allow',
        value: function allow(subject, permissionType) {
            return this.setPermissionAccess(subject, permissionType, true);
        }
    }, {
        key: 'deny',
        value: function deny(subject, permissionType) {
            return this.setPermissionAccess(subject, permissionType, false);
        }
    }, {
        key: 'getPermissionsHierarchy',
        value: function getPermissionsHierarchy() {
            return __awaiter(this, void 0, _promise2.default, _regenerator2.default.mark(function _callee5() {
                var _doc$permissions, permissions, graph, parents, _graph$parents, parentHierarchies;

                return _regenerator2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _doc$permissions = this.doc.permissions;
                                permissions = _doc$permissions === undefined ? [] : _doc$permissions;
                                graph = {
                                    node: this.toString(),
                                    nodeId: this.getId(),
                                    permissions: permissions,
                                    parents: []
                                };

                                if (this.hierarchyRoot()) {
                                    _context5.next = 12;
                                    break;
                                }

                                _context5.next = 6;
                                return this.getParents();

                            case 6:
                                parents = _context5.sent;

                                if (!parents.length) {
                                    _context5.next = 12;
                                    break;
                                }

                                _context5.next = 10;
                                return _promise2.default.all(parents.map(function (p) {
                                    return p.getPermissionsHierarchy();
                                }));

                            case 10:
                                parentHierarchies = _context5.sent;

                                (_graph$parents = graph.parents).push.apply(_graph$parents, (0, _toConsumableArray3.default)(parentHierarchies));

                            case 12:
                                return _context5.abrupt('return', graph);

                            case 13:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));
        }
    }]);
    return Resource;
}(Node_1.Node);

exports.Resource = Resource;