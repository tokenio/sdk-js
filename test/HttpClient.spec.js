const chai = require("chai");
const assert = chai.assert;

import Member from "../src/Member";
import HttpClient from "../src/HttpClient";
import { generateKeys, sign } from '../src/Crypto';

describe("MemberId", () => {
  it("should generate a memberId", () => {
    const keys = generateKeys();
    return HttpClient.createMemberId()
    .then((res) => {
      assert.isOk(res.data.memberId);
    });
  });

  it("should add a key", () => {
    const keys = generateKeys();
    return HttpClient.createMemberId()
    .then((res) => {
      assert.isOk(res.data.memberId);
      return HttpClient.addFirstKey(keys, res.data.memberId)
      .then((res) => {
        assertIsOk(res);
      }).catch((err) => {
        console.log("Error", err);
      });
    });
  });
});
