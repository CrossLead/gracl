'use strict';

var _chai = require('chai');

var _util = require('../../lib/util');

var util = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

describe('utility functions', () => {
    it('yes() should return true', () => {
        (0, _chai.expect)(util.yes()).to.equal(true);
    });
    it('noop() should return void', () => {
        (0, _chai.expect)(util.noop()).to.equal(void 0);
    });
    it('baseCompare() should correctly order items', () => {
        (0, _chai.expect)(util.baseCompare('x', 'y'), 'a < b  -> -1').to.equal(-1);
        (0, _chai.expect)(util.baseCompare('y', 'x'), 'a > b  -> 1').to.equal(1);
        (0, _chai.expect)(util.baseCompare('x', 'x'), 'a == b -> 0').to.equal(0);
    });
    it('binaryIndexOf() should correctly find indexes on sorted arrays', () => {
        const A = ['a', 'b', 'c', 'd'],
              B = ['t', 'u', 'v', 'w', 'x', 'y', 'z'];
        (0, _chai.expect)(util.binaryIndexOf(A, 'c'), 'Correctly finds c in the array').to.equal(2);
        (0, _chai.expect)(util.binaryIndexOf(B, 'y'), 'Correctly finds y in the array').to.equal(5);
        (0, _chai.expect)(util.binaryIndexOf(B, 'q'), 'Returns -1 on not finding value').to.equal(-1);
    });
});