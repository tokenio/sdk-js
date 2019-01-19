import TokenRequestUrlSample from '../../src/sample/TokenRequestUrlSample';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import Crypto from '../../src/security/Crypto';
import Util from '../../src/Util';

const {assert} = require('chai');

describe('TokenRequestUrl test', () => {
    it('Should complete the whole token request URL flow', async () => {
        if (BROWSER) return;
        const grantor = await CreateMemberSample();
        const grantee = await CreateMemberSample();

        const requestId = Util.generateNonce();

        const requestUrl = TokenRequestUrlSample
            .generateTokenRequestUrl(requestId);
        const callbackUrl = await TokenRequestUrlSample
            .getCallbackUrlFromTokenRequestUrl(requestId, grantor, grantee, requestUrl);
        const callback = await TokenRequestUrlSample
            .parseTokenRequestCallbackUrl(callbackUrl);
        assert.equal('', callback.innerState);
        assert.notEqual('', callback.tokenId);
    });

    it('Should request a signature', async () => {
        if (BROWSER) return;
        const state = encodeURIComponent(JSON.stringify({innerState: '', csrfTokenHash: Util.hashString('')}));
        const tokenRequestId = Util.generateNonce();

        const grantor = await CreateMemberSample();
        const grantee = await CreateMemberSample();
        const token = await TokenRequestUrlSample.generateValidAccessToken(grantor, grantee);

        const signature = await grantor.signTokenRequestState(tokenRequestId, token.id, state);

        const tokenMember = await TokenRequestUrlSample.getTokenMember();
        const signingKey = Util.getSigningKey(tokenMember.keys, signature);

        await Crypto.verifyJson(
            {
                state: state,
                tokenId: token.id,
            },
            signature.signature,
            Crypto.bufferKey(signingKey.publicKey)
        );
    });
});
