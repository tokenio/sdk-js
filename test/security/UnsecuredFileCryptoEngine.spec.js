const chai = require('chai');
const assert = chai.assert;
import UnsecuredFileCryptoEngine from "../../src/security/UnsecuredFileCryptoEngine";
const TokenIo = require('../../src');
const Token = new TokenIo(TEST_ENV);

describe('Unsecured File crypto engine', () => {
    it('should create the unsecured file crypto engine', () => {
        const memberId = Token.Util.generateNonce();
        UnsecuredFileCryptoEngine.setFilename('/Users/mariano54/Projects/Token/sdk-js/keys.json');
        const engine = new UnsecuredFileCryptoEngine(memberId);

        engine.generateKey('LOW');
        assert.isOk(engine);
    });
});
