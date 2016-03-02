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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvY2xhc3Nlcy9SZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztPQUNPLEVBQUUsSUFBSSxFQUF1QixNQUFNLFFBQVE7T0FDM0MsRUFBRSxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFLE1BQU0sU0FBUztBQW9CaEYsOEJBQThCLElBQUk7SUFNaEMsWUFBWSxHQUFhO1FBQ3ZCLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDWCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsSUFBSSxFQUFFLENBQUM7UUFDdEUsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFNRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFHRCxNQUFNLENBQUMsR0FBYTtRQUNsQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQU9ELGFBQWEsQ0FBQyxPQUFnQjtRQUM1QixNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQzNCLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNqQyxNQUFNLENBQUMsV0FBVyxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxFQUFHLEVBQUUsQ0FBQztJQUM5RixDQUFDO0lBZ0JLLGVBQWUsQ0FBQyxPQUFnQixF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