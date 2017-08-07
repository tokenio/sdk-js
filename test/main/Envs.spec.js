const chai = require('chai');
import 'babel-regenerator-runtime';

const assert = chai.assert;
const TokenIo = require('../../src');

describe('Should handle environment', () => {
    it('should create a Token SDK object from a correct env', async () => {
        const Token = new TokenIo(TEST_ENV);
        await Token.usernameExists(Token.Util.generateNonce());
    });

    it('should fail nicely when the env string is wrong', async () => {
        try {
            const Token = new TokenIo('bad_env_string');
            await Token.usernameExists();
        } catch (error) {
            assert.include(error.message, 'Invalid environment string');
        }
    });
});
