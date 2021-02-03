import {TokenClient} from '../../src';
import CreateMemberSample from '../../sample/CreateMemberSample';
import MemberMethodsSample from '../../sample/MemberMethodsSample';
const {assert} = require('chai');

const devKey = require('../../src/config.json').devKey[TEST_ENV];
const Token = new TokenClient({env: TEST_ENV, developerKey: devKey});

describe('MemberMethods test', () => {
    let member;

    before(async () => {
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
    });
});
