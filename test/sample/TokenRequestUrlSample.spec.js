/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import TokenRequestUrlSample from '../../src/sample/TokenRequestUrlSample';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import Crypto from "../../src/security/Crypto";
import Util from "../../src/Util";

describe('TokenRequestUrl test', () => {
    it('Should complete the whole token request URL flow', async () => {
        const grantor = await CreateMemberSample();
        const grantee = await CreateMemberSample();

        const requestId = Util.generateNonce();
        const originalState = Util.generateNonce();
        const csrfToken = Util.generateNonce();

        const requestUrl = TokenRequestUrlSample
            .generateTokenRequestUrl(requestId, originalState, csrfToken);

        const callbackUrl = await TokenRequestUrlSample
            .getCallbackUrlFromTokenRequestUrl(grantor, grantee, requestUrl);

        const callback = await TokenRequestUrlSample
            .parseTokenRequestCallbackUrl(callbackUrl, csrfToken);

        assert.equal(originalState, callback.innerState);
        assert.notEqual('', callback.tokenId);
    });

    it('Should request a signature', async () => {
        const state = Util.generateNonce();

        const grantor = await CreateMemberSample();
        const grantee = await CreateMemberSample();
        const token = await TokenRequestUrlSample.generateValidAccessToken(grantor, grantee);

        const signature = await grantor.signTokenRequestState(token.id, state);

        const tokenMember = await TokenRequestUrlSample.getTokenMember();
        const signingKey = Util.getSigningKey(tokenMember.keys, signature);

        await Crypto.verifyJson(
            {
                state: state,
                tokenId: token.id
            },
            signature.signature,
            Crypto.bufferKey(signingKey.publicKey)
        );
    });
});
