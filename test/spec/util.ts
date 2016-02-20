/// <reference path="../../typings/main.d.ts" />
import { expect } from 'chai';
import * as util from '../../lib/util';


describe("Common functions", () => {

  it("yes() should return true", () => {
    expect(util.yes()).to.equal(true);
  });

  it("noop() should return void", () => {
    expect(util.noop()).to.equal(void 0);
  });

});
