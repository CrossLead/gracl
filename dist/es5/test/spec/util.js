"use strict";

var chai_1 = require('chai');
var util = require('../../lib/util');
describe('utility functions', function () {
    it('yes() should return true', function () {
        chai_1.expect(util.yes()).to.equal(true);
    });
    it('noop() should return void', function () {
        chai_1.expect(util.noop()).to.equal(void 0);
    });
    it('baseCompare() should correctly order items', function () {
        chai_1.expect(util.baseCompare('x', 'y'), 'a < b  -> -1').to.equal(-1);
        chai_1.expect(util.baseCompare('y', 'x'), 'a > b  -> 1').to.equal(1);
        chai_1.expect(util.baseCompare('x', 'x'), 'a == b -> 0').to.equal(0);
    });
    it('binaryIndexOf() should correctly find indexes on sorted arrays', function () {
        var A = ['a', 'b', 'c', 'd'],
            B = ['t', 'u', 'v', 'w', 'x', 'y', 'z'];
        chai_1.expect(util.binaryIndexOf(A, 'c'), 'Correctly finds c in the array').to.equal(2);
        chai_1.expect(util.binaryIndexOf(B, 'y'), 'Correctly finds y in the array').to.equal(5);
        chai_1.expect(util.binaryIndexOf(B, 'q'), 'Returns -1 on not finding value').to.equal(-1);
    });
});