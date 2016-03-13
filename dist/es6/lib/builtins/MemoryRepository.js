"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
class MemoryRepository {
    constructor(data = {}) {
        this.data = data;
    }
    getEntity(id) {
        return __awaiter(this, void 0, Promise, function* () {
            return this.data[id];
        });
    }
    saveEntity(id, doc) {
        return __awaiter(this, void 0, Promise, function* () {
            return this.data[id] = doc;
        });
    }
}
exports.MemoryRepository = MemoryRepository;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVtb3J5UmVwb3NpdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9idWlsdGlucy9NZW1vcnlSZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUtBO0lBSUUsWUFBWSxJQUFJLEdBQUcsRUFBRTtRQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDO0lBRUssU0FBUyxDQUFDLEVBQVU7O1lBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7S0FBQTtJQUVLLFVBQVUsQ0FBQyxFQUFVLEVBQUUsR0FBYTs7WUFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQzdCLENBQUM7S0FBQTtBQUVILENBQUM7QUFoQlksd0JBQWdCLG1CQWdCNUIsQ0FBQSJ9