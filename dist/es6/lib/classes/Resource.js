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
        const permissions = this.doc.permissions = this.doc.permissions || [];
        this.sortPermissions();
    }
    sortPermissions() {
        this.doc.permissions.sort(permissionCompare);
        return this;
    }
    setDoc(doc) {
        this.doc = doc;
        this.sortPermissions();
        return this;
    }
    getPermission(subject) {
        const subjectId = subject.getId(), { permissions } = this.doc;
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
            const { doc } = this, { permissions } = doc, subjectId = subject.getId();
            const existingPermissionIndex = permissionIndexOf(permissions, subjectId), CurrentResourceClass = this.getClass();
            if (existingPermissionIndex >= 0) {
                permissions[existingPermissionIndex] = action(permissions[existingPermissionIndex]);
            }
            else {
                permissions.push(action({ subjectId }));
            }
            const id = this.getId(), updated = yield CurrentResourceClass.repository.saveEntity(id, doc);
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
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvY2xhc3Nlcy9SZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztPQUNPLEVBQUUsSUFBSSxFQUFZLE1BQU0sUUFBUTtPQUNoQyxFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTO0FBZWhGLDhCQUE4QixJQUFJO0lBTWhDLFlBQVksR0FBYTtRQUN2QixNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO1FBQ3RFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBTUQsZUFBZTtRQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBR0QsTUFBTSxDQUFDLEdBQWE7UUFDbEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFPRCxhQUFhLENBQUMsT0FBZ0I7UUFDNUIsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUMzQixFQUFFLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDakMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsRUFBRyxFQUFFLENBQUM7SUFDOUYsQ0FBQztJQWdCSyxlQUFlLENBQUMsT0FBZ0IsRUFB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