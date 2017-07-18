/**
 * Imports and sets up the SDK, and creates a Token member with the MemoryCryptoEngine
 * (which will store keys in memory).
 *
 * @return {Member} member - created member
 */
export default async () => {
    // Initializes SDK
    const TokenLib = require('../../src');
    const Token = new TokenLib(TEST_ENV);

    // Generate a random-nonsense-string username.
    // ("john_doe" would be more typical than a random string.
    // But if we run this code with the same username twice,
    // the second time it will fail because the name's already taken.)
    const username = Token.Util.generateNonce();

    // Creates a member, with keys stored in memory
    return await Token.createMember(username, Token.MemoryCryptoEngine);
};
