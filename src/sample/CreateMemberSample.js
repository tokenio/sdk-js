/**
 * Imports and sets up the SDK, and creates a Token member with the MemoryCryptoEngine
 * (which will store keys in memory).
 *
 * @return {Member} member - created member
 */
export default async () => {
    // Initialize SDK:
    // 'sandbox' is a good value for TEST_ENV here.
    const TokenLib = require('../../src');
    const Token = new TokenLib(TEST_ENV);

    // Generate a random-nonsense-string alias.
    // ("name@token.io" would be more typical than a random string.
    // But if we run this code with the same alias twice,
    // the 2nd time it will fail because the name is taken.)
    const alias = {
        type: 'USERNAME',
        value: Token.Util.generateNonce()
    };

    // Create a member with keys stored in memory:
    return await Token.createMember(
        alias,
        Token.MemoryCryptoEngine);
};
