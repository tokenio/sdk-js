const chai = require("chai");
const token = require("../src/index.js");
const assert = chai.assert;

describe("Member creation", () => {
  it("should create a member from scratch", () => {
    assert.equal(1+1, 2);
    return token.createMember()
    .then((member) => {
      assert.isOk(member);
      assert.isString(member.memberId);
      assert.isAbove(member.memberId.length, 1);
    })
    assert.isOk(promise);
    return promise;
  })
});
