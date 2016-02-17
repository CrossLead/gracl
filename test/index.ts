/// <reference path="../typings/main.d.ts" />
import { expect } from 'chai';

async function tester() {
  return true;
}

describe("gracl.ts", () => {
  it("should expect true to be true", () => {
    return tester()
      .then(val => {
        expect(val).to.equal(true);
      });
  });
});
