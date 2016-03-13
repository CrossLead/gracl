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
            throw new Error('Schema has at least one circular dependency! Examine definitions for ('
                + [...remainingNodes].join(', ') + ')');
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