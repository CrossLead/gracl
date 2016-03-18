"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const Node_1 = require('./Node');
const util_1 = require('../util');
class Resource extends Node_1.Node {
    constructor(doc) {
        super(doc);
        this.sortPermissions();
    }
    sortPermissions() {
        if (!this.doc.permissions) {
            this.doc.permissions = [];
        }
        this.doc.permissions.sort(util_1.permissionCompare);
        return this;
    }
    setDoc(doc) {
        this.doc = doc;
        this.sortPermissions();
        return this;
    }
    getPermission(subject) {
        const subjectId = subject.getId(), { permissions } = this.doc;
        return permissions[util_1.permissionIndexOf(permissions, subjectId)] || { subjectId: subjectId, access: {} };
    }
    determineAccess(subject, permissionType, options) {
        return __awaiter(this, void 0, Promise, function* () {
            const { assertionFn = util_1.yes } = options || {};
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
                return 0 - util_1.baseCompare(aDepth, bDepth);
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
            const { doc } = this, { permissions } = doc, subjectId = subject.getId(), resourceId = this.getId();
            const existingPermissionIndex = util_1.permissionIndexOf(permissions, subjectId), CurrentResourceClass = this.getClass();
            if (existingPermissionIndex >= 0) {
                permissions[existingPermissionIndex] = action(permissions[existingPermissionIndex]);
            }
            else {
                permissions.push(action({ subjectId: subjectId, resourceId: resourceId }));
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
exports.Resource = Resource;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvY2xhc3Nlcy9SZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDQSx1QkFBK0IsUUFBUSxDQUFDLENBQUE7QUFDeEMsdUJBQXVFLFNBQVMsQ0FBQyxDQUFBO0FBdUJqRix1QkFBOEIsV0FBSTtJQU1oQyxZQUFZLEdBQWE7UUFDdkIsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBTUQsZUFBZTtRQUNiLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUM1QixDQUFDO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLHdCQUFpQixDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFHRCxNQUFNLENBQUMsR0FBYTtRQUNsQixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQU9ELGFBQWEsQ0FBQyxPQUFnQjtRQUM1QixNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQzNCLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNqQyxNQUFNLENBQUMsV0FBVyxDQUFDLHdCQUFpQixDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLEVBQUUsV0FBQSxTQUFTLEVBQUUsTUFBTSxFQUFFLEVBQUcsRUFBRSxDQUFDO0lBQzlGLENBQUM7SUFnQkssZUFBZSxDQUFDLE9BQWdCLEVBQUUsY0FBc0IsRUFBRSxPQUFrQjs7WUFFaEYsTUFBTSxFQUNKLFdBQVcsR0FBRyxVQUFHLEVBQ2xCLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztZQUVsQixNQUFNLE1BQU0sR0FBRztnQkFDYixJQUFJLEVBQUUsY0FBYztnQkFDcEIsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsTUFBTSxFQUFFLDZFQUE2RTthQUN0RixDQUFDO1lBTUYsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO2dCQUN0QixNQUFNLENBQUMsTUFBTSxHQUFHLGtDQUFrQyxDQUFDO2dCQUNuRCxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2hCLENBQUM7WUFPRCxNQUFNLFNBQVMsR0FBZSxFQUFFLENBQUM7WUFDakMsSUFBSSxnQkFBZ0IsR0FBZ0IsQ0FBRSxJQUFJLENBQUUsQ0FBQztZQUM3QyxPQUFPLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUUvQixHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUNqRSxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssSUFBSSxJQUFJLE1BQU0sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUN4QyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzt3QkFDdkIsTUFBTSxDQUFDLE1BQU0sR0FBRyxxQkFBcUIsR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBTSxNQUFNLEVBQUUsQ0FBQzt3QkFDNUYsTUFBTSxDQUFDLE1BQU0sQ0FBQztvQkFDaEIsQ0FBQztnQkFDSCxDQUFDO2dCQUVELFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUNwQyxNQUFNLGVBQWUsR0FBZSxFQUFFLENBQUM7Z0JBRXZDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQztvQkFDbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUN6QixNQUFNLFdBQVcsR0FBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO3dCQUMxRCxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUM7b0JBQ3ZDLENBQUM7Z0JBQ0gsQ0FBQztnQkFFRCxnQkFBZ0IsR0FBRyxlQUFlLENBQUM7WUFDckMsQ0FBQztZQUdELFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDbEIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUN6QixNQUFNLEdBQUcsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDO2dCQUVoQyxNQUFNLENBQUMsQ0FBQyxHQUFHLGtCQUFXLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3pDLENBQUMsQ0FBQyxDQUFDO1lBTUgsSUFBSSxlQUFlLEdBQWMsQ0FBRSxPQUFPLENBQUUsQ0FBQztZQUM3QyxPQUFPLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFLOUIsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDLENBQUMsQ0FBQztvQkFDbEMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQzt3QkFDNUIsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7d0JBQzdELEVBQUUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxJQUFJLElBQUksTUFBTSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7NEJBQ3hDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOzRCQUN2QixNQUFNLENBQUMsTUFBTSxHQUFHLHFCQUFxQixHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsR0FBRyxDQUFDLFFBQVEsRUFBRSxNQUFNLE1BQU0sRUFBRSxDQUFDOzRCQUN4RixNQUFNLENBQUMsTUFBTSxDQUFDO3dCQUNoQixDQUFDO29CQUNILENBQUM7Z0JBQ0gsQ0FBQztnQkFFRCxNQUFNLGNBQWMsR0FBYyxFQUFFLENBQUM7Z0JBQ3JDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDekIsTUFBTSxXQUFXLEdBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO3dCQUN6RCxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUM7b0JBQ3RDLENBQUM7Z0JBQ0gsQ0FBQztnQkFFRCxlQUFlLEdBQUcsY0FBYyxDQUFDO1lBQ25DLENBQUM7WUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7S0FBQTtJQU1LLFNBQVMsQ0FBQyxPQUFnQixFQUFFLGNBQXNCLEVBQUUsT0FBa0I7O1lBQzFFLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzVFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLENBQUM7S0FBQTtJQU1LLGlCQUFpQixDQUFDLE9BQWdCLEVBQUUsY0FBc0IsRUFBRSxPQUFrQjs7WUFDbEYsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDNUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDdkIsQ0FBQztLQUFBO0lBT0ssZ0JBQWdCLENBQUMsT0FBZ0IsRUFBRSxNQUFxQzs7WUFDNUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksRUFDZCxFQUFFLFdBQVcsRUFBRSxHQUFHLEdBQUcsRUFDckIsU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFDM0IsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUVoQyxNQUFNLHVCQUF1QixHQUFHLHdCQUFpQixDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsRUFDbkUsb0JBQW9CLEdBQXFCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUUvRCxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxXQUFXLENBQUMsdUJBQXVCLENBQUMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztZQUN0RixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRU4sV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxXQUFBLFNBQVMsRUFBRSxZQUFBLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN0RCxDQUFDO1lBR0QsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUNqQixPQUFPLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUUxRSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixDQUFDO0tBQUE7SUFNRCxtQkFBbUIsQ0FBQyxPQUFnQixFQUFFLGNBQXNCLEVBQUUsTUFBZTtRQUMzRSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFVO1lBQzlDLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztZQUN2RSxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQU1ELEtBQUssQ0FBQyxPQUFnQixFQUFFLGNBQXNCO1FBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBTUQsSUFBSSxDQUFDLE9BQWdCLEVBQUUsY0FBc0I7UUFDM0MsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsY0FBYyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFNSyx1QkFBdUI7O1lBQzNCLE1BQU0sRUFBRSxXQUFXLEdBQUcsRUFBRSxFQUFFLEdBQTZCLElBQUksQ0FBQyxHQUFHLENBQUM7WUFFaEUsTUFBTSxLQUFLLEdBQXlCO2dCQUNsQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDckIsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ3BCLFdBQVcsRUFBaUIsV0FBVztnQkFDdkMsT0FBTyxFQUFFLEVBQUU7YUFDWixDQUFDO1lBRUYsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixNQUFNLE9BQU8sR0FBRyxNQUE2QixJQUFJLENBQUMsVUFBVSxFQUFHLENBQUM7Z0JBQ2hFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNuQixNQUFNLGlCQUFpQixHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLHVCQUF1QixFQUFFLENBQUMsQ0FDOUMsQ0FBQztvQkFDRixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLGlCQUFpQixDQUFDLENBQUM7Z0JBQzNDLENBQUM7WUFDSCxDQUFDO1lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7S0FBQTtBQUdILENBQUM7QUE1UFksZ0JBQVEsV0E0UHBCLENBQUEifQ==