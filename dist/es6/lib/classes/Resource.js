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