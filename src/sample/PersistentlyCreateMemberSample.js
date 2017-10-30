/**
 * Imports and sets up the SDK, and creates a Token member with the MemoryCryptoEngine
 * (which will store keys in memory).
 * @param {string} developerKey - developer key
 * @return {Member} member - created member
 */
export default async (developerKey) => {
    // Initialize SDK:
    const TokenLib = require('../../src');
    const Token = new TokenLib(
        // sandbox test environment:
        'sandbox',
        developerKey,
        // persist member secret keys in dir:
        './keys');

    // Generate a random-nonsense-string alias.
    // ("name@token.io" would be more typical than a random string.
    // But if we run this code with the same alias twice,
    // the 2nd time it will fail because the name is taken.)
    const alias = {
        type: 'EMAIL',
        value: "alias-" + Token.Util.generateNonce() + "+noverify@example.com"
    };

    // Create a member with keys stored in memory:
    return await Token.createMember(
        alias,
        Token.UnsecuredFileCryptoEngine);
};
