import CreateMemberSample from '../../sample/CreateMemberSample';
import StoreAndRetrieveTransferTokenRequestSample
    from '../../sample/StoreAndRetrieveTransferTokenRequestSample';
const {assert} = require('chai');

describe('StoreAndRetrieveTransferTokenRequestSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const res = await StoreAndRetrieveTransferTokenRequestSample(member);
        assert.isOk(res.tokenRequest.requestPayload);
        assert.isOk(res.tokenRequest.requestOptions);
    });
});
