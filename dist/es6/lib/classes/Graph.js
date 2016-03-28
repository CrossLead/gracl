import { Node } from './Node';
import { Subject } from './Subject';
import { Resource } from './Resource';
import { topologicalSort } from '../util';
export class Graph {
    constructor(schema) {
        this.schema = schema;
        this.resources = Graph.buildResourceHierachy(schema.resources);
        this.subjects = Graph.buildSubjectHierachy(schema.subjects);
    }
    static buildResourceHierachy(schemaNodes) {
        const nodeList = topologicalSort(schemaNodes), classGraph = new Map();
        const createClass = (node) => {
            const getParentsMethod = node.getParents || Node.prototype.getParents;
            if (node.parent) {
                const ParentClass = classGraph.get(node.parent);
                classGraph.set(node.name, (_a = class extends ParentClass {
                        getParents() { return getParentsMethod.call(this); }
                    },
                    _a.id = node.id || 'id',
                    _a.parentId = node.parentId,
                    _a.displayName = node.name,
                    _a.repository = node.repository,
                    _a.permissionPropertyKey = node.permissionProperty || 'permissions',
                    _a));
            }
            else {
                classGraph.set(node.name, (_b = class extends Resource {
                    },
                    _b.id = node.id || 'id',
                    _b.displayName = node.name,
                    _b.repository = node.repository,
                    _b.permissionPropertyKey = node.permissionProperty || 'permissions',
                    _b));
            }
            var _a, _b;
        };
        nodeList.forEach(createClass);
        return classGraph;
    }
    static buildSubjectHierachy(schemaNodes) {
        const nodeList = topologicalSort(schemaNodes), classGraph = new Map();
        const createClass = (node) => {
            const getParentsMethod = node.getParents || Node.prototype.getParents;
            if (node.parent) {
                const ParentClass = classGraph.get(node.parent);
                classGraph.set(node.name, (_a = class extends ParentClass {
                        getParents() { return getParentsMethod.call(this); }
                    },
                    _a.id = node.id || 'id',
                    _a.parentId = node.parentId,
                    _a.displayName = node.name,
                    _a.repository = node.repository,
                    _a.permissionPropertyKey = node.permissionProperty || 'permissions',
                    _a));
            }
            else {
                classGraph.set(node.name, (_b = class extends Subject {
                    },
                    _b.id = node.id || 'id',
                    _b.displayName = node.name,
                    _b.repository = node.repository,
                    _b.permissionPropertyKey = node.permissionProperty || 'permissions',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhcGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvY2xhc3Nlcy9HcmFwaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFFBQVE7T0FDdEIsRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXO09BQzVCLEVBQUUsUUFBUSxFQUFFLE1BQU0sWUFBWTtPQUU5QixFQUFFLGVBQWUsRUFBRSxNQUFNLFNBQVM7QUF3QnpDO0lBcUZFLFlBQW1CLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQXpFRCxPQUFPLHFCQUFxQixDQUFDLFdBQXlCO1FBQ3BELE1BQU0sUUFBUSxHQUFHLGVBQWUsQ0FBQyxXQUFXLENBQUMsRUFDdkMsVUFBVSxHQUFHLElBQUksR0FBRyxFQUEyQixDQUFDO1FBRXRELE1BQU0sV0FBVyxHQUFHLENBQUMsSUFBZ0I7WUFDbkMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO1lBRXRFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDaEQsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLG9CQUFjLFdBQVc7d0JBTWpELFVBQVUsS0FBSyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENB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