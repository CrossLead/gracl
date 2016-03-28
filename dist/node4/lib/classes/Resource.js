'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Resource = undefined;

var _Node = require('./Node');

var _util = require('../util');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

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
class Resource extends _Node.Node {
    constructor(doc) {
        super(doc);
        const key = this.getClass().permissionPropertyKey;
        if (!this.doc[key]) {
            this.doc[key] = [];
        }
        this.sortPermissions();
    }
    sortPermissions() {
        const key = this.getClass().permissionPropertyKey;
        this.doc[key].sort(_util.permissionCompare);
        return this;
    }
    setDoc(doc) {
        this.doc = doc;
        const key = this.getClass().permissionPropertyKey;
        if (!this.doc[key]) {
            this.doc[key] = [];
        }
        this.sortPermissions();
        return this;
    }
    getPermission(subject) {
        const key = this.getClass().permissionPropertyKey,
              subjectId = subject.getId(),
              permissions = this.doc[key];
        return permissions[(0, _util.permissionIndexOf)(permissions, subjectId)] || { subjectId, access: {} };
    }
    determineAccess(subject, permissionType, options) {
        return __awaiter(this, void 0, Promise, function* () {
            var _ref = options || {};

            var _ref$assertionFn = _ref.assertionFn;
            const assertionFn = _ref$assertionFn === undefined ? _util.yes : _ref$assertionFn;

            const result = {
                type: permissionType,
                access: false,
                reason: 'No permissions were set specifically for this subject/resource combination.'
            };
            if (!(yield assertionFn())) {
                result.access = false;
                result.reason = 'Failed assertion function check.';
                return result;
            }
            const resources = [];
            let currentResources = [this];
            while (currentResources.length) {
                for (const res of currentResources) {
                    const access = res.getPermission(subject).access[permissionType];
                    if (access === true || access === false) {
                        result.access = access;
                        result.reason = `Permission set on ${ res.toString() } for ${ subject.toString() } = ${ access }`;
                        return result;
                    }
                }
                resources.push.apply(resources, _toConsumableArray(currentResources));
                const parentResources = [];
                for (const res of currentResources) {
                    if (!res.hierarchyRoot()) {
                        const thisParents = yield res.getParents();
                        parentResources.push.apply(parentResources, _toConsumableArray(thisParents));
                    }
                }
                currentResources = parentResources;
            }
            resources.sort((a, b) => {
                const aDepth = a.getNodeDepth(),
                      bDepth = b.getNodeDepth();
                return 0 - (0, _util.baseCompare)(aDepth, bDepth);
            });
            let currentSubjects = [subject];
            while (currentSubjects.length) {
                for (const sub of currentSubjects) {
                    for (const res of resources) {
                        const access = res.getPermission(sub).access[permissionType];
                        if (access === true || access === false) {
                            result.access = access;
                            result.reason = `Permission set on ${ res.toString() } for ${ sub.toString() } = ${ access }`;
                            return result;
                        }
                    }
                }
                const parentSubjects = [];
                for (const sub of currentSubjects) {
                    if (!sub.hierarchyRoot()) {
                        const thisParents = yield sub.getParents();
                        parentSubjects.push.apply(parentSubjects, _toConsumableArray(thisParents));
                    }
                }
                currentSubjects = parentSubjects;
            }
            return result;
        });
    }
    isAllowed(subject, permissionType, options) {
        return __awaiter(this, void 0, Promise, function* () {
            const result = yield this.determineAccess(subject, permissionType, options);
            return result.access;
        });
    }
    explainPermission(subject, permissionType, options) {
        return __awaiter(this, void 0, Promise, function* () {
            const result = yield this.determineAccess(subject, permissionType, options);
            return result.reason;
        });
    }
    updatePermission(subject, action) {
        return __awaiter(this, void 0, Promise, function* () {
            const doc = this.doc;const permissions = doc.permissions;const subjectId = subject.getId();const subjectType = subject.getName();const resourceId = this.getId();const resourceType = this.getName();
            const existingPermissionIndex = (0, _util.permissionIndexOf)(permissions, subjectId),
                  CurrentResourceClass = this.getClass();
            if (existingPermissionIndex >= 0) {
                permissions[existingPermissionIndex] = action(permissions[existingPermissionIndex]);
            } else {
                permissions.push(action({ subjectId, resourceId, resourceType, subjectType }));
            }
            const id = this.getId(),
                  updated = yield CurrentResourceClass.repository.saveEntity(id, doc, this);
            return this.setDoc(updated);
        });
    }
    setPermissionAccess(subject, permissionType, access) {
        return this.updatePermission(subject, permission => {
            (permission.access = permission.access || {})[permissionType] = access;
            return permission;
        });
    }
    allow(subject, permissionType) {
        return this.setPermissionAccess(subject, permissionType, true);
    }
    deny(subject, permissionType) {
        return this.setPermissionAccess(subject, permissionType, false);
    }
    getPermissionsHierarchy() {
        return __awaiter(this, void 0, Promise, function* () {
            const key = this.getClass().permissionPropertyKey;
            const permissions = this.doc[key];
            const graph = {
                node: this.toString(),
                nodeId: this.getId(),
                permissions: permissions,
                parents: []
            };
            if (!this.hierarchyRoot()) {
                const parents = yield this.getParents();
                if (parents.length) {
                    var _graph$parents;

                    const parentHierarchies = yield Promise.all(parents.map(p => p.getPermissionsHierarchy()));
                    (_graph$parents = graph.parents).push.apply(_graph$parents, _toConsumableArray(parentHierarchies));
                }
            }
            return graph;
        });
    }
}
exports.Resource = Resource;