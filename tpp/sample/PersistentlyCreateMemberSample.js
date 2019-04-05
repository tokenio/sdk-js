import {TokenClient} from '../src';

/**
 * Imports and sets up the SDK, and creates a Token member with the MemoryCryptoEngine
 * (which will store keys in memory).
 * @return {Member} created member
 */
export default async () => {
    // Initialize SDK:
    const Token = new TokenClient({
        env: 'sandbox',
        keyDir: './keys',
    });

    // Generate a random-nonsense-string alias.
    // ('name@token.io' would be more typical than a random string.
    // But if we run this code with the same alias twice,
    // the 2nd time it will fail because the name is taken.)
    const alias = {
        type: 'EMAIL',
        value: 'alias-' + Token.Util.generateNonce() + '+noverify@example.com',
    };

    // Create a member with keys stored in memory:
    const member = await Token.createMember(
        alias,
        Token.UnsecuredFileCryptoEngine);

    // let user recover member by verifying email if they lose keys
    await member.useDefaultRecoveryRule();
    return member;
};
