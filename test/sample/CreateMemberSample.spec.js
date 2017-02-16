const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';

describe('CreateMemberSample test', () => {
    it('Should run the sample', async () => {
        await CreateMemberSample();
    });
});