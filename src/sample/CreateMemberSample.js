import {TokenIO} from '..';

/**
 * Imports and sets up the SDK, and creates a Token member with the MemoryCryptoEngine
 * (which will store keys in memory).
 *
 * @return {Member} member - created member
 */
export default async () => {
    // Initialize SDK:
    // 'sandbox' is a good value for TEST_ENV here.
    const devKey = require('../../src/config.json').devKey[TEST_ENV];
    const Token = new TokenIO({env: TEST_ENV, developerKey: devKey});

    // Generate a random-nonsense-string alias.
    // ('name@token.io' would be more typical than a random address.
    // But if we run this code with the same alias twice,
    // the 2nd time it will fail because the name is taken.)
    //
    // In test environments, we can use this email as an alias
    // without verifying it; but in production, we couldn't.
    const alias = {
        type: 'EMAIL',
        value: 'alias-' + Token.Util.generateNonce() + '+noverify@token.io',
    };

    // Create a member with keys stored in memory:
    return await Token.createMember(
        alias,
        Token.MemoryCryptoEngine);
};
