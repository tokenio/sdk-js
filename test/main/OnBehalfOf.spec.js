import Sample from "../sample/Sample";

const chai = require('chai');
const assert = chai.assert;

const Token = require('../../src');

let grantorAlias = '';
let granteeAlias = '';
let grantor = {};
let grantee = {};
let address = {};

const setUpGrantor = () => {
    grantorAlias = Sample.string();
    return Token
        .createMember(grantorAlias)
        .then(res => {
            grantor = res;
            grantor
                .addAddress("name","address")
                .then(res => {
                    address = res
                });
        });

};

const setupGrantee = () => {
    granteeAlias = Sample.string();
    return Token
        .createMember(granteeAlias)
        .then(res => {
            grantee = res;
        });
};

describe('On-Behalf-Of', () => {
    before( () => {
        return setUpGrantor().then(res =>
            setupGrantee());
    });

    it('address access token flow', () => {
        return grantor
            .createAddressAccessToken(granteeAlias, address.id)
            .then(token => {
                grantee.useAccessToken(token.id);
                return grantee
                    .getAddress(address.id)
                    .then(result => {
                        assert.equal(result.id, address.id);
                        assert.equal(result.name, address.name);
                        assert.equal(result.data, address.data);
                    });
            });
    });
});
