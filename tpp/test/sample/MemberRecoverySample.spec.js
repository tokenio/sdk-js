import {TokenClient} from '../../src';
import config from '../../src/config.json';
const {assert} = require('chai');
import MemberRecoverySample from '../../sample/MemberRecoverySample';

describe('MemberRecoverySample test', () => {
    let Token, mrs;
    const {ENV: TEST_ENV = 'dev'} = process.env;

    before(async () => {
        Token = new TokenClient({env: TEST_ENV, developerKey: config.devKey[TEST_ENV]});
        mrs = new MemberRecoverySample();
    });

    it('Should handle default recovery', async () => {
        // set up
        const originalAlias = {
            type: 'EMAIL',
            value: 'alias-' + Token.Util.generateNonce() + '+noverify@token.io',
        };
        const originalMember = await Token.createMember(originalAlias,
            Token.MemoryCryptoEngine);
        await mrs.setUpDefaultRecoveryRule(originalMember);
        const otherTokenClient = new TokenClient(
            {env: TEST_ENV, developerKey: config.devKey[TEST_ENV]});
        const recoveredMember = await mrs.recoverWithDefaultRule(
            otherTokenClient, originalAlias);
        const recoveredAlias = await recoveredMember.firstAlias();
        assert.deepEqual(recoveredAlias, originalAlias);
    });

    it('Should handle complex recovery', async () => {
        const agentTokenIO = new TokenClient(
            {env: TEST_ENV, developerKey: config.devKey[TEST_ENV]});
        const agentAlias = {
            type: 'EMAIL',
            value: 'alias-' + Token.Util.generateNonce() + '+noverify@token.io',
        };
        const agentMember = await agentTokenIO.createMember(
            agentAlias, agentTokenIO.MemoryCryptoEngine);
        mrs.agentMember = agentMember;

        // set up
        const originalAlias = {
            type: 'EMAIL',
            value: 'alias-' + Token.Util.generateNonce() + '+noverify@token.io',
        };
        const originalMember = await Token.createMember(originalAlias, Token.MemoryCryptoEngine);
        await mrs.setUpComplexRecoveryRule(originalMember, Token, agentAlias);

        // recover
        const otherTokenClient = new TokenClient(
            {env: TEST_ENV, developerKey: config.devKey[TEST_ENV]});
        const recoveredMember = await mrs.recoverWithComplexRule(otherTokenClient, originalAlias);

        // make sure it worked
        const recoveredAlias = await recoveredMember.firstAlias();
        assert.deepEqual(recoveredAlias, originalAlias);
    });

});
