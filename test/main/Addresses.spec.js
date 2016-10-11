const chai = require('chai');
const assert = chai.assert;

const Token = require('../../src');
import Crypto from "../../src/Crypto";
import BankClient from "../sample/BankClient";

let member1 = {};
let alias1 = '';
let account1 = {};

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
                        .then(accs => {account1 = accs[0];
                });
            });
        });
};

describe('Tokens', () => {
    beforeEach(() => {
        return setUp1();
    });

    it('Add and lookup an address', () => {
        return member1
            .addAddress("Home", "125 Broadway rd")
            .then(() => {
                return member1
                    .getAddresses()
                    .then(res => {
                        assert.equal(res.length, 1);
                        assert.equal(res[0].name, "Home");
                        assert.equal(res[0].data, "125 Broadway rd");
                        assert.isOk(res[0].dataSignature);
                        assert.isOk(res[0].id);
                    });
        });
    });
});
