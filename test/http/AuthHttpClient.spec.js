const chai = require('chai');
const assert = chai.assert;

import Member from '../../src/main/Member';
import HttpClient from '../../src/http/HttpClient';
import AuthHttpClient from '../../src/http/AuthHttpClient';
import Crypto from '../../src/Crypto';

describe('AuthHttpClient', () => {
  it('should add a second key', () => {
    const keys = Crypto.generateKeys();
    const keys2 = Crypto.generateKeys();
    return HttpClient.createMemberId()
    .then((res) => {
      assert.isOk(res.data.memberId);
      return HttpClient.addFirstKey(keys, res.data.memberId)
      .then((member) => AuthHttpClient.addKey(keys, res.data.memberId,
        member.lastHash, keys2.publicKey)
        .then((member2) => {
          assert.isOk(member2);
          assert.isOk(member2.lastHash);
          assert.equal(member2.keys.length, 2);
        })
      );
    });
  });

  it('should remove a key', () => {
    const keys = Crypto.generateKeys();
    const keys2 = Crypto.generateKeys();
    return HttpClient.createMemberId()
    .then((res) => {
      assert.isOk(res.data.memberId);
      return HttpClient.addFirstKey(keys, res.data.memberId)
      .then((member) => AuthHttpClient.addKey(keys, res.data.memberId,
        member.lastHash, keys2.publicKey)
        .then((member2) => {
          assert.equal(member2.keys.length, 2);
          return AuthHttpClient.removeKey(keys, res.data.memberId,
            member2.lastHash, keys2.keyId);
        })
      );
    });
  });

  it('should add aliases', () => {
    const keys = Crypto.generateKeys();
    const keys2 = Crypto.generateKeys();
    return HttpClient.createMemberId()
    .then((res) => {
      assert.isOk(res.data.memberId);
      return HttpClient.addFirstKey(keys, res.data.memberId)
      .then((member) => AuthHttpClient.addAlias(keys, res.data.memberId,
        member.lastHash, Crypto.generateKeys().keyId)
        .then((member2) => {
          assert.equal(member2.aliases.length, 1);
          return AuthHttpClient.addAlias(keys, res.data.memberId,
                  member2.lastHash, Crypto.generateKeys().keyId)
                  .then((member2) => {
                    assert.equal(member2.aliases.length, 2);
                  });
        })
      );
    });
  });

  it('should remove aliases', () => {
    const keys = Crypto.generateKeys();
    const keys2 = Crypto.generateKeys();
    return HttpClient.createMemberId()
    .then((res) => {
      assert.isOk(res.data.memberId);
      return HttpClient.addFirstKey(keys, res.data.memberId)
      .then((member) => AuthHttpClient.addAlias(keys, res.data.memberId,
        member.lastHash, Crypto.generateKeys().keyId)
        .then((member2) => {
          assert.equal(member2.aliases.length, 1);
          const secondAlias = Crypto.generateKeys().keyId;
          return AuthHttpClient.addAlias(keys, res.data.memberId,
                  member2.lastHash, secondAlias)
                  .then((member2) => {
                    assert.equal(member2.aliases.length, 2);
                    return AuthHttpClient.removeAlias(keys, res.data.memberId,
                            member2.lastHash, secondAlias)
                            .then((member2) => {
                              assert.equal(member2.aliases.length, 1);
                            });

                  });
        })
      );
    });
  });

  it('should get a member', () => {
    const keys = Crypto.generateKeys();
    return HttpClient.createMemberId()
    .then((res) => {
      assert.isOk(res.data.memberId);
      return HttpClient.addFirstKey(keys, res.data.memberId)
      .then((member) => AuthHttpClient.getMember(keys, res.data.memberId)
        .then((member2) => {
          assert.isOk(member2);
          assert.isOk(member2.lastHash);
          assert.equal(member2.keys.length, 1);
        })
      );
    });
  });
});
