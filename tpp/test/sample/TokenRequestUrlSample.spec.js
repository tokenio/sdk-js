import TokenRequestUrlSample from '../../sample/TokenRequestUrlSample';
import CreateMemberSample from '../../sample/CreateMemberSample';
import Crypto from '../../../core/src/security/Crypto';
import Util from '../../src/Util';
import TestUtil from '../TestUtil';
const {assert} = require('chai');

describe('TokenRequestUrl test', () => {
    it('Should complete the whole token request URL flow', async () => {
        const grantor = await TestUtil.createUserMember();
        const grantee = await CreateMemberSample();
        const accessToken = await TestUtil.createAccessToken(grantor, await grantee.firstAlias());
        const callbackUrl = await TokenRequestUrlSample
            .getCallbackUrlFromTokenRequestUrl(Util.generateNonce(), grantor, grantee, accessToken);
        const callback = await TokenRequestUrlSample
            .parseTokenRequestCallbackUrl(callbackUrl);
        assert.equal('state', callback.innerState);
        assert.equal(accessToken.id, callback.tokenId);
    });

    it('Should request a signature', async () => {
        const state = encodeURIComponent(
            JSON.stringify({}));
        const tokenRequestId = Util.generateNonce();
        const grantor = await TestUtil.createUserMember();
        const grantee = await CreateMemberSample();
        const token = await TestUtil.createAccessToken(grantor, await grantee.firstAlias());
        const signature = await grantor.signTokenRequestState(tokenRequestId, token.id, state);
        const tokenMember = await TokenRequestUrlSample.getTokenMember();
        const signingKey = Util.getSigningKey(tokenMember.keys, signature);
        await Crypto.verifyJson(
            {
                state: state,
                tokenId: token.id,
            },
            signature.signature,
            Util.bufferKey(signingKey.publicKey)
        );
    });
});
