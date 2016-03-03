var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
export class Node {
    constructor(doc) {
        this.doc = doc;
        const { name, repository, id } = this.getClass();
        if (!doc)
            throw new Error(`No document provided to ${name} constructor!`);
        if (doc[id] === undefined)
            throw new Error(`No ${id} property on document ${doc}!`);
        if (!repository)
            throw new Error(`No repository static property defined on ${name}!`);
    }
    _getClassOf(node) {
        return Object.getPrototypeOf(node).constructor;
    }
    getName() {
        const thisClass = this.getClass(), className = thisClass.displayName || thisClass.name;
        return className;
    }
    toString() {
        const nodeSubclassName = this.getNodeSubclass().name, id = this.getId();
        return `<${nodeSubclassName}:${this.getName()} id=${id}>`;
    }
    isNodeType(nc) {
        return this.getClass() === nc;
    }
    getParentClass() {
        return this._getClassOf(this.constructor.prototype);
    }
    getClass() {
        return this._getClassOf(this);
    }
    hierarchyRoot() {
        return this._getClassOf(this.getParentClass().prototype) === Node;
    }
    getId() {
        return this.doc[this.getClass().id];
    }
    getRepository() {
        return this.getClass().repository;
    }
    isAllowed(node, permissionType, options) {
        return __awaiter(this, void 0, Promise, function* () {
            console.warn(`Calling Node.isAllowed(), must implement on subclass!`);
            return false;
        });
    }
    getParents() {
        return __awaiter(this, void 0, Promise, function* () {
            const { parentId } = this.getClass();
            if (parentId) {
                const parentIds = this.doc[parentId] || [];
                if (Array.isArray(parentIds)) {
                    const promises = parentIds.map((id) => {
                        return this.getParentNode(id);
                    });
                    return yield Promise.all(promises);
                }
                else {
                    return [yield this.getParentNode(parentIds)];
                }
            }
            else {
                console.warn(`Calling Node.getParents() without Node.parentId, must implement on subclass!`);
                return [];
            }
        });
    }
    ;
    getParentNode(data) {
        return __awaiter(this, void 0, Promise, function* () {
            const ParentClass = this.getParentClass();
            let doc;
            if (typeof data === 'string') {
                if (!ParentClass.repository) {
                    throw new Error(`No static repository property present on ${ParentClass.name} Node!`);
                }
                doc = yield ParentClass.repository.getEntity(data);
            }
            else {
                doc = data;
            }
            return new ParentClass(doc);
        });
    }
    assertNodeClass(nodeClass) {
        if (!(nodeClass.prototype instanceof Node)) {
            throw new Error(`Link in hierarchy chain (${nodeClass.name}) is not an instance of Node!`);
        }
    }
    getNodeSubclass() {
        let nodeClass = this.getClass();
        this.assertNodeClass(nodeClass);
        while (this._getClassOf(nodeClass.prototype) !== Node) {
            nodeClass = this._getClassOf(nodeClass.prototype);
            this.assertNodeClass(nodeClass);
        }
        return nodeClass;
    }
    getNodeDepth() {
        let depth = 0;
        let nodeClass = this.getClass();
        while (this._getClassOf(nodeClass.prototype) !== Node) {
            depth++;
            nodeClass = this._getClassOf(nodeClass.prototype);
        }
        return depth;
    }
    getHierarchyIds() {
        return __awaiter(this, void 0, Promise, function* () {
            let ids = [this.getId()];
            if (!this.hierarchyRoot()) {
                const parents = yield this.getParents();
                if (parents.length) {
                    const parentIds = yield Promise.all(parents.map(p => p.getHierarchyIds()));
                    ids = parentIds.reduce((out, idList) => {
                        return out.concat(idList);
                    }, ids);
                }
            }
            return ids;
        });
    }
    getPermissionsHierarchy() {
        return __awaiter(this, void 0, Promise, function* () {
            const { permissions = [] } = this.doc;
            const graph = {
                node: this.toString(),
                nodeId: this.getId(),
                permissions: permissions,
                parents: []
            };
            if (!this.hierarchyRoot()) {
                const parents = yield this.getParents();
                if (parents.length) {
                    const parentHierarchies = yield Promise.all(parents.map(p => p.getPermissionsHierarchy()));
                    graph.parents.push(...parentHierarchies);
                }
            }
            return graph;
        });
    }
}
Node.displayName = '';
Node.id = 'id';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9jbGFzc2VzL05vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUErQkE7SUE2QkUsWUFBbUIsR0FBYTtRQUFiLFFBQUcsR0FBSCxHQUFHLENBQVU7UUFFOUIsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRWpELEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQVEsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsSUFBSSxlQUFlLENBQUMsQ0FBQztRQUNqRixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssU0FBUyxDQUFDO1lBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUseUJBQXlCLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDcEYsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7WUFBQyxNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFNTyxXQUFXLENBQUMsSUFBUztRQUMzQixNQUFNLENBQWUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLENBQUM7SUFDL0QsQ0FBQztJQU1ELE9BQU87UUFDTCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQzNCLFNBQVMsR0FBRyxTQUFTLENBQUMsV0FBVyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFFMUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBTUQsUUFBUTtRQUNOLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDLElBQUksRUFDOUMsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUV4QixNQUFN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