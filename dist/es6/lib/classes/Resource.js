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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9saWIvY2xhc3Nlcy9SZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztPQUNPLEVBQUUsSUFBSSxFQUFZLE1BQU0sUUFBUTtPQUNoQyxFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsTUFBTSxTQUFTO0FBZWhGLDhCQUE4QixJQUFJO0lBTWhDLFlBQVksR0FBYTtRQUN2QixNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO1FBQ3RFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBTUQsZUFBZTtRQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBR0QsTUFBTSxDQUFDLEdBQWE7UUFDbEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFPRCxhQUFhLENBQUMsT0FBZ0I7UUFDNUIsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUMzQixFQUFFLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDakMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsRUFBRyxFQUFFLENBQUM7SUFDOUYsQ0FBQztJQWdCSyxlQUFlLENBQUMsT0FBZ0IsRUFBRSxjQUFzQixFQUFFLE9BQWtCOztZQUVoRixNQUFNLEVBQ0osV0FBVyxHQUFHLEdBQUcsRUFDbEIsR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1lBRWxCLE1BQU0sTUFBTSxHQUFHO2dCQUNiLElBQUksRUFBRSxjQUFjO2dCQUNwQixNQUFNLEVBQUUsS0FBSztnQkFDYixNQUFNLEVBQUUsNkVBQTZFO2FBQ3RGLENBQUM7WUFNRixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0IsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsa0NBQWtDLENBQUM7Z0JBQ25ELE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDaEIsQ0FBQztZQU9ELE1BQU0sU0FBUyxHQUFvQixFQUFFLENBQUM7WUFDdEMsSUFBSSxnQkFBZ0IsR0FBcUIsQ0FBRSxJQUFJLENBQUUsQ0FBQztZQUNsRCxPQUFPLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUUvQixHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUNqRSxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssSUFBSSxJQUFJLE1BQU0sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDO3dCQUN4QyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzt3QkFDdkIsTUFBTSxDQUFDLE1BQU0sR0FBRyxxQkFBcUIsR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBTSxNQUFNLEVBQUUsQ0FBQzt3QkFDNUYsTUFBTSxDQUFDLE1BQU0sQ0FBQztvQkFDaEIsQ0FBQztnQkFDSCxDQUFDO2dCQUVELFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUNwQyxNQUFNLGVBQWUsR0FBb0IsRUFBRSxDQUFDO2dCQUU1QyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDekIsTUFBTSxXQUFXLEdBQXFCLENBQUMsTUFBTSxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQzt3QkFDL0QsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDO29CQUN2QyxDQUFDO2dCQUNILENBQUM7Z0JBRUQsZ0JBQWdCLEdBQUcsZUFBZSxDQUFDO1lBQ3JDLENBQUM7WUFHRCxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ2xCLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsRUFDekIsTUFBTSxHQUFHLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFFaEMsTUFBTSxDQUFDLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3pDLENBQUMsQ0FBQyxDQUFDO1lBTUgsSUFBSSxlQUFlLEdBQW1CLENBQUUsT0FBTyxDQUFFLENBQUM7WUFDbEQsT0FBTyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBSzlCLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLGVBQWUsQ0FBQyxDQUFDLENBQUM7b0JBQ2xDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQzVCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO3dCQUM3RCxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssSUFBSSxJQUFJLE1BQU0sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDOzRCQUN4QyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs0QkFDdkIsTUFBTSxDQUFDLE1BQU0sR0FBRyxxQkFBcUIsR0FBRyxDQUFDLFFBQVEsRUFBRSxRQUFRLEdBQUcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxNQUFNLEVBQUUsQ0FBQzs0QkFDeEYsTUFBTSxDQUFDLE1BQU0sQ0FBQzt3QkFDaEIsQ0FBQztvQkFDSCxDQUFDO2dCQUNILENBQUM7Z0JBRUQsTUFBTSxjQUFjLEdBQW1CLEVBQUUsQ0FBQztnQkFDMUMsR0FBRyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksZUFBZSxDQUFDLENBQUMsQ0FBQztvQkFDbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO3dCQUN6QixNQUFNLFdBQVcsR0FBb0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO3dCQUM5RCxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUM7b0JBQ3RDLENBQUM7Z0JBQ0gsQ0FBQztnQkFFRCxlQUFlLEdBQUcsY0FBYyxDQUFDO1lBQ25DLENBQUM7WUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7S0FBQTtJQU1LLFNBQVMsQ0FBQyxPQUFnQixFQUFFLGNBQXNCLEVBQUUsT0FBa0I7O1lBQzFFLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQzVFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3ZCLENBQUM7S0FBQTtJQU1LLGlCQUFpQixDQUFDLE9BQWdCLEVBQUUsY0FBc0IsRUFBRSxPQUFrQjs7WUFDbEYsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDNUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDdkIsQ0FBQztLQUFBO0lBT0ssZ0JBQWdCLENBQUMsT0FBZ0IsRUFBRSxNQUFxQzs7WUFDNUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksRUFDZCxFQUFFLFdBQVcsRUFBRSxHQUFHLEdBQUcsRUFDckIsU0FBUyxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUVsQyxNQUFNLHVCQUF1QixHQUFHLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsRUFDbkUsb0JBQW9CLEdBQXFCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUUvRCxFQUFFLENBQUMsQ0FBQyx1QkFBdUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxXQUFXLENBQUMsdUJBQXVCLENBQUMsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQztZQUN0RixDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBRU4sV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDMUMsQ0FBQztZQUdELE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFDakIsT0FBTyxHQUFHLE1BQU0sb0JBQW9CLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFFMUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDOUIsQ0FBQztLQUFBO0lBTUQsbUJBQW1CLENBQUMsT0FBZ0IsRUFBRSxjQUFzQixFQUFFLE1BQWU7UUFDM0UsTUFBTSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsVUFBVTtZQUM5QyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDdkUsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNwQixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFNRCxLQUFLLENBQUMsT0FBZ0IsRUFBRSxjQUFzQjtRQUM1QyxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDakUsQ0FBQztJQU1ELElBQUksQ0FBQyxPQUFnQixFQUFFLGNBQXNCO1FBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNsRSxDQUFDO0FBR0gsQ0FBQztBQUFBIn0=