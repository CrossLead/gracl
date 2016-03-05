import { Subject } from './Subject';
import { Resource } from './Resource';
export class Graph {
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
                classGraph.set(node.name, (_b = class extends Resource {
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
                classGraph.set(node.name, (_b = class extends Subject {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiR3JhcGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvY2xhc3Nlcy9HcmFwaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVc7T0FDNUIsRUFBRSxRQUFRLEVBQUUsTUFBTSxZQUFZO0FBc0JyQztJQTZIRSxZQUFtQixNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUMvQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFuSEQsT0FBTyxlQUFlLENBQUMsV0FBeUI7UUFDOUMsTUFBTSxRQUFRLEdBQWlCLEVBQUUsRUFDM0IsWUFBWSxHQUFpQixFQUFFLEVBQy9CLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBd0IsRUFDL0MsY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRzdELEdBQUcsQ0FBQyxDQUFDLE1BQU0sVUFBVSxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDckMsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUM7WUFFcEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUNaLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzlCLGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxHQUFH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LFVBQVU7Z0JBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQUMsS0FBSyxDQUFDO1lBQzdDLFNBQVMsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsSUFBSSxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQ3ZGLENBQUM7UUFFRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFeEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksb0JBQW9CLElBQUksR0FBRyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQU1ELFdBQVcsQ0FBQyxJQUFZO1FBQ3RCLE1BQU0sQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQU1ELFVBQVUsQ0FBQyxJQUFZO1FBQ3JCLE1BQU0sQ0FBa0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDekQsQ0FBQztBQUdILENBQUM7QUFBQSJ9