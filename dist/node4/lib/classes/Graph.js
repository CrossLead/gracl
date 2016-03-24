'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Graph = undefined;

var _Node = require('./Node');

var _Subject = require('./Subject');

var _Resource = require('./Resource');

var _util = require('../util');

class Graph {
    constructor(schema) {
        this.schema = schema;
        this.resources = Graph.buildResourceHierachy(schema.resources);
        this.subjects = Graph.buildSubjectHierachy(schema.subjects);
    }
    static buildResourceHierachy(schemaNodes) {
        const nodeList = (0, _util.topologicalSort)(schemaNodes),
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
        const nodeList = (0, _util.topologicalSort)(schemaNodes),
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