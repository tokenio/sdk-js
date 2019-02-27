import CreateMemberSample from '../../sample/CreateMemberSample';
import DeleteMemberSample from '../../sample/DeleteMemberSample';

const {assert} = require('chai');

describe('DeleteMemberSample test', () => {
    it('Should run the sample', async () => {
        const member = await CreateMemberSample();
        await member.aliases();
        await DeleteMemberSample(member);
        try {
            await member.aliases();
        } catch (err) {
            assert.include(err.message, 'MEMBER_ID_NOT_FOUND');
        }
    });
});
