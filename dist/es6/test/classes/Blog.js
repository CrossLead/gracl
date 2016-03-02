var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
import { MemoryRepository as Repo } from '../../lib/index';
import { OrganizationResource } from './Organization';
export const blogModel = new Repo();
export class Blog extends OrganizationResource {
}
Blog.repository = blogModel;
Blog.parentId = 'organizationId';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmxvZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY2xhc3Nlcy9CbG9nLnRzIl0sIm5hbWVzIjpbIkJsb2ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7T0FBTyxFQUFFLGdCQUFnQixJQUFJLElBQUksRUFBRSxNQUFNLGlCQUFpQjtPQUNuRCxFQUFFLG9CQUFvQixFQUFFLE1BQU0sZ0JBQWdCO0FBRXJELGFBQWEsU0FBUyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7QUFFcEMsMEJBQTBCLG9CQUFvQjtBQUc5Q0EsQ0FBQ0E7QUFGUSxlQUFVLEdBQUcsU0FBUyxDQUFDO0FBQ3ZCLGFBQVEsR0FBRyxnQkFBZ0IsQ0FDbkMifQ==