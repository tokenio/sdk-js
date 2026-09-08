import TokenRequestUrlSample from '../../sample/TokenRequestUrlSample';
import CreateMemberSample from '../../sample/CreateMemberSample';
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
            .parseTokenRequestCallbackUrl(grantee, callbackUrl);
        assert.equal('state', callback.innerState);
        assert.equal(accessToken.id, callback.tokenId);
    });

    it('Should parse a token request callback via params directly', async () => {
        const state = encodeURIComponent(JSON.stringify({innerState: 'state'}));
        const tokenRequestId = Util.generateNonce();
        const grantor = await TestUtil.createUserMember();
        const grantee = await CreateMemberSample();
        const token = await TestUtil.createAccessToken(grantor, await grantee.firstAlias());
        const signature = await grantor.signTokenRequestState(tokenRequestId, token.id, state);
        const callback = await grantee.parseTokenRequestCallbackParams({
            tokenId: token.id,
            state,
            signature: JSON.stringify(signature),
        });
        assert.equal(token.id, callback.tokenId);
        assert.equal('state', callback.innerState);
    });

    it('Should reject a CSRF-bound callback parsed without the CSRF token', async () => {
        const csrfToken = Util.generateNonce();
        const state = encodeURIComponent(JSON.stringify({
            innerState: 'state',
            csrfTokenHash: Util.hashString(csrfToken),
        }));
        const tokenRequestId = Util.generateNonce();
        const grantor = await TestUtil.createUserMember();
        const grantee = await CreateMemberSample();
        const token = await TestUtil.createAccessToken(grantor, await grantee.firstAlias());
        const signature = await grantor.signTokenRequestState(tokenRequestId, token.id, state);
        const callbackParams = {
            tokenId: token.id,
            state,
            signature: JSON.stringify(signature),
        };

        try {
            await grantee.parseTokenRequestCallbackParams(callbackParams);
            return Promise.reject('Should fail without the CSRF token');
        } catch (e) {
            assert.include(e.message, 'Missing CSRF token');
            const callback = await grantee
                .parseTokenRequestCallbackParams(callbackParams, csrfToken);
            assert.equal(token.id, callback.tokenId);
            assert.equal('state', callback.innerState);
            return true;
        }
    });
});
