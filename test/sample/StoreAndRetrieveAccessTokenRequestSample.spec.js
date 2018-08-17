import CreateMemberSample from '../../src/sample/CreateMemberSample';
import StoreAndRetrieveAccessTokenRequestSample
    from '../../src/sample/StoreAndRetrieveAccessTokenRequestSample';

const {assert} = require('chai');

describe('StoreAndRetrieveAccessTokenRequestSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const res = await StoreAndRetrieveAccessTokenRequestSample(member);
        assert.isOk(res.payload);
        assert.isOk(res.options);
    });
});
