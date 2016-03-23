var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
export class MemoryRepository {
    constructor(data = {}) {
        this.data = data;
    }
    getEntity(id, node) {
        return __awaiter(this, void 0, Promise, function* () {
            return this.data[id];
        });
    }
    saveEntity(id, doc, node) {
        return __awaiter(this, void 0, Promise, function* () {
            return this.data[id] = doc;
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWVtb3J5UmVwb3NpdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9idWlsdGlucy9NZW1vcnlSZXBvc2l0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBS0E7SUFJRSxZQUFZLElBQUksR0FBRyxFQUFFO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ25CLENBQUM7SUFFSyxTQUFTLENBQUMsRUFBVSxFQUFFLElBQVc7O1lBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7S0FBQTtJQUVLLFVBQVUsQ0FBQyxFQUFVLEVBQUUsR0FBYSxFQUFFLElBQVc7O1lBQ3JELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUM3QixDQUFDO0tBQUE7QUFFSCxDQUFDO0FBQUEifQ==