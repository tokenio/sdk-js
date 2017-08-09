const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const TokenIo = require('../../src');
const Token = new TokenIo(TEST_ENV);

import Crypto from "../../src/security/Crypto";

let member = {};
let alias = '';

describe('member tests', () => {
    before(async () => {
        alias = {type: 'USERNAME', value: Token.Util.generateNonce()};
        member = await Token.createMember(alias, Token.MemoryCryptoEngine);
    });

    describe('Creating a member', () => {
        it('should add a second key', async () => {
            const keys = Crypto.generateKeys(Token.KeyLevel.PRIVILEGED);
            await member.approveKey(keys);
        });

        it('should add and remove a key', async () => {
            const keys = Crypto.generateKeys(Token.KeyLevel.PRIVILEGED);
            await member.approveKey(keys);
            await member.removeKey(keys.id);
            const keys2 = await member.keys();
            assert.isAtLeast(keys2.length, 2);
        });

        it('should add and remove multiple keys', async () => {
            const alias = {type: 'USERNAME', value: Token.Util.generateNonce()};
            let memberX = await Token.createMember(alias, Token.MemoryCryptoEngine);
            const keys = Crypto.generateKeys(Token.KeyLevel.PRIVILEGED);
            const keys2 = Crypto.generateKeys(Token.KeyLevel.PRIVILEGED);
            const keys3 = Crypto.generateKeys(Token.KeyLevel.PRIVILEGED);
            await memberX.approveKeys(
                [keys, keys2, keys3],
                [Token.KeyLevel.LOW, Token.KeyLevel.STANDARD, Token.KeyLevel.LOW]);
            const pks = await memberX.keys();
            assert.equal(pks.length, 6);
            await memberX.removeKeys([keys.id, keys3.id]);
            const pks2 = await memberX.keys();
            assert.equal(pks2.length, 4);
        });

        it('should add and get aliass', async () => {
            const alias = {type: 'USERNAME', value: Token.Util.generateNonce()};
            await member.addAlias(alias);
            const aliases = await member.aliases();
            assert.isAtLeast(aliases.length, 2);
            const firstAlias = await member.firstAlias();
            assert.isOk(firstAlias);
            assert.include(aliases, firstAlias);
        });

        it('should add multiple aliass', async () => {
            const alias = {type: 'USERNAME', value: Token.Util.generateNonce()};
            const alias2 = {type: 'USERNAME', value: Token.Util.generateNonce()};
            const alias3 = {type: 'USERNAME', value: Token.Util.generateNonce()};
            await member.addAliases([alias, alias2, alias3]);
            const aliases = await member.aliases();
            assert.include(aliases, alias.value);
            assert.include(aliases, alias2.value);
            assert.include(aliases, alias3.value);
        });

        it('should add and remove a alias', async () => {
            const newAlias = {type: 'USERNAME', value: Token.Util.generateNonce()};
            await member.addAlias(newAlias);
            await member.removeAlias(newAlias);
            const aliases = await member.aliases();
            assert.include(aliases, alias.value);
            assert.notInclude(aliases, newAlias.value);
        });

        it('should remove multiple aliases', async () => {
            const newAlias = {type: 'USERNAME', value: Token.Util.generateNonce()};
            const newAlias2 = {type: 'USERNAME', value: Token.Util.generateNonce()};
            await member.addAlias(newAlias);
            await member.addAlias(newAlias2);
            await member.removeAliases([newAlias, newAlias2]);
            const aliases = await member.aliases();
            assert.include(aliases, alias.value);
            assert.notInclude(aliases, newAlias.value);
            assert.notInclude(aliases, newAlias2.value);
        });

        it('should get all aliases', async () => {
            const aliases = await member.aliases();
            assert.isAtLeast(aliases.length, 1);
        });

        it('should get all keys', async () => {
            const keys = await member.keys();
            assert.isAtLeast(keys.length, 1);
        });

        it('should link an account', async () => {
            const auth = await member.createTestBankAccount(100000, 'EUR');
            const accs = await member.linkAccounts(auth);
            assert.isAtLeast(accs.length, 1);
        });

        it('should get accounts', async () => {
            const auth = await member.createTestBankAccount(100000, 'EUR');
            await member.linkAccounts(auth);
            const accs = await member.getAccounts();
            assert.isAtLeast(accs.length, 2);
        });

        it('should get the memberId', async () => {
            const mem = await Token.resolveAlias(alias);
            assert.equal(mem.id, member.memberId());

            const mem2 = await Token.resolveAlias({type: 'USERNAME', value: Token.Util.generateNonce()});
            assert.isNotOk(mem2);
        });
    });
});
