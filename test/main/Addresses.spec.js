const chai = require('chai');
const assert = chai.assert;

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);
import Crypto from "../../src/Crypto";
import BankClient from "../sample/BankClient";

let member1 = {};
let username1 = '';
let account1 = {};

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
                        .then(accs => {account1 = accs[0];
                });
            });
        });
};

describe('Addresses', () => {
    beforeEach(() => {
        return setUp1();
    });

    it('Add and lookup an address', () => {
        const address = { city: 'San Francisco', country: 'US' };
        return member1
            .addAddress("Home", address)
            .then(() => {
                return member1
                    .getAddresses()
                    .then(res => {
                        assert.equal(res.length, 1);
                        assert.equal(res[0].name, "Home");
                        assert.deepEqual(res[0].address, address);
                        assert.isOk(res[0].addressSignature);
                        assert.isOk(res[0].id);
                    });
        });
    });
});
