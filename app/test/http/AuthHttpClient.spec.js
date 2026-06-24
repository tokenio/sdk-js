import HttpClient from '../../src/http/HttpClient';
import AuthHttpClient from '../../src/http/AuthHttpClient';
import MemoryCryptoEngine from '../../../core/src/security/engines/MemoryCryptoEngine';
import Util from '../../src/Util';
import Member from '../../src/main/Member';

const {assert} = require('chai');
const devKey = require('../../src/config.json').devKey[TEST_ENV];

describe('AuthHttpClient', () => {
    it('should set misc headers on authenticated client', () => {
        const engine = new MemoryCryptoEngine('m:test:123');
        const client = new AuthHttpClient({
            env: TEST_ENV,
            memberId: 'm:test:123',
            cryptoEngine: engine,
            developerKey: devKey,
        });
        client.setMiscHeaders({
            'token-trace-initial-service-name': 'Node Server',
            'token-trace-initial-endpoint-name': 'POST: /pay',
        });
        assert.equal(
            client._context.miscHeaders['token-trace-initial-service-name'],
            'Node Server');
        assert.equal(
            client._context.miscHeaders['token-trace-initial-endpoint-name'],
            'POST: /pay');
    });

    it('should add a second key', async () => {
        const unauthenticatedClient = new HttpClient({env: TEST_ENV, developerKey: devKey});
        const res = await unauthenticatedClient.createMemberId();
        assert.isOk(res.data.memberId);
        const engine = new MemoryCryptoEngine(res.data.memberId);
        const pk1 = await engine.generateKey('PRIVILEGED');
        const pk2 = await engine.generateKey('STANDARD');
        const pk3 = await engine.generateKey('LOW');
        const res2 = await unauthenticatedClient.approveFirstKeys(
            res.data.memberId,
            [pk1, pk2, pk3],
            engine);
        assert.isOk(res2.data.member);
        assert.isOk(res2.data.member.lastHash);
        assert.equal(res2.data.member.keys.length, 3);
    });

    it('should remove a key', async () => {
        const unauthenticatedClient = new HttpClient({env: TEST_ENV, developerKey: devKey});
        const res = await unauthenticatedClient.createMemberId();
        assert.isOk(res.data.memberId);
        const engine = new MemoryCryptoEngine(res.data.memberId);
        const pk1 = await engine.generateKey('PRIVILEGED');
        const pk2 = await engine.generateKey('STANDARD');
        const pk3 = await engine.generateKey('LOW');
        const client = new AuthHttpClient({
            env: TEST_ENV,
            memberId: res.data.memberId,
            cryptoEngine: engine,
            developerKey: devKey,
        });
        const res2 = await unauthenticatedClient.approveFirstKeys(
            res.data.memberId,
            [pk1, pk2, pk3],
            engine);
        return await client.removeKey(res2.data.member.lastHash, pk2.id);
    });

    it('should add aliases', async () => {
        const unauthenticatedClient = new HttpClient({env: TEST_ENV, developerKey: devKey});
        const res = await unauthenticatedClient.createMemberId();
        const engine = new MemoryCryptoEngine(res.data.memberId);
        const pk1 = await engine.generateKey('PRIVILEGED');
        const pk2 = await engine.generateKey('STANDARD');
        const pk3 = await engine.generateKey('LOW');
        const client = new AuthHttpClient({
            env: TEST_ENV,
            memberId: res.data.memberId,
            cryptoEngine: engine,
            developerKey: devKey,
        });
        assert.isOk(res.data.memberId);
        const res2 = await unauthenticatedClient.approveFirstKeys(
            res.data.memberId,
            [pk1, pk2, pk3],
            engine);
        await client.addAlias(
            res2.data.member.lastHash,
            Util.randomAlias());
        const res3 = await unauthenticatedClient.getMember(res2.data.member.id);
        assert.equal(res3.data.member.aliasHashes.length, 1);
        await client.addAlias(
            res3.data.member.lastHash,
            Util.randomAlias());
        const res4 = await unauthenticatedClient.getMember(res2.data.member.id);
        assert.equal(res4.data.member.aliasHashes.length, 2);
    });

    it('should remove aliases', async () => {
        const unauthenticatedClient = new HttpClient({env: TEST_ENV, developerKey: devKey});
        const res = await unauthenticatedClient.createMemberId();
        assert.isOk(res.data.memberId);
        const engine = new MemoryCryptoEngine(res.data.memberId);
        const pk1 = await engine.generateKey('PRIVILEGED');
        const pk2 = await engine.generateKey('STANDARD');
        const pk3 = await engine.generateKey('LOW');
        const client = new AuthHttpClient({
            env: TEST_ENV,
            memberId: res.data.memberId,
            cryptoEngine: engine,
            developerKey: devKey,
        });
        const res2 = await unauthenticatedClient.approveFirstKeys(
            res.data.memberId,
            [pk1, pk2, pk3],
            engine);
        await client.addAlias(
            res2.data.member.lastHash,
            Util.randomAlias());
        const res3 = await unauthenticatedClient.getMember(res2.data.member.id);
        assert.equal(res3.data.member.aliasHashes.length, 1);
        const secondAlias = Util.randomAlias();
        await client.addAlias(res3.data.member.lastHash, secondAlias);
        const res4 = await unauthenticatedClient.getMember(res2.data.member.id);
        assert.equal(res4.data.member.aliasHashes.length, 2);
        const res5 = await client.removeAlias(res4.data.member.lastHash, secondAlias);
        assert.equal(res5.data.member.aliasHashes.length, 1);
    });
});

describe('Member misc headers', () => {
    it('should automatically set member-id header', () => {
        const engine = new MemoryCryptoEngine('m:test:member:456');
        const member = new Member({
            env: TEST_ENV,
            memberId: 'm:test:member:456',
            cryptoEngine: engine,
            developerKey: devKey,
        });

        assert.equal(
            member._client._context.miscHeaders['token-trace-member-id'],
            'm:test:member:456');
    });

    it('should set misc headers on member', () => {
        const engine = new MemoryCryptoEngine('m:test:member:789');
        const member = new Member({
            env: TEST_ENV,
            memberId: 'm:test:member:789',
            cryptoEngine: engine,
            developerKey: devKey,
        });

        member.setMiscHeaders({
            'token-trace-initial-endpoint-name': 'GET: /accounts',
            'token-trace-initiated-by': 'FRONTEND',
            'token-trace-member-id': 'm:test:member:789',
        });

        assert.equal(
            member._client._context.miscHeaders['token-trace-initial-endpoint-name'],
            'GET: /accounts');
        assert.equal(
            member._client._context.miscHeaders['token-trace-initiated-by'],
            'FRONTEND');
        assert.equal(
            member._client._context.miscHeaders['token-trace-member-id'],
            'm:test:member:789');
    });
});
