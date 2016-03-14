"use strict";

var _getPrototypeOf = require("babel-runtime/core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function noop() {}
exports.noop = noop;
function yes() {
    return true;
}
exports.yes = yes;
function baseCompare(a, b) {
    return Number(a > b) - Number(a < b);
}
exports.baseCompare = baseCompare;
function binaryIndexOf(arr, el) {
    var compare = arguments.length <= 2 || arguments[2] === undefined ? baseCompare : arguments[2];

    var low = 0,
        high = arr.length - 1;
    while (low <= high) {
        var pivot = high + low >> 1,
            diff = compare(el, arr[pivot]);
        if (diff > 0) low = pivot + 1;else if (diff < 0) high = pivot - 1;else return pivot;
    }
    return -1;
}
exports.binaryIndexOf = binaryIndexOf;
function permissionCompare(a, b) {
    return baseCompare(a.subjectId, b.subjectId);
}
exports.permissionCompare = permissionCompare;
function permissionIndexOf(arr, subjectId) {
    return binaryIndexOf(arr, { subjectId: subjectId }, permissionCompare);
}
exports.permissionIndexOf = permissionIndexOf;
function getClassOf(node) {
    return (0, _getPrototypeOf2.default)(node).constructor;
}
exports.getClassOf = getClassOf;