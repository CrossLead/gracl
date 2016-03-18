"use strict";
const Node_1 = require('./Node');
const Subject_1 = require('./Subject');
const Resource_1 = require('./Resource');
class Graph {
    constructor(schema) {
        this.schema = schema;
        this.resources = Graph.buildResourceHierachy(schema.resources);
        this.subjects = Graph.buildSubjectHierachy(schema.subjects);
    }
    static sortSchemaNodes(schemaNodes) {
        const nodeList = [], noParentList = [], parentMapping = new Map(), remainingNodes = new Set(schemaNodes.map(n => n.name));
        for (const schemaNode of schemaNodes) {
            const { name, parent } = schemaNode;
            if (!parent) {
                noParentList.push(schemaNode);
                remainingNodes.delete(schemaNode.name);
            }
            else {
                if (!parentMapping.has(parent)) {
                    parentMapping.set(parent, [schemaNode]);
                }
                else {
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
            throw new Error('Schema has a circular dependency or a missing parent! Examine definitions for '
                + [...remainingNodes].map(x => `"${x}"`).join(', '));
        }
        return nodeList;
    }
    static buildResourceHierachy(schemaNodes) {
        const nodeList = Graph.sortSchemaNodes(schemaNodes), classGraph = new Map();
        const createClass = (node) => {
            const getParentsMethod = node.getParents || Node_1.Node.prototype.getParents;
            if (node.parent) {
                const ParentClass = classGraph.get(node.parent);
                classGraph.set(node.name, (_a = class extends ParentClass {
                        getParents() { return getParentsMethod.call(this); }
                    },
                    _a.id = node.id || 'id',
                    _a.parentId = node.parentId,
                    _a.displayName = node.name,
                    _a.repository = node.repository,
                    _a));
            }
            else {
                classGraph.set(node.name, (_b = class extends Resource_1.Resource {
                    },
                    _b.id = node.id || 'id',
                    _b.displayName = node.name,
                    _b.repository = node.repository,
                    _b));
            }
            var _a, _b;
        };
        nodeList.forEach(createClass);
        return classGraph;
    }
    static buildSubjectHierachy(schemaNodes) {
        const nodeList = Graph.sortSchemaNodes(schemaNodes), classGraph = new Map();
        const createClass = (node) => {
            const getParentsMethod = node.getParents || Node_1.Node.prototype.getParents;
            if (node.parent) {
                const ParentClass = classGraph.get(node.parent);
                classGraph.set(node.name, (_a = class extends ParentClass {
                        getParents() { return getParentsMethod.call(this); }
                    },
                    _a.id = node.id || 'id',
                    _a.parentId = node.parentId,
                    _a.displayName = node.name,
                    _a.repository = node.repository,
                    _a));
            }
            else {
                classGraph.set(node.name, (_b = class extends Subject_1.Subject {
                    },
                    _b.id = node.id || 'id',
                    _b.displayName = node.name,
                    _b.repository = node.repository,
                    _b));
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
            default: throw new Error(`Invalid class type ${type}, must be subject or resource!`);
        }
        if (map.has(name))
            return map.get(name);
        throw new Error(`No ${type} class found for ${name}!`);
    }
    getResource(name) {
        return this.getClass(name, 'resource');
    }
    getSubject(name) {
        return this.getClass(name, 'subject');
    }
}
exports.Graph = Graph;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhcGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvY2xhc3Nlcy9HcmFwaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsdUJBQXFCLFFBQVEsQ0FBQyxDQUFBO0FBQzlCLDBCQUF3QixXQUFXLENBQUMsQ0FBQTtBQUNwQywyQkFBeUIsWUFBWSxDQUFDLENBQUE7QUF1QnRDO0lBbUlFLFlBQW1CLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQXpIRCxPQUFPLGVBQWUsQ0FBQyxXQUF5QjtRQUM5QyxNQUFNLFFBQVEsR0FBaUIsRUFBRSxFQUMzQixZQUFZLEdBQWlCLEVBQUUsRUFDL0IsYUFBYSxHQUFHLElBQUksR0FBRyxFQUF3QixFQUMvQyxjQUFjLEdBQUcsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFHN0QsR0FBRyxDQUFDLENBQUMsTUFBTSxVQUFVLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNyQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQztZQUVwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ1osWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDOUIsY0FBYyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDekMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLEVBQUUsQ0FBQyxD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