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
import { Team } from './Team';
export const userModel = new Repo();
export class User extends Team {
}
User.repository = userModel;
User.parentId = 'teamIds';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY2xhc3Nlcy9Vc2VyLnRzIl0sIm5hbWVzIjpbIlVzZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7T0FBTyxFQUFFLGdCQUFnQixJQUFJLElBQUksRUFBRSxNQUFNLGlCQUFpQjtPQUNuRCxFQUFFLElBQUksRUFBRSxNQUFNLFFBQVE7QUFFN0IsYUFBYSxTQUFTLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUVwQywwQkFBMEIsSUFBSTtBQUc5QkEsQ0FBQ0E7QUFGUSxlQUFVLEdBQUcsU0FBUyxDQUFDO0FBQ3ZCLGFBQVEsR0FBRyxTQUFTLENBQzVCIn0=