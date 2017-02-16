const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

import HttpClient from "../../src/http/HttpClient";
import Crypto from "../../src/security/Crypto";
import MemoryCryptoEngine from "../../src/security/MemoryCryptoEngine";

describe('Unauthenticated', () => {
    it('should generate a memberId', async () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        const res = await unauthenticatedClient.createMemberId();
        assert.isOk(res.data.memberId);
    });
    it('should add a key', async () => {
        const unauthenticatedClient = new HttpClient(TEST_ENV);
        const res = await unauthenticatedClient.createMemberId();
        assert.isOk(res.data.memberId);
        const engine = new MemoryCryptoEngine(res.data.memberId);
        const pk1 = engine.generateKey('PRIVILEGED');
        const res2 = await unauthenticatedClient.approveFirstKey(
            res.data.memberId,
            pk1,
            engine);

        assert.isOk(res2.data.member);
        assert.isOk(res2.data.member.lastHash);
        assert.equal(res2.data.member.keys.length, 1);
    });
});
