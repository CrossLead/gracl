'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Graph = undefined;

var _Node = require('./Node');

var _Subject = require('./Subject');

var _Resource = require('./Resource');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

class Graph {
    constructor(schema) {
        this.schema = schema;
        this.resources = Graph.buildResourceHierachy(schema.resources);
        this.subjects = Graph.buildSubjectHierachy(schema.subjects);
    }
    static sortSchemaNodes(schemaNodes) {
        const nodeList = [],
              noParentList = [],
              parentMapping = new Map(),
              remainingNodes = new Set(schemaNodes.map(n => n.name));
        for (const schemaNode of schemaNodes) {
            const name = schemaNode.name;
            const parent = schemaNode.parent;

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
        while (noParentList.length) {
            const rootNode = noParentList.pop();
            nodeList.push(rootNode);
            if (parentMapping.has(rootNode.name)) {
                const children = parentMapping.get(rootNode.name);
                while (children.length) {
                    const child = children.pop();
                    remainingNodes.delete(child.name);
                    noParentList.push(child);
                }
            }
        }
        if (remainingNodes.size) {
            throw new Error('Schema has a circular dependency or a missing parent! Examine definitions for ' + [].concat(_toConsumableArray(remainingNodes)).map(x => `"${ x }"`).join(', '));
        }
        return nodeList;
    }
    static buildResourceHierachy(schemaNodes) {
        const nodeList = Graph.sortSchemaNodes(schemaNodes),
              classGraph = new Map();
        const createClass = node => {
            const getParentsMethod = node.getParents || _Node.Node.prototype.getParents;
            if (node.parent) {
                const ParentClass = classGraph.get(node.parent);
                classGraph.set(node.name, (_a = class extends ParentClass {
                    getParents() {
                        return getParentsMethod.call(this);
                    }
                }, _a.id = node.id || 'id', _a.parentId = node.parentId, _a.displayName = node.name, _a.repository = node.repository, _a));
            } else {
                classGraph.set(node.name, (_b = class extends _Resource.Resource {}, _b.id = node.id || 'id', _b.displayName = node.name, _b.repository = node.repository, _b));
            }
            var _a, _b;
        };
        nodeList.forEach(createClass);
        return classGraph;
    }
    static buildSubjectHierachy(schemaNodes) {
        const nodeList = Graph.sortSchemaNodes(schemaNodes),
              classGraph = new Map();
        const createClass = node => {
            const getParentsMethod = node.getParents || _Node.Node.prototype.getParents;
            if (node.parent) {
                const ParentClass = classGraph.get(node.parent);
                classGraph.set(node.name, (_a = class extends ParentClass {
                    getParents() {
                        return getParentsMethod.call(this);
                    }
                }, _a.id = node.id || 'id', _a.parentId = node.parentId, _a.displayName = node.name, _a.repository = node.repository, _a));
            } else {
                classGraph.set(node.name, (_b = class extends _Subject.Subject {}, _b.id = node.id || 'id', _b.displayName = node.name, _b.repository = node.repository, _b));
            }
            var _a, _b;
        };
        nodeList.forEach(createClass);
        return classGraph;
    }
    getClass(name, type) {
        let map;
        switch (type) {
            case 'subject':
                map = this.subjects;
                break;
            case 'resource':
                map = this.resources;
                break;
            default:
                throw new Error(`Invalid class type ${ type }, must be subject or resource!`);
        }
        if (map.has(name)) return map.get(name);
        throw new Error(`No ${ type } class found for ${ name }!`);
    }
    getResource(name) {
        return this.getClass(name, 'resource');
    }
    getSubject(name) {
        return this.getClass(name, 'subject');
    }
}
exports.Graph = Graph;