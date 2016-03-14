"use strict";

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

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
var util_1 = require('../util');

var Node = function () {
    function Node(doc) {
        (0, _classCallCheck3.default)(this, Node);

        this.doc = doc;

        var _getClass = this.getClass();

        var name = _getClass.name;
        var repository = _getClass.repository;
        var id = _getClass.id;

        if (!doc) throw new Error('No document provided to ' + name + ' constructor!');
        if (doc[id] === undefined) throw new Error('No ' + id + ' property on document ' + doc + '!');
        if (!repository) throw new Error('No repository static property defined on ' + name + '!');
    }

    (0, _createClass3.default)(Node, [{
        key: 'getName',
        value: function getName() {
            var thisClass = this.getClass(),
                className = thisClass.displayName || thisClass.name;
            return className;
        }
    }, {
        key: 'toString',
        value: function toString() {
            var nodeSubclassName = this.getNodeSubclass().name,
                id = this.getId();
            return '<' + nodeSubclassName + ':' + this.getName() + ' id=' + id + '>';
        }
    }, {
        key: 'isNodeType',
        value: function isNodeType(nc) {
            return this.getClass() === nc;
        }
    }, {
        key: 'getParentClass',
        value: function getParentClass() {
            return util_1.getClassOf(this.constructor.prototype);
        }
    }, {
        key: 'getClass',
        value: function getClass() {
            return util_1.getClassOf(this);
        }
    }, {
        key: 'hierarchyRoot',
        value: function hierarchyRoot() {
            return util_1.getClassOf(this.getParentClass().prototype) === Node;
        }
    }, {
        key: 'getId',
        value: function getId() {
            return this.doc[this.getClass().id];
        }
    }, {
        key: 'getRepository',
        value: function getRepository() {
            return this.getClass().repository;
        }
    }, {
        key: 'isAllowed',
        value: function isAllowed(node, permissionType, options) {
            return __awaiter(this, void 0, _promise2.default, _regenerator2.default.mark(function _callee() {
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                console.warn('Calling Node.isAllowed(), must implement on subclass!');
                                return _context.abrupt('return', false);

                            case 2:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        }
    }, {
        key: 'getParents',
        value: function getParents() {
            return __awaiter(this, void 0, _promise2.default, _regenerator2.default.mark(function _callee2() {
                var _this = this;

                var _getClass2, parentId, parentIds, promises;

                return _regenerator2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _getClass2 = this.getClass();
                                parentId = _getClass2.parentId;

                                if (!parentId) {
                                    _context2.next = 17;
                                    break;
                                }

                                parentIds = this.doc[parentId] || [];

                                if (!Array.isArray(parentIds)) {
                                    _context2.next = 11;
                                    break;
                                }

                                promises = parentIds.map(function (id) {
                                    return _this.getParentNode(id);
                                });
                                _context2.next = 8;
                                return _promise2.default.all(promises);

                            case 8:
                                return _context2.abrupt('return', _context2.sent);

                            case 11:
                                _context2.next = 13;
                                return this.getParentNode(parentIds);

                            case 13:
                                _context2.t0 = _context2.sent;
                                return _context2.abrupt('return', [_context2.t0]);

                            case 15:
                                _context2.next = 19;
                                break;

                            case 17:
                                console.warn('Calling Node.getParents() without Node.parentId, must implement on subclass!');
                                return _context2.abrupt('return', []);

                            case 19:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        }
    }, {
        key: 'getParentNode',
        value: function getParentNode(data) {
            return __awaiter(this, void 0, _promise2.default, _regenerator2.default.mark(function _callee3() {
                var ParentClass, doc;
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                ParentClass = this.getParentClass();
                                doc = undefined;

                                if (!(typeof data === 'string')) {
                                    _context3.next = 10;
                                    break;
                                }

                                if (ParentClass.repository) {
                                    _context3.next = 5;
                                    break;
                                }

                                throw new Error('No static repository property present on ' + ParentClass.name + ' Node!');

                            case 5:
                                _context3.next = 7;
                                return ParentClass.repository.getEntity(data);

                            case 7:
                                doc = _context3.sent;
                                _context3.next = 11;
                                break;

                            case 10:
                                doc = data;

                            case 11:
                                return _context3.abrupt('return', new ParentClass(doc));

                            case 12:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));
        }
    }, {
        key: 'assertNodeClass',
        value: function assertNodeClass(nodeClass) {
            if (!(nodeClass.prototype instanceof Node)) {
                throw new Error('Link in hierarchy chain (' + nodeClass.name + ') is not an instance of Node!');
            }
        }
    }, {
        key: 'getNodeSubclass',
        value: function getNodeSubclass() {
            var nodeClass = this.getClass();
            this.assertNodeClass(nodeClass);
            while (util_1.getClassOf(nodeClass.prototype) !== Node) {
                nodeClass = util_1.getClassOf(nodeClass.prototype);
                this.assertNodeClass(nodeClass);
            }
            return nodeClass;
        }
    }, {
        key: 'getNodeDepth',
        value: function getNodeDepth() {
            var depth = 0;
            var nodeClass = this.getClass();
            while (util_1.getClassOf(nodeClass.prototype) !== Node) {
                depth++;
                nodeClass = util_1.getClassOf(nodeClass.prototype);
            }
            return depth;
        }
    }, {
        key: 'getHierarchyIds',
        value: function getHierarchyIds() {
            return __awaiter(this, void 0, _promise2.default, _regenerator2.default.mark(function _callee4() {
                var ids, parents, _parentIds;

                return _regenerator2.default.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                ids = [this.getId()];

                                if (this.hierarchyRoot()) {
                                    _context4.next = 10;
                                    break;
                                }

                                _context4.next = 4;
                                return this.getParents();

                            case 4:
                                parents = _context4.sent;

                                if (!parents.length) {
                                    _context4.next = 10;
                                    break;
                                }

                                _context4.next = 8;
                                return _promise2.default.all(parents.map(function (p) {
                                    return p.getHierarchyIds();
                                }));

                            case 8:
                                _parentIds = _context4.sent;

                                ids = _parentIds.reduce(function (out, idList) {
                                    return out.concat(idList);
                                }, ids);

                            case 10:
                                return _context4.abrupt('return', ids);

                            case 11:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));
        }
    }, {
        key: 'getHierarchyClassNames',
        value: function getHierarchyClassNames() {
            return this.getClass().getHierarchyClassNames();
        }
    }], [{
        key: 'getHierarchyClassNames',
        value: function getHierarchyClassNames() {
            var names = [];
            var nodeClass = this;
            do {
                names.push(nodeClass.displayName || nodeClass.name);
                nodeClass = util_1.getClassOf(nodeClass.prototype);
            } while (util_1.getClassOf(nodeClass.prototype) !== Node);
            return names;
        }
    }]);
    return Node;
}();

Node.displayName = '';
Node.id = 'id';
exports.Node = Node;