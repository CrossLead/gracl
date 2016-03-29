'use strict';

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
exports.topologicalSort = topologicalSort;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

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
function topologicalSort(nodes) {
    let nameKey = arguments.length <= 1 || arguments[1] === undefined ? 'name' : arguments[1];
    let parentKey = arguments.length <= 2 || arguments[2] === undefined ? 'parent' : arguments[2];

    const nodeList = [],
          noParentList = [],
          parentMapping = new Map(),
          remainingNodes = new Set(nodes.map(n => n[nameKey]));
    for (const schemaNode of nodes) {
        const name = schemaNode[nameKey],
              parentProp = schemaNode[parentKey];
        if (!name) {
            throw new Error(`No ${ nameKey } field on node = ${ schemaNode }`);
        }
        const parents = Array.isArray(parentProp) ? parentProp : [parentProp];
        if (!parentProp) {
            noParentList.push(schemaNode);
            remainingNodes.delete(schemaNode[nameKey]);
        } else {
            for (const parent of parents) {
                if (!parentMapping.has(parent)) {
                    parentMapping.set(parent, [schemaNode]);
                } else {
                    parentMapping.get(parent).push(schemaNode);
                }
            }
        }
    }
    while (noParentList.length) {
        const rootNode = noParentList.pop();
        nodeList.push(rootNode);
        if (parentMapping.has(rootNode[nameKey])) {
            const children = parentMapping.get(rootNode[nameKey]);
            while (children.length) {
                const child = children.pop();
                remainingNodes.delete(child[nameKey]);
                noParentList.push(child);
            }
        }
    }
    if (remainingNodes.size) {
        throw new Error('Schema has a circular dependency or a missing parent! Examine definitions for ' + [].concat(_toConsumableArray(remainingNodes)).map(x => `"${ x }"`).join(', '));
    }
    return nodeList;
}