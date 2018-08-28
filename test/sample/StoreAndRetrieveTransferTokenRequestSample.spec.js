import CreateMemberSample from '../../src/sample/CreateMemberSample';
import StoreAndRetrieveTransferTokenRequestSample
    from '../../src/sample/StoreAndRetrieveTransferTokenRequestSample';

const {assert} = require('chai');

describe('StoreAndRetrieveTransferTokenRequestSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const res = await StoreAndRetrieveTransferTokenRequestSample(member);
        assert.isOk(res.payload);
        assert.isOk(res.options);
    });
});
