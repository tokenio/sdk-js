const chai = require('chai');
const assert = chai.assert;

const Token = require('../../src');
import Crypto from "../../src/Crypto";
import KeyLevel from "../../src/main/KeyLevel";
import BankClient from "../sample/BankClient";
import {defaultCurrency} from "../../src/constants";
const some = require('lodash/some');
const map = require('lodash/map');

let member1 = {};
let alias1 = '';
let account1 = {};

let alias2 = '';
let member2 = {};

// Set up a first member
const setUp1 = () => {
    alias1 = Crypto.generateKeys().keyId;
    return Token
        .createMember(alias1)
        .then(res => {
            member1 = res;
            return BankClient
                .requestLinkAccounts(alias1, 100000, 'EUR')
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
    alias2 = Crypto.generateKeys().keyId;
    return Token
        .createMember(alias2)
        .then(member => {
            member2 = member;
        });
};

describe('Tokens', () => {
    beforeEach(() => {
        return Promise.all([setUp1(), setUp2()]);
    });

    it('should confirm alias does not exist', () => {
      return Token
          .aliasExists(Crypto.generateKeys().keyId)
          .then(exists => assert.equal(exists, false));
    });

    it('should confirm alias exists', () => {
      const alias = Crypto.generateKeys().keyId;
      member1
          .addAlias(alias)
          .then(() => Token
              .aliasExists(alias))
              .then(exists => assert.equal(exists, true));
    });

    it('should create a token, look it up, and endorse it', () => {
        return member1
            .createPaymentToken(account1.id, 9.24, defaultCurrency, alias2)
            .then(token => {
                assert.equal(token.issuer.id, 'iron-bank');
                assert.isAtLeast(token.id.length, 5);
                assert.equal(token.payer.id, member1.id);
                assert.equal(token.redeemer.alias, alias2);
                assert.equal(token.amount, 9.24);
                assert.equal(token.currency, defaultCurrency);
                assert.equal(token.description, undefined);
                assert.equal(token.version, '1.0');
                return member1
                    .getPaymentToken(token.id)
                    .then(tokenLookedUp => {
                        assert.equal(token.id, tokenLookedUp.id);
                        return member1
                            .endorsePaymentToken(token)
                            .then(() => {
                                assert.equal(token.payloadSignatures.length, 2);
                            });
                    });
            });
    });

    it('should create a token and endorse it by id', () => {
        return member1
            .createPaymentToken(account1.id, 9.24, defaultCurrency, alias2)
            .then(token => {
                return member1
                    .endorsePaymentToken(token.id)
                    .then(() => {
                        return member1
                            .getPaymentToken(token.id)
                            .then(lookedUp => {
                                assert.equal(lookedUp.payloadSignatures.length, 2);
                                assert.equal(lookedUp.payloadSignatures[0].action, 'ENDORSED');
                            });
                    });
            });
    });

    it('should create a token and cancel it', () => {
        return member1
            .createPaymentToken(account1.id, 9.24, defaultCurrency, alias2)
            .then(token => {
                return member1
                    .cancelPaymentToken(token)
                    .then(() => {
                        assert.equal(token.payloadSignatures.length, 2);
                        assert.equal(token.payloadSignatures[0].action, 'CANCELLED');
                    });
            });
    });

    it('should create token and cancel it by id', () => {
        return member1
            .createPaymentToken(account1.id, 9.24, defaultCurrency, alias2)
            .then(token => {
                return member1
                    .cancelPaymentToken(token.id)
                    .then(() => {
                        return member1
                            .getPaymentToken(token.id)
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
            .createPaymentToken(account1.id, 9.24, defaultCurrency, alias2)
            .then(token => {
                return member1
                    .endorsePaymentToken(token.id)
                    .then(() => {
                        return member1
                            .getPaymentTokens()
                            .then(tokens => {
                                assert.equal(tokens.length, 1);
                                assert.equal(tokens[0].payloadSignatures.length, 2);
                            });
                    });
            })
            .catch({});
    });

    it('should create token, and look it up, second member', () => {
        return member1
            .createPaymentToken(account1.id, 9.24, defaultCurrency, alias2)
            .then(token => {
                return member1
                    .endorsePaymentToken(token.id)
                    .then(() => {
                        return member2
                            .getPaymentTokens()
                            .then(tokens => {
                                assert.equal(tokens.length, 0);
                            });
                    });
            });
    });

    it('should create token, and look it up, second member, tokenId', () => {
        return member1
            .createPaymentToken(account1.id, 9.24, defaultCurrency, alias2)
            .then(token => {
                return member1
                    .endorsePaymentToken(token.id)
                    .then(() => {
                        return member2
                            .getPaymentToken(token.id)
                            .then(t => {
                                assert.equal(t.id, token.id);
                            });
                    });
            });
    });

    it('should fail to endorse a high value token with a low value key', done => {
        const keys = Crypto.generateKeys();

        member1.subscribeToNotifications('36f21423d991dfe63fc2e4b4177409d29141fd4bcbdb5bff202a105355' +
            '81f97900').then(() =>
            member1
                .approveKey(Crypto.strKey(keys.publicKey), KeyLevel.STANDARD)
                .then(() => {
                    return Token
                        .loginWithAlias(keys, alias1)
                        .then(memberNew => {
                            return memberNew
                                .createPaymentToken(account1.id, 900.24, defaultCurrency, alias2)
                                .then(
                                    token => {
                                        return memberNew
                                            .endorsePaymentToken(token.id)
                                            .then(() => {
                                                done(new Error("should fail"));
                                            })
                                            .catch(() => done());
                                    });
                        });
                }));
    });
});
