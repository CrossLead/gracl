/// <reference path="../../typings/main.d.ts" />
import { expect } from 'chai';
import common from '../../lib/common';


describe("Common functions", () => {

  it("yes() should return true", () => {
    expect(common.yes()).to.equal(true);
  });

  it("noop() should return void", () => {
    expect(common.noop()).to.equal(void 0);
  });

});
