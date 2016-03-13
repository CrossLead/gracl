"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
class Node {
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
    getHierarchyClassNames() {
        const names = [];
        let nodeClass = this.getClass();
        do {
            names.push(nodeClass.displayName || nodeClass.name);
            nodeClass = this._getClassOf(nodeClass.prototype);
        } while (this._getClassOf(nodeClass.prototype) !== Node);
        return names;
    }
}
Node.displayName = '';
Node.id = 'id';
exports.Node = Node;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9jbGFzc2VzL05vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBb0JBO0lBNkJFLFlBQW1CLEdBQWE7UUFBYixRQUFHLEdBQUgsR0FBRyxDQUFVO1FBRTlCLE1BQU0sRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVqRCxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUFrQixNQUFNLElBQUksS0FBSyxDQUFDLDJCQUEyQixJQUFJLGVBQWUsQ0FBQyxDQUFDO1FBQzNGLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsS0FBSyxTQUFTLENBQUM7WUFBQyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sRUFBRSx5QkFBeUIsR0FBRyxHQUFHLENBQUMsQ0FBQztRQUNwRixFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztZQUFXLE1BQU0sSUFBSSxLQUFLLENBQUMsNENBQTRDLElBQUksR0FBRyxDQUFDLENBQUM7SUFDbEcsQ0FBQztJQU1PLFdBQVcsQ0FBQyxJQUFTO1FBQzNCLE1BQU0sQ0FBZSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsQ0FBQztJQUMvRCxDQUFDO0lBTUQsT0FBTztRQUNMLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFDM0IsU0FBUyxHQUFHLFNBQVMsQ0FBQyxXQUFXLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQztRQUUxRCxNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFNRCxRQUFRO1FBQ04sTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxFQUM5QyxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRXhCLE1B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