const chai = require('chai');
const assert = chai.assert;

import HttpClient from '../../src/http/HttpClient';
import Crypto from '../../src/Crypto';

describe('Unauthenticated', () => {
  it('should generate a memberId', () => {
    return HttpClient.createMemberId()
    .then(res => {
      assert.isOk(res.data.memberId);
    });
  });
  it('should add a key', () => {
    const keys = Crypto.generateKeys();
    return HttpClient.createMemberId()
    .then(res => {
      assert.isOk(res.data.memberId);
      return HttpClient.addFirstKey(keys, res.data.memberId)
      .then(res2 => {
        assert.isOk(res2.data.member);
        assert.isOk(res2.data.member.lastHash);
        assert.equal(res2.data.member.keys.length, 1);
        return true;
      });
    });
  });
});
