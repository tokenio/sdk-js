import {TokenClient} from '../src';

/**
 * Imports and sets up the SDK, and creates a business Token member with the MemoryCryptoEngine
 * (which will store keys in memory).
 *
 * @return {Member} created member
 */
export default async () => {
    // Initialize SDK:
    // 'sandbox' is a good value for TEST_ENV here.
    const devKey = require('../src/config.json').devKey[TEST_ENV];
    const Token = new TokenClient({env: TEST_ENV, developerKey: devKey});

    // Generate a random-nonsense-string alias.
    // ('name.com' would be more typical than a random domain.
    // But if we run this code with the same alias twice,
    // the 2nd time it will fail because the name is taken.)
    //
    // In test environments, we can use this domain as an alias
    // without verifying it; but in production, we can't.
    const alias = {
        type: 'DOMAIN',
        value: `${Token.Util.generateNonce()}.com.noverify`,
    };

    // Create a member with keys stored in memory:
    return await Token.createMember(
        alias,
        Token.MemoryCryptoEngine);
};
