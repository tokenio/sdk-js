import CreateMemberSample from '../../sample/CreateMemberSample';
import StoreAndRetrieveBulkTransferTokenRequestSample
    from '../../sample/StoreAndRetrieveBulkTransferTokenRequestSample';
const {assert} = require('chai');

describe('StoreAndRetrieveBulkTransferTokenRequestSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        await member.createAndLinkTestBankAccount(200, 'EUR');
        const res = await StoreAndRetrieveBulkTransferTokenRequestSample(member);
        assert.isOk(res.tokenRequest.requestPayload);
        assert.isOk(res.tokenRequest.requestOptions);
    });
});
