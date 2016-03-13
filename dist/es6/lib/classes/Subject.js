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
class Subject extends Node_1.Node {
    determineAccess(resource, permissionType, options) {
        return __awaiter(this, void 0, Promise, function* () {
            return resource.determineAccess(this, permissionType, options);
        });
    }
    isAllowed(resource, permissionType, options) {
        return __awaiter(this, void 0, Promise, function* () {
            return resource.isAllowed(this, permissionType, options);
        });
    }
    explainPermission(resource, permissionType, options) {
        return __awaiter(this, void 0, Promise, function* () {
            return resource.explainPermission(this, permissionType, options);
        });
    }
}
exports.Subject = Subject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ViamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9jbGFzc2VzL1N1YmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBRUEsdUJBQStCLFFBQVEsQ0FBQyxDQUFBO0FBRXhDLHNCQUE2QixXQUFJO0lBS3pCLGVBQWUsQ0FBQyxRQUFrQixFQUFFLGNBQXNCLEVBQUUsT0FBa0I7O1lBQ2xGLE1BQU0sQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDakUsQ0FBQztLQUFBO0lBS0ssU0FBUyxDQUFDLFFBQWtCLEVBQUUsY0FBc0IsRUFBRSxPQUFrQjs7WUFDNUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUMzRCxDQUFDO0tBQUE7SUFLSyxpQkFBaUIsQ0FBQyxRQUFrQixFQUFFLGNBQXNCLEVBQUUsT0FBa0I7O1lBQ3BGLE1BQU0sQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNuRSxDQUFDO0tBQUE7QUFFSCxDQUFDO0FBdkJZLGVBQU8sVUF1Qm5CLENBQUEifQ==