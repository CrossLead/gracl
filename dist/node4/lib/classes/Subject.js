'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Subject = undefined;

var _Node = require('./Node');

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
class Subject extends _Node.Node {
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