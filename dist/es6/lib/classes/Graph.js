"use strict";
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
            if (node.parent) {
                const ParentClass = classGraph.get(node.parent);
                classGraph.set(node.name, (_a = class extends ParentClass {
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
            if (node.parent) {
                const ParentClass = classGraph.get(node.parent);
                classGraph.set(node.name, (_a = class extends ParentClass {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhcGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvY2xhc3Nlcy9HcmFwaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMEJBQXdCLFdBQVcsQ0FBQyxDQUFBO0FBQ3BDLDJCQUF5QixZQUFZLENBQUMsQ0FBQTtBQXNCdEM7SUE2SEUsWUFBbUIsTUFBYztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBbkhELE9BQU8sZUFBZSxDQUFDLFdBQXlCO1FBQzlDLE1BQU0sUUFBUSxHQUFpQixFQUFFLEVBQzNCLFlBQVksR0FBaUIsRUFBRSxFQUMvQixhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQXdCLEVBQy9DLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUc3RCxHQUFHLENBQUMsQ0FBQyxNQUFNLFVBQVUsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDO1lBRXBDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDWixZQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUM5QixjQUFjLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sRUFBRSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFD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