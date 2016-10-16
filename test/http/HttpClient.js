const chai = require('chai');
const assert = chai.assert;

import HttpClient from "../../src/http/HttpClient";
import Crypto from "../../src/Crypto";

describe('Unauthenticated', () => {
    it('should generate a memberId', () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        return unauthenticatedClient
            .createMemberId()
            .then(res => {
                assert.isOk(res.data.memberId);
            });
    });
    it('should add a key', () => {
        const keys = Crypto.generateKeys();
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        return unauthenticatedClient.createMemberId()
            .then(res => {
                assert.isOk(res.data.memberId);
                return unauthenticatedClient.addFirstKey(keys, res.data.memberId)
                    .then(res2 => {
                        assert.isOk(res2.data.member);
                        assert.isOk(res2.data.member.lastHash);
                        assert.equal(res2.data.member.keys.length, 1);
                        return true;
                    });
            });
    });
});
