/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import StoreAndRetrieveAccessTokenRequestSample
  from '../../src/sample/StoreAndRetrieveAccessTokenRequestSample';

describe('StoreAndRetrieveAccessTokenRequestSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        const res = await StoreAndRetrieveAccessTokenRequestSample(member);
        assert.isOk(res.payload);
        assert.isOk(res.options);
    });
});
