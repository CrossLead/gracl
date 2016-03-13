"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const util_1 = require('../util');
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
    static getHierarchyClassNames() {
        const names = [];
        let nodeClass = this;
        do {
            names.push(nodeClass.displayName || nodeClass.name);
            nodeClass = util_1.getClassOf(nodeClass.prototype);
        } while (util_1.getClassOf(nodeClass.prototype) !== Node);
        return names;
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
        return util_1.getClassOf(this.constructor.prototype);
    }
    getClass() {
        return util_1.getClassOf(this);
    }
    hierarchyRoot() {
        return util_1.getClassOf(this.getParentClass().prototype) === Node;
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
        while (util_1.getClassOf(nodeClass.prototype) !== Node) {
            nodeClass = util_1.getClassOf(nodeClass.prototype);
            this.assertNodeClass(nodeClass);
        }
        return nodeClass;
    }
    getNodeDepth() {
        let depth = 0;
        let nodeClass = this.getClass();
        while (util_1.getClassOf(nodeClass.prototype) !== Node) {
            depth++;
            nodeClass = util_1.getClassOf(nodeClass.prototype);
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
        return this.getClass().getHierarchyClassNames();
    }
}
Node.displayName = '';
Node.id = 'id';
exports.Node = Node;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9jbGFzc2VzL05vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBR0EsdUJBQWdDLFNBQVMsQ0FBQyxDQUFBO0FBaUIxQztJQTZDRSxZQUFtQixHQUFhO1FBQWIsUUFBRyxHQUFILEdBQUcsQ0FBVTtRQUU5QixNQUFNLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFakQsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFBa0IsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsSUFBSSxlQUFlLENBQUMsQ0FBQztRQUMzRixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssU0FBUyxDQUFDO1lBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUUseUJBQXlCLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDcEYsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7WUFBVyxNQUFNLElBQUksS0FBSyxDQUFDLDRDQUE0QyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7SUF2QkQsT0FBYyxzQkFBc0I7UUFDbEMsTUFBTSxLQUFLLEdBQWEsRUFBRSxDQUFDO1FBQzNCLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztRQUVyQixHQUFHLENBQUM7WUFDRixLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BELFNBQVMsR0FBRyxpQkFBVSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM5QyxDQUFDLFFBQVEsaUJBQVUsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBRW5ELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lB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