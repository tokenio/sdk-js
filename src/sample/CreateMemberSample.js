/**
 * Imports and sets up the SDK, and creates a Token member with the MemoryCryptoEngine
 * (which will store keys in memory).
 *
 * @returns {Member} member - created member
 */
export default async () => {
    // Initializes SDK
    const TokenLib = require('../../src');
    const Token = new TokenLib(TEST_ENV);

    // Creates a member, with keys stored in memory
    const username = Token.Util.generateNonce();
    return await Token.createMember(username, Token.MemoryCryptoEngine);
}
