'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Node = undefined;

var _util = require('../util');

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
class Node {
    constructor(doc) {
        this.doc = doc;

        var _getClass = this.getClass();

        const name = _getClass.name;
        const repository = _getClass.repository;
        const id = _getClass.id;

        if (!doc) throw new Error(`No document provided to ${ name } constructor!`);
        if (doc[id] === undefined) throw new Error(`No ${ id } property on document ${ doc }!`);
        if (!repository) throw new Error(`No repository static property defined on ${ name }!`);
    }
    static getHierarchyClassNames() {
        const names = [];
        let nodeClass = this;
        do {
            names.push(nodeClass.displayName || nodeClass.name);
            nodeClass = (0, _util.getClassOf)(nodeClass.prototype);
        } while ((0, _util.getClassOf)(nodeClass.prototype) !== Node);
        return names;
    }
    getName() {
        const thisClass = this.getClass(),
              className = thisClass.displayName || thisClass.name;
        return className;
    }
    toString() {
        const nodeSubclassName = this.getNodeSubclass().name,
              id = this.getId();
        return `<${ nodeSubclassName }:${ this.getName() } id=${ id }>`;
    }
    isNodeType(nc) {
        return this.getClass() === nc;
    }
    getParentClass() {
        return (0, _util.getClassOf)(this.constructor.prototype);
    }
    getClass() {
        return (0, _util.getClassOf)(this);
    }
    hierarchyRoot() {
        return (0, _util.getClassOf)(this.getParentClass().prototype) === Node;
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
            var _getClass2 = this.getClass();

            const parentId = _getClass2.parentId;

            if (parentId) {
                const parentIds = this.doc[parentId] || [];
                if (Array.isArray(parentIds)) {
                    const promises = parentIds.map(id => {
                        return this.getParentNode(id);
                    });
                    return yield Promise.all(promises);
                } else {
                    return [yield this.getParentNode(parentIds)];
                }
            } else {
                console.warn(`Calling Node.getParents() without Node.parentId, must implement on subclass!`);
                return [];
            }
        });
    }

    getParentNode(data) {
        return __awaiter(this, void 0, Promise, function* () {
            const ParentClass = this.getParentClass();
            let doc;
            if (typeof data === 'string') {
                if (!ParentClass.repository) {
                    throw new Error(`No static repository property present on ${ ParentClass.name } Node!`);
                }
                doc = yield ParentClass.repository.getEntity(data, this);
            } else {
                doc = data;
            }
            return new ParentClass(doc);
        });
    }
    assertNodeClass(nodeClass) {
        if (!(nodeClass.prototype instanceof Node)) {
            throw new Error(`Link in hierarchy chain (${ nodeClass.name }) is not an instance of Node!`);
        }
    }
    getNodeSubclass() {
        let nodeClass = this.getClass();
        this.assertNodeClass(nodeClass);
        while ((0, _util.getClassOf)(nodeClass.prototype) !== Node) {
            nodeClass = (0, _util.getClassOf)(nodeClass.prototype);
            this.assertNodeClass(nodeClass);
        }
        return nodeClass;
    }
    getNodeDepth() {
        let depth = 0;
        let nodeClass = this.getClass();
        while ((0, _util.getClassOf)(nodeClass.prototype) !== Node) {
            depth++;
            nodeClass = (0, _util.getClassOf)(nodeClass.prototype);
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
exports.Node = Node;
Node.displayName = '';
Node.id = 'id';