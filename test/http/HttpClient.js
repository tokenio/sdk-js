const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

import HttpClient from "../../src/http/HttpClient";
import Crypto from "../../src/security/Crypto";

describe('Unauthenticated', () => {
    it('should generate a memberId', async () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        const res = await unauthenticatedClient.createMemberId();
        assert.isOk(res.data.memberId);
    });
    it('should add a key', async () => {
        const keys = Crypto.generateKeys();
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        const res = await unauthenticatedClient.createMemberId();
        assert.isOk(res.data.memberId);
        const res2 = await unauthenticatedClient.approveFirstKey(res.data.memberId, keys)
        assert.isOk(res2.data.member);
        assert.isOk(res2.data.member.lastHash);
        assert.equal(res2.data.member.keys.length, 1);
    });
});
