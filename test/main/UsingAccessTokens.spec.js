import AccessToken from "../../src/main/AccessToken";
import Sample from "../sample/Sample";

const chai = require('chai');
const assert = chai.assert;

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

let grantorUsername = '';
let granteeUsername = '';
let grantor = {};
let grantee = {};
let address = {};

const setUpGrantor = () => {
    grantorUsername = Sample.string();
    return Token
        .createMember(grantorUsername)
        .then(member => {
            grantor = member;
            return grantor
                .addAddress("name", { city: 'San Francisco', country: 'US' })
                .then(res => {
                    address = res;
                });
        });
};

const setupGrantee = () => {
    granteeUsername = Sample.string();
    return Token
        .createMember(granteeUsername)
        .then(member => {
            grantee = member;
        });
};

const setupToken = () => {
    return grantor.createAccessToken(AccessToken.grantTo(granteeUsername).forAddress(address.id))
        .then(token => grantor
            .endorseToken(token)
            .then(res => token))

};

describe('Using access tokens', () => {
    beforeEach(() => {
        return setUpGrantor()
            .then(res => setupGrantee());
    });

    it('On-Behalf-Of address token', () => {
        return setupToken()
            .then(token => {
                grantee.useAccessToken(token.id);
                return grantee
                    .getAddress(address.id)
                    .then(result => {
                        assert.equal(result.id, address.id);
                        assert.equal(result.name, address.name);
                        assert.deepEqual(result.address, address.address);
                    });
            });
    });

    it('address access token should not work if cleared token', done => {
        setupToken()
            .then(token => {
                grantee.useAccessToken(token.id);
                grantee.clearAccessToken();
                return grantee
                    .getAddress(address.id)
                    .then(() => {
                        done(new Error("Should not succeed"))
                    })
                    .catch(err => done());
            });
    });

    it('replaced address token should work', () => {
        return setupToken()
            .then(token => {
                grantee.useAccessToken(token.id);
                grantee
                    .getAddress(address.id)
                    .then(result => {
                      assert.equal(result.id, address.id);
                      assert.equal(result.name, address.name);
                      assert.deepEqual(result.address, address.address);
                    })
                    .then(() => grantee.clearAccessToken());
                return token;
            })
            .then(token => {
              return grantor
                  .replaceAndEndorseAccessToken(
                      token,
                      AccessToken.createFromAccessToken(token).forAll())
                  .then(operationResult => {
                    assert.equal(operationResult.status, 'SUCCESS');
                    return operationResult.token;
                  });
            })
            .then(token => {
                grantee.useAccessToken(token.id);
                return grantee
                    .getAddress(address.id)
                    .then(result => {
                      assert.equal(result.id, address.id);
                      assert.equal(result.name, address.name);
                      assert.deepEqual(result.address, address.address);
                    })
                    .then(() => grantee.clearAccessToken());
            })
    });

    it('replaced address should work after endorsing', () => {
      return setupToken()
          .then(token => {
            grantee.useAccessToken(token.id);
            grantee
                .getAddress(address.id)
                .then(result => {
                  assert.equal(result.id, address.id);
                  assert.equal(result.name, address.name);
                  assert.deepEqual(result.address, address.address);
                })
                .then(() => grantee.clearAccessToken());
            return token;
          })
          .then(token => {
            return grantor
                .replaceAccessToken(
                    token,
                    AccessToken.createFromAccessToken(token).forAll())
                .then(operationResult => {
                  assert.equal(operationResult.status, 'MORE_SIGNATURES_NEEDED');
                  return operationResult.token;
                });
          })
          .then(token =>
              grantor
                  .endorseToken(token)
                  .then(res => token))
          .then(token => {
            grantee.useAccessToken(token.id);
            return grantee
                .getAddress(address.id)
                .then(result => {
                  assert.equal(result.id, address.id);
                  assert.equal(result.name, address.name);
                  assert.deepEqual(result.address, address.address);
                })
                .then(() => grantee.clearAccessToken());
          })
    });
});
