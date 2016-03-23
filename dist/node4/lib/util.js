"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.noop = noop;
exports.yes = yes;
exports.baseCompare = baseCompare;
exports.binaryIndexOf = binaryIndexOf;
exports.permissionCompare = permissionCompare;
exports.permissionIndexOf = permissionIndexOf;
exports.getClassOf = getClassOf;
function noop() {}
function yes() {
    return true;
}
function baseCompare(a, b) {
    return Number(a > b) - Number(a < b);
}
function binaryIndexOf(arr, el) {
    let compare = arguments.length <= 2 || arguments[2] === undefined ? baseCompare : arguments[2];

    let low = 0,
        high = arr.length - 1;
    while (low <= high) {
        const pivot = high + low >> 1,
              diff = compare(el, arr[pivot]);
        if (diff > 0) low = pivot + 1;else if (diff < 0) high = pivot - 1;else return pivot;
    }
    return -1;
}
function permissionCompare(a, b) {
    return baseCompare(a.subjectId, b.subjectId);
}
function permissionIndexOf(arr, subjectId) {
    return binaryIndexOf(arr, { subjectId }, permissionCompare);
}
function getClassOf(node) {
    return Object.getPrototypeOf(node).constructor;
}