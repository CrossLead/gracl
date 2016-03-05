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
}
Node.displayName = '';
Node.id = 'id';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9jbGFzc2VzL05vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFvQkE7SUE2QkUsWUFBbUIsR0FBYTtRQUFiLFFBQUcsR0FBSCxHQUFHLENBQVU7UUFFOUIsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRWpELEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQWtCLE1BQU0sSUFBSSxLQUFLLENBQUMsMkJBQTJCLElBQUksZUFBZSxDQUFDLENBQUM7UUFDM0YsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLFNBQVMsQ0FBQztZQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxFQUFFLHlCQUF5QixHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ3BGLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQVcsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNsRyxDQUFDO0lBTU8sV0FBVyxDQUFDLElBQVM7UUFDM0IsTUFBTSxDQUFlLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxDQUFDO0lBQy9ELENBQUM7SUFNRCxPQUFPO1FBQ0wsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUMzQixTQUFTLEdBQUcsU0FBUyxDQUFDLFdBQVcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDO1FBRTFELE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQU1ELFFBQVE7UUFDTixNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQyxJQUFJLEVBQzlDLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFeEIsTUFB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