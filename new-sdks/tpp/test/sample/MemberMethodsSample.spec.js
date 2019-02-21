import {TokenClient} from '../../src';
import CreateMemberSample from '../../sample/CreateMemberSample';
import MemberMethodsSample from '../../sample/MemberMethodsSample';
import config from '../../src/config.json';
const {assert} = require('chai');

describe('MemberMethods test', () => {
    let Token, member;

    before(async () => {
        Token = new TokenClient({env: TEST_ENV, developerKey: config.devKey[TEST_ENV]});
        member = await CreateMemberSample();
    });

    it('Should run the aliases sample', async () => {
        await MemberMethodsSample.aliases(Token, member);
        const aliases = await member.aliases();
        assert.equal(aliases.length, 1);
        assert.isTrue(aliases[0].value.includes('alias4'));
    });

    it('Should run the keys sample', async () => {
        await MemberMethodsSample.keys(Token, member);
    });

    it('Should run the profiles sample', async () => {
        const profile = await MemberMethodsSample.profiles(member);
        assert.isOk(profile);
        assert.isOk(profile.displayNameFirst);
        assert.isOk(profile.displayNameLast);
    });
});
