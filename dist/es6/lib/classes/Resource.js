var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
import { Node } from './Node';
import { permissionCompare, permissionIndexOf, yes, baseCompare } from '../util';
export class Resource extends Node {
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
        this.doc[key].sort(permissionCompare);
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
        const key = this.getClass().permissionPropertyKey, subjectId = subject.getId(), permissions = this.doc[key];
        return permissions[permissionIndexOf(permissions, subjectId)] || { subjectId, access: {} };
    }
    determineAccess(subject, permissionType, options) {
        return __awaiter(this, void 0, Promise, function* () {
            const { assertionFn = yes } = options || {};
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
                        result.reason = `Permission set on ${res.toString()} for ${subject.toString()} = ${access}`;
                        if (access === false)
                            return result;
                    }
                }
                resources.push(...currentResources);
                const parentResources = [];
                for (const res of currentResources) {
                    if (!res.hierarchyRoot()) {
                        const thisParents = (yield res.getParents());
                        parentResources.push(...thisParents);
                    }
                }
                currentResources = parentResources;
            }
            resources.sort((a, b) => {
                const aDepth = a.getNodeDepth(), bDepth = b.getNodeDepth();
                return 0 - baseCompare(aDepth, bDepth);
            });
            let currentSubjects = [subject];
            while (currentSubjects.length) {
                for (const sub of currentSubjects) {
                    for (const res of resources) {
                        const access = res.getPermission(sub).access[permissionType];
                        if (access === true || access === false) {
                            result.access = access;
                            result.reason = `Permission set on ${res.toString()} for ${sub.toString()} = ${access}`;
                            if (access === false)
                                return result;
                        }
                    }
                }
                const parentSubjects = [];
                for (const sub of currentSubjects) {
                    if (!sub.hierarchyRoot()) {
                        const thisParents = (yield sub.getParents());
                        parentSubjects.push(...thisParents);
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
            const { doc } = this, key = this.getClass().permissionPropertyKey, permissions = doc[key], subjectId = subject.getId(), subjectType = subject.getName(), resourceId = this.getId(), resourceType = this.getName();
            const existingPermissionIndex = permissionIndexOf(permissions, subjectId), CurrentResourceClass = this.getClass();
            if (existingPermissionIndex >= 0) {
                permissions[existingPermissionIndex] = action(permissions[existingPermissionIndex]);
            }
            else {
                permissions.push(action({ subjectId, resourceId, resourceType, subjectType }));
            }
            const id = this.getId(), updated = yield CurrentResourceClass.repository.saveEntity(id, doc, this);
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
                    const parentHierarchies = yield Promise.all(parents.map(p => p.getPermissionsHierarchy()));
                    graph.parents.push(...parentHierarchies);
                }
            }
            return graph;
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvY2xhc3Nlcy9SZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztPQUNPLEVBQUUsSUFBSSxFQUFZLE1BQU0sUUFBUTtPQUNoQyxFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTO0FBdUJoRiw4QkFBOEIsSUFBSTtJQU1oQyxZQUFZLEdBQWE7UUFDdkIsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNYLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztRQUNsRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3JCLENBQUM7UUFDRCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQU1ELGVBQWU7UUFDYixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMscUJBQXFCLENBQUM7UUFDbEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUdELE1BQU0sQ0FBQyxHQUFhO1FBQ2xCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLHFCQUFxQixDQUFDO1FBQ2xELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxH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