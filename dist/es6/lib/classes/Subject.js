var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
import { Node } from './Node';
export class Subject extends Node {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ViamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9jbGFzc2VzL1N1YmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7T0FFTyxFQUFFLElBQUksRUFBWSxNQUFNLFFBQVE7QUFFdkMsNkJBQTZCLElBQUk7SUFLekIsZUFBZSxDQUFDLFFBQWtCLEVBQUUsY0FBc0IsRUFBRSxPQUFrQjs7WUFDbEYsTUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNqRSxDQUFDO0tBQUE7SUFLSyxTQUFTLENBQUMsUUFBa0IsRUFBRSxjQUFzQixFQUFFLE9BQWtCOztZQUM1RSxNQUFNLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzNELENBQUM7S0FBQTtJQUtLLGlCQUFpQixDQUFDLFFBQWtCLEVBQUUsY0FBc0IsRUFBRSxPQUFrQjs7WUFDcEYsTUFBTSxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ25FLENBQUM7S0FBQTtBQUVILENBQUM7QUFBQSJ9