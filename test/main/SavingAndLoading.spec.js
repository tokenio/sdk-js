const chai = require('chai');
const assert = chai.assert;

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/Crypto";

let member1 = {};
let username1 = '';

// Set up a first member
const setUp1 = () => {
    username1 = Crypto.generateKeys().keyId;

    return Token
        .createMember(username1)
        .then(res => {
            member1 = res;
            return true;
        });
};

describe('Saving and loading Members', () => {
    before(() => {
        return Promise.all([setUp1()]);
    });

    it('save and login from LocalStorage', () => {
        if (BROWSER) {
            member1.saveToLocalStorage();

            Token
                .loginFromLocalStorage()
                .then(member => {
                   return member.getPublicKeys();
                })
                .then(keys => {
                    assert.isAtLeast(keys.length, 1);
                });
        }
    });

    it('save and login keys', () => {
        const keys = member1.keys;
        const memberId = member1.id;

        Token
            .login(memberId, keys)
            .then(member2 => {
                return member2.getPublicKeys();
            })
            .then(keys => {
                assert.isAtLeast(keys.length, 1);
            });
    });
});
