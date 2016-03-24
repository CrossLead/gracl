/// <reference path='../../typings/main.d.ts' />
import { expect } from 'chai';
import { Hash } from '../../lib/interfaces';
import * as util from '../../lib/util';


describe('utility functions', () => {

  it('yes() should return true', () => {
    expect(util.yes()).to.equal(true);
  });

  it('noop() should return void', () => {
    expect(util.noop()).to.equal(void 0);
  });

  it('baseCompare() should correctly order items', () => {
    expect(util.baseCompare('x', 'y'), 'a < b  -> -1').to.equal(-1);
    expect(util.baseCompare('y', 'x'), 'a > b  -> 1').to.equal(1);
    expect(util.baseCompare('x', 'x'), 'a == b -> 0').to.equal(0);
  });

  it('binaryIndexOf() should correctly find indexes on sorted arrays', () => {
    const A = [ 'a', 'b', 'c', 'd' ],
          B = [ 't', 'u', 'v', 'w', 'x', 'y', 'z' ];

    expect(util.binaryIndexOf(A, 'c'), 'Correctly finds c in the array').to.equal(2);
    expect(util.binaryIndexOf(B, 'y'), 'Correctly finds y in the array').to.equal(5);
    expect(util.binaryIndexOf(B, 'q'), 'Returns -1 on not finding value').to.equal(-1);
  });

  it('topologicalSort should correctly sort nodes', () => {
    const nodes = <Hash<string>[]> [
      { name: 'B', parent: 'A' },
      { name: 'A', parent: 'C' },
      { name: 'C' }
    ];

    expect(util.topologicalSort(nodes))
      .to.deep.equal([
        { name: 'C' },
        { name: 'A', parent: 'C' },
        { name: 'B', parent: 'A' }
      ]);
  });

  it('topologicalSort should detect circular dependencies', () => {
    const nodes = <Hash<string>[]> [
      { name: 'A', parent: 'B' },
      { name: 'B', parent: 'A' }
    ];

    expect(() => util.topologicalSort(nodes))
      .to.throw(/Schema has a circular dependency or a missing parent/);
  });


});
