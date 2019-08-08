import CreateMemberSample from '../../sample/CreateMemberSample';
import StoreAndRetrieveStandingOrderTokenRequestSample
    from '../../sample/StoreAndRetrieveStandingOrderTokenRequestSample';
const {assert} = require('chai');

describe('StoreAndRetrieveStandingOrderTokenRequestSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const res = await StoreAndRetrieveStandingOrderTokenRequestSample(member);
        assert.isOk(res.tokenRequest.requestPayload);
        assert.isOk(res.tokenRequest.requestOptions);
    });
});
