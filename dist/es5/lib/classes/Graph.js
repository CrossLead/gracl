"use strict";

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Subject_1 = require('./Subject');
var Resource_1 = require('./Resource');

var Graph = function () {
    function Graph(schema) {
        (0, _classCallCheck3.default)(this, Graph);

        this.schema = schema;
        this.resources = Graph.buildResourceHierachy(schema.resources);
        this.subjects = Graph.buildSubjectHierachy(schema.subjects);
    }

    (0, _createClass3.default)(Graph, [{
        key: 'getClass',
        value: function getClass(name, type) {
            var map = undefined;
            switch (type) {
                case 'subject':
                    map = this.subjects;
                    break;
                case 'resource':
                    map = this.resources;
                    break;
                default:
                    throw new Error('Invalid class type ' + type + ', must be subject or resource!');
            }
            if (map.has(name)) return map.get(name);
            throw new Error('No ' + type + ' class found for ' + name + '!');
        }
    }, {
        key: 'getResource',
        value: function getResource(name) {
            return this.getClass(name, 'resource');
        }
    }, {
        key: 'getSubject',
        value: function getSubject(name) {
            return this.getClass(name, 'subject');
        }
    }], [{
        key: 'sortSchemaNodes',
        value: function sortSchemaNodes(schemaNodes) {
            var nodeList = [],
                noParentList = [],
                parentMapping = new _map2.default(),
                remainingNodes = new _set2.default(schemaNodes.map(function (n) {
                return n.name;
            }));
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = (0, _getIterator3.default)(schemaNodes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var schemaNode = _step.value;
                    var name = schemaNode.name;
                    var parent = schemaNode.parent;

                    if (!parent) {
                        noParentList.push(schemaNode);
                        remainingNodes.delete(schemaNode.name);
                    } else {
                        if (!parentMapping.has(parent)) {
                            parentMapping.set(parent, [schemaNode]);
                        } else {
                            parentMapping.get(parent).push(schemaNode);
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            while (noParentList.length) {
                var rootNode = noParentList.pop();
                nodeList.push(rootNode);
                if (parentMapping.has(rootNode.name)) {
                    var children = parentMapping.get(rootNode.name);
                    while (children.length) {
                        var child = children.pop();
                        remainingNodes.delete(child.name);
                        noParentList.push(child);
                    }
                }
            }
            if (remainingNodes.size) {
                throw new Error('Schema has a circular dependency or a missing parent! Examine definitions for ' + [].concat((0, _toConsumableArray3.default)(remainingNodes)).map(function (x) {
                    return '"' + x + '"';
                }).join(', '));
            }
            return nodeList;
        }
    }, {
        key: 'buildResourceHierachy',
        value: function buildResourceHierachy(schemaNodes) {
            var nodeList = Graph.sortSchemaNodes(schemaNodes),
                classGraph = new _map2.default();
            var createClass = function createClass(node) {
                if (node.parent) {
                    var ParentClass = classGraph.get(node.parent);
                    classGraph.set(node.name, (_a = function (_ParentClass) {
                        (0, _inherits3.default)(_a, _ParentClass);

                        function _a() {
                            (0, _classCallCheck3.default)(this, _a);
                            return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_a).apply(this, arguments));
                        }

                        return _a;
                    }(ParentClass), _a.id = node.id || 'id', _a.parentId = node.parentId, _a.displayName = node.name, _a.repository = node.repository, _a));
                } else {
                    classGraph.set(node.name, (_b = function (_Resource_1$Resource) {
                        (0, _inherits3.default)(_b, _Resource_1$Resource);

                        function _b() {
                            (0, _classCallCheck3.default)(this, _b);
                            return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_b).apply(this, arguments));
                        }

                        return _b;
                    }(Resource_1.Resource), _b.id = node.id || 'id', _b.displayName = node.name, _b.repository = node.repository, _b));
                }
                var _a, _b;
            };
            nodeList.forEach(createClass);
            return classGraph;
        }
    }, {
        key: 'buildSubjectHierachy',
        value: function buildSubjectHierachy(schemaNodes) {
            var nodeList = Graph.sortSchemaNodes(schemaNodes),
                classGraph = new _map2.default();
            var createClass = function createClass(node) {
                if (node.parent) {
                    var ParentClass = classGraph.get(node.parent);
                    classGraph.set(node.name, (_a = function (_ParentClass2) {
                        (0, _inherits3.default)(_a, _ParentClass2);

                        function _a() {
                            (0, _classCallCheck3.default)(this, _a);
                            return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_a).apply(this, arguments));
                        }

                        return _a;
                    }(ParentClass), _a.id = node.id || 'id', _a.parentId = node.parentId, _a.displayName = node.name, _a.repository = node.repository, _a));
                } else {
                    classGraph.set(node.name, (_b = function (_Subject_1$Subject) {
                        (0, _inherits3.default)(_b, _Subject_1$Subject);

                        function _b() {
                            (0, _classCallCheck3.default)(this, _b);
                            return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(_b).apply(this, arguments));
                        }

                        return _b;
                    }(Subject_1.Subject), _b.id = node.id || 'id', _b.displayName = node.name, _b.repository = node.repository, _b));
                }
                var _a, _b;
            };
            nodeList.forEach(createClass);
            return classGraph;
        }
    }]);
    return Graph;
}();

exports.Graph = Graph;