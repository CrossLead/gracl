"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
class MemoryRepository {
    constructor() {
        let data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

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
exports.MemoryRepository = MemoryRepository;