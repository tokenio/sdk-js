const chai = require('chai');
const assert = chai.assert;

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/Crypto";
import KeyLevel from "../../src/main/KeyLevel";
import Status from "../../src/main/TokenOperationStatus";
import BankClient from "../sample/BankClient";
import {defaultCurrency} from "../../src/constants";
const some = require('lodash/some');
const map = require('lodash/map');

let member1 = {};
let username1 = '';
let account1 = {};

let username2 = '';
let member2 = {};

// Set up a first member
const setUp1 = () => {
    username1 = Crypto.generateKeys().keyId;
    return Token
        .createMember(username1)
        .then(res => {
            member1 = res;
            return BankClient
                .requestLinkAccounts(username1, 100000, 'EUR')
                .then(alp => {
                    return member1
                        .linkAccounts('bank-id', alp)
                        .then(accs => {
                            account1 = accs[0];
                        });
                });
        });
};

// Set up a second member
const setUp2 = () => {
    username2 = Crypto.generateKeys().keyId;
    return Token
        .createMember(username2)
        .then(member => {
            member2 = member;
        });
};

describe('Tokens', () => {
    before(() => {
        return Promise.all([setUp1(), setUp2()]);
    });

    it('should confirm username does not exist', () => {
      return Token
          .usernameExists(Crypto.generateKeys().keyId)
          .then(exists => assert.equal(exists, false));
    });

    it('should confirm username exists', () => {
      const username = Crypto.generateKeys().keyId;
      member1
          .addUsername(username)
          .then(() => Token
              .usernameExists(username))
              .then(exists => assert.equal(exists, true));
    });

    it('should create a token, look it up, and endorse it', () => {
        return member1
            .createToken(account1.id, 9.24, defaultCurrency, username2)
            .then(token => {
                assert.isAtLeast(token.id.length, 5);
                assert.equal(token.version, '1.0');
                assert.equal(token.issuer.id, 'iron-bank');
                assert.equal(token.from.id, member1.id);
                assert.equal(token.description, undefined);
                assert.equal(token.redeemer.username, username2);
                assert.equal(token.amount, 9.24);
                assert.equal(token.currency, defaultCurrency);
                return member1
                    .getToken(token.id)
                    .then(tokenLookedUp => {
                        assert.equal(token.id, tokenLookedUp.id);
                        return member1
                            .endorseToken(token)
                            .then(res => {
                                assert.equal(token.payloadSignatures.length, 2);
                                assert.equal(res.token.payloadSignatures.length, 2);
                                assert.equal(res.status, Status.SUCCESS)
                            });
                    });
            });
    });

    it('should create a token and endorse it by id', () => {
        return member1
            .createToken(account1.id, 9.24, defaultCurrency, username2)
            .then(token => {
                return member1
                    .endorseToken(token.id)
                    .then(res => {
                        assert.equal(res.status, Status.SUCCESS)
                        return member1
                            .getToken(token.id)
                            .then(lookedUp => {
                                assert.equal(lookedUp.payloadSignatures.length, 2);
                                assert.equal(lookedUp.payloadSignatures[0].action, 'ENDORSED');
                            });
                    });
            });
    });

    it('should create a token and cancel it', () => {
        return member1
            .createToken(account1.id, 9.24, defaultCurrency, username2)
            .then(token => {
                return member1
                    .cancelToken(token)
                    .then(res => {
                        assert.equal(token.payloadSignatures.length, 2);
                        assert.equal(token.payloadSignatures[0].action, 'CANCELLED');
                        assert.equal(res.status, Status.SUCCESS)
                    });
            });
    });

    it('should create token and cancel it by id', () => {
        return member1
            .createToken(account1.id, 9.24, defaultCurrency, username2)
            .then(token => {
                return member1
                    .cancelToken(token.id)
                    .then(res => {
                        assert.equal(res.status, Status.SUCCESS)
                        return member1
                            .getToken(token.id)
                            .then(lookedUp => {
                                assert.equal(lookedUp.payloadSignatures.length, 2);
                                const actions = map(lookedUp.payloadSignatures, sig => sig.action);
                                assert.isOk(some(actions, action => action === 'CANCELLED'));
                            });
                    });
            });
    });

    it('should create token, and look it up', () => {
        return member1
            .createToken(account1.id, 9.24, defaultCurrency, username2)
            .then(token => {
                return member1
                    .endorseToken(token.id)
                    .then(() => {
                        return member1
                            .getTransferTokens(null, 100)
                            .then(pagedResult => {
                                assert.isAtLeast(pagedResult.data.length, 1);
                                assert.isString(pagedResult.offset);
                            });
                    });
            })
            .catch({});
    });

    it('should create token, and look it up, second member', () => {
        return member1
            .createToken(account1.id, 9.24, defaultCurrency, username2)
            .then(token => {
                return member1
                    .endorseToken(token.id)
                    .then(() => {
                        return member2
                            .getTransferTokens(null, 100)
                            .then(pagedResult => {
                                assert.equal(pagedResult.data.length, 0);
                            });
                    });
            });
    });

    it('should create token, and look it up, second member, tokenId', () => {
        return member1
            .createToken(account1.id, 9.24, defaultCurrency, username2)
            .then(token => {
                return member1
                    .endorseToken(token.id)
                    .then(() => {
                        return member2
                            .getToken(token.id)
                            .then(t => {
                                assert.equal(t.id, token.id);
                            });
                    });
            });
    });

    it('should fail to endorse a high value token with a low value key', () => {
        const keys = Crypto.generateKeys();

        return member1.subscribeToNotifications("0F7BF07748A12DE0C2393FD3731BFEB1484693DFA47A5C9614428BDF724548CD")
            .then(() => member1
                .approveKey(Crypto.strKey(keys.publicKey), KeyLevel.STANDARD)
                .then(() => {
                    return Token
                        .loginWithUsername(keys, username1)
                        .then(memberNew => {
                            return memberNew
                                .createToken(account1.id, 900.24, defaultCurrency, username2)
                                .then(
                                    token => {
                                        return memberNew
                                            .endorseToken(token.id)
                                            .then(res => {
                                                assert.equal(res.status, Status.MORE_SIGNATURES_NEEDED);
                                            });
                                    });
                        });
                }))
    });
});
