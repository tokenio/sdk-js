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
    /////////////
    const tppAuthNumber = Token.Util.generateNonce();
    const certificate = '';
    const bankId = 'iron';
    const privateKey = '';

    //const signer = Token.Crypto.createSignerFromKeyPair(keyPair);


    // resolve memberId of the bank TPP is trying to get access to
    const bankMember = await Token.resolveAlias({
        type: 'BANK',
        value: bankId
    });
    const realmId = bankMember.id;
    // create an eIDAS alias under realm of the target bank
    const eidasAlias = {
        type: 'EIDAS',
        value: tppAuthNumber,
        realmId: realmId
    };

    // create a member under realm of the bank with eIDAS alias
    const tpp = await Token.createMember(
        eidasAlias,
        Token.MemoryCryptoEngine,
        realmId
    );
    // construct a payload with all the required data
    const payload = {
        memberId: tpp.memberId(),
        alias: eidasAlias,
        certificate: certificate,
        algorithm: 'RS256',
    }
    // verify eIDAS
    await tpp.verifyEidas(payload, Token.Util.generateNonce());//await signer.signJson(payload),)
};
