const chai = require('chai');
const assert = chai.assert;
import UnsecuredFileCryptoEngine from "../../src/security/UnsecuredFileCryptoEngine";
const TokenIo = require('../../src');
const Token = new TokenIo(TEST_ENV);

if (!BROWSER) {
    describe('Unsecured File crypto engine', () => {
        it('should create the unsecured file crypto engine', () => {
            const memberId = '123';
            const engine = new UnsecuredFileCryptoEngine(memberId);
            assert.isOk(engine);
        });
    });
}
