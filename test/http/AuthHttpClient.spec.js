const chai = require('chai');
const assert = chai.assert;

import HttpClient from '../../src/http/HttpClient';
import AuthHttpClient from '../../src/http/AuthHttpClient';
import Crypto from '../../src/Crypto';

describe('AuthHttpClient', () => {
  it('should add a second key', () => {
    const keys = Crypto.generateKeys();
    const keys2 = Crypto.generateKeys();
    return HttpClient.createMemberId()
    .then(res => {
      assert.isOk(res.data.memberId);
      return HttpClient.addFirstKey(keys, res.data.memberId)
      .then(res2 => AuthHttpClient.addKey(keys, res.data.memberId,
        res2.data.member.lastHash, keys2.publicKey, 0, [])
        .then(res3 => {
          assert.isOk(res3.data.member);
          assert.isOk(res3.data.member.lastHash);
          assert.equal(res3.data.member.keys.length, 2);
        })
      );
    });
  });

  it('should remove a key', () => {
    const keys = Crypto.generateKeys();
    const keys2 = Crypto.generateKeys();
    return HttpClient.createMemberId()
    .then(res => {
      assert.isOk(res.data.memberId);
      return HttpClient.addFirstKey(keys, res.data.memberId)
      .then(res2 => AuthHttpClient.addKey(keys, res.data.memberId,
        res2.data.member.lastHash, keys2.publicKey, 0, [])
        .then(res3 => {
          assert.equal(res3.data.member.keys.length, 2);
          return AuthHttpClient.removeKey(keys, res.data.memberId,
            res3.data.member.lastHash, keys2.keyId);
        })
      );
    });
  });

  it('should add aliases', () => {
    const keys = Crypto.generateKeys();
    return HttpClient.createMemberId()
    .then(res => {
      assert.isOk(res.data.memberId);
      return HttpClient.addFirstKey(keys, res.data.memberId)
      .then(res2 => AuthHttpClient.addAlias(keys, res.data.memberId,
        res2.data.member.lastHash, Crypto.generateKeys().keyId)
        .then(res3 => {
          assert.equal(res3.data.member.aliases.length, 1);
          return AuthHttpClient.addAlias(keys, res.data.memberId,
                  res3.data.member.lastHash, Crypto.generateKeys().keyId)
                  .then(res4 => {
                    assert.equal(res4.data.member.aliases.length, 2);
                  });
        })
      );
    });
  });

  it('should remove aliases', () => {
    const keys = Crypto.generateKeys();
    return HttpClient.createMemberId()
    .then(res => {
      assert.isOk(res.data.memberId);
      return HttpClient.addFirstKey(keys, res.data.memberId)
      .then(res2 => AuthHttpClient.addAlias(keys, res.data.memberId,
        res2.data.member.lastHash, Crypto.generateKeys().keyId)
        .then(res3 => {
          assert.equal(res3.data.member.aliases.length, 1);
          const secondAlias = Crypto.generateKeys().keyId;
          return AuthHttpClient.addAlias(keys, res.data.memberId,
                  res3.data.member.lastHash, secondAlias)
                  .then(res4 => {
                    assert.equal(res4.data.member.aliases.length, 2);
                    return AuthHttpClient.removeAlias(keys, res.data.memberId,
                            res4.data.member.lastHash, secondAlias)
                            .then(res5 => {
                              assert.equal(res5.data.member.aliases.length, 1);
                            });
                  });
        })
      );
    });
  });

  it('should get a member', () => {
    const keys = Crypto.generateKeys();
    return HttpClient.createMemberId()
    .then(res => {
      assert.isOk(res.data.memberId);
      return HttpClient.addFirstKey(keys, res.data.memberId)
      .then(res2 => AuthHttpClient.getMember(keys, res.data.memberId)
        .then(res3 => {
          assert.isOk(res3.data.member);
          assert.isOk(res3.data.member.lastHash);
          assert.equal(res3.data.member.keys.length, 1);
        })
      );
    });
  });
});
