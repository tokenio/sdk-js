const chai = require('chai');
const assert = chai.assert;

import UnauthenticatedClient from "../../src/http/UnauthenticatedClient";
import Crypto from "../../src/Crypto";

describe('Unauthenticated', () => {
    it('should generate a memberId', () => {
        return UnauthenticatedClient
            .createMemberId()
            .then(res => {
                assert.isOk(res.data.memberId);
            });
    });
    it('should add a key', () => {
        const keys = Crypto.generateKeys();
        return UnauthenticatedClient.createMemberId()
            .then(res => {
                assert.isOk(res.data.memberId);
                return UnauthenticatedClient.addFirstKey(keys, res.data.memberId)
                    .then(res2 => {
                        assert.isOk(res2.data.member);
                        assert.isOk(res2.data.member.lastHash);
                        assert.equal(res2.data.member.keys.length, 1);
                        return true;
                    });
            });
    });
});
