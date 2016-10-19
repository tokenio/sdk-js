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
        .then(res => {
            grantor = res;
            grantor
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
        .then(res => {
            grantee = res;
        });
};

const setupToken = () => {
    return grantor.createAddressAccessToken(granteeUsername, address.id)
        .then(token => grantor
            .endorseToken(token)
            .then(res => token))

};

describe('On-Behalf-Of', () => {
    beforeEach(() => {
        return setUpGrantor().then(res =>
            setupGrantee());
    });

    it('address access token flow', () => {
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
});
