import CreateMemberSample from '../../sample/CreateMemberSample';
import StoreAndRetrieveAccessTokenRequestSample
    from '../../sample/StoreAndRetrieveAccessTokenRequestSample';
const {assert} = require('chai');

describe('StoreAndRetrieveAccessTokenRequestSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const res = await StoreAndRetrieveAccessTokenRequestSample(member);
        assert.isOk(res.tokenRequest.requestPayload);
        assert.isOk(res.tokenRequest.requestOptions);
    });
});
