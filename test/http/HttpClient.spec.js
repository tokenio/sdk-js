const chai = require('chai');
const assert = chai.assert;

import Member from '../../src/main/Member';
import HttpClient from '../../src/http/HttpClient';
import AuthHttpClient from '../../src/http/AuthHttpClient';
import Crypto from '../../src/Crypto';

describe('MemberId', () => {
  it('should generate a memberId', () => {
    const keys = Crypto.generateKeys();
    return HttpClient.createMemberId()
    .then((res) => {
      assert.isOk(res.data.memberId);
    });
  });
  it('should add a key', () => {
    const keys = Crypto.generateKeys();
    return HttpClient.createMemberId()
    .then((res) => {
      assert.isOk(res.data.memberId);
      return HttpClient.addFirstKey(keys, res.data.memberId)
      .then((member) => {
        assert.isOk(member);
        assert.isOk(member.lastHash);
        assert.equal(member.keys.length, 1);
        return true;
      });
    });
  });
});
