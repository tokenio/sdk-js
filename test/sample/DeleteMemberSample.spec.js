/* eslint-disable new-cap */
const chai = require('chai');
const assert = chai.assert;

import 'babel-regenerator-runtime';
import CreateMemberSample from '../../src/sample/CreateMemberSample';
import DeleteMemberSample from '../../src/sample/DeleteMemberSample';

describe('DeleteMemberSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        await member.aliases();
        await DeleteMemberSample(member);
        try {
            await member.aliases();
        } catch (err) {
            assert.include(err.message, BROWSER ? "UNKNOWN" : "MEMBER_ID_NOT_FOUND");
        }
    });
});
