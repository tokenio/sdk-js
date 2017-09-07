/* eslint-disable require-jsdoc */

const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const TokenIo = require('../../src');
const Token = new TokenIo(TEST_ENV);

import Crypto from "../../src/security/Crypto";

const GET_NOTIFICATION_TIMEOUT_MS = 5000;
let member1 = {};
let alias1 = '';

// Set up a first member
const setUp1 = async () => {
    alias1 = {type: 'USERNAME', value: Token.Util.generateNonce()};
    member1 = await Token.createMember(alias1, Token.MemoryCryptoEngine);
};

describe('Notifications', () => {
    beforeEach(setUp1);

    it('should create and get subscribers', async () => {
        const subscriber = await member1.subscribeToNotifications("token", {
            PLATFORM: 'TEST',
            TARGET: '123',
        });
        const subscribers = await member1.getSubscribers();
        assert.equal(subscriber.id, subscribers[0].id);
    });

    it('should create and get subscriber by Id', async () => {
        const subscriber = await member1.subscribeToNotifications("token", {
            PLATFORM: 'TEST',
            TARGET: '123',
        });
        const subscriber2 = await member1.getSubscriber(subscriber.id);
        assert.equal(subscriber.handler, subscriber2.handler);
        assert.equal(
                subscriber.handlerInstructions.PLATFORM,
                subscriber2.handlerInstructions.PLATFORM);
        assert.equal(subscriber2.handlerInstructions.PLATFORM, "TEST");
    });

    it('should create and get subscriber by Id, with bankId', async () => {
        const subscriber = await member1.subscribeToNotifications("iron");
        const subscriber2 = await member1.getSubscriber(subscriber.id);
        assert.equal(subscriber.handler, subscriber2.handler);
    });

    it('should create and get subscriber by Id, with bankId', async () => {
        const subscriber = await member1.subscribeToNotifications("iron");
        const subscriber2 = await member1.getSubscriber(subscriber.id);
        assert.equal(subscriber.handler, subscriber2.handler);
    });

    it('should subscribe and unsubscribe device', async () => {
      const subscriber = await member1.subscribeToNotifications("token", {
          PLATFORM: 'TEST',
          TARGET: '8E8E256A58DE0F62F4A427202DF8CB07C6BD644AFFE93210BC49B8E5F9402554',
      });
      await member1.unsubscribeFromNotifications(subscriber.id);
        const auth = member1.createTestBankAccount(10000, 'EUR');
        const status = await Token.notifyLinkAccounts(alias1, auth);
        assert.equal(status, "NO_SUBSCRIBERS");
    });

    it('should send a push for linking accounts', async () => {
        await member1.subscribeToNotifications("token", {
            PLATFORM: 'TEST',
            TARGET: '123',
        });
        const auth = await member1.createTestBankAccount(100000, 'EUR');
        const status = await Token.notifyLinkAccounts(alias1, auth);
        assert.equal(status, 'ACCEPTED');
    });

    it('should send a push for adding key', async () => {
        const keys = Crypto.generateKeys(Token.KeyLevel.PRIVILEGED);
        await member1.subscribeToNotifications("token", {
            PLATFORM: 'TEST',
            TARGET: Token.Util.generateNonce(),
        });
        await Token.notifyAddKey(alias1, "Chrome 54.1", keys, Token.KeyLevel.PRIVILEGED);
    });

    it('should send a push for adding a key and linking accounts', async () => {
        const keys = Crypto.generateKeys(Token.KeyLevel.PRIVILEGED);
        await member1.subscribeToNotifications("token", {
            PLATFORM: 'TEST',
            TARGET: Token.Util.generateNonce(),
        });
        const auth = await member1.createTestBankAccount(100000, 'EUR');
        await Token.notifyLinkAccountsAndAddKey(
                alias1,
                auth,
                'Chrome 51.0',
                keys,
                Token.KeyLevel.PRIVILEGED);
    });

    it('should send an actual push to device', async () => {
        await member1.subscribeToNotifications("token", {
            PLATFORM: 'TEST',
            TARGET: Token.Util.generateNonce(),
        });
        const auth = await member1.createTestBankAccount(100000, 'EUR');
        await Token.notifyLinkAccounts(alias1, auth);
    });

    it('should send a push for a payment request', async () => {
       const payeeAlias = {type: 'USERNAME', value: Token.Util.generateNonce()};
       await Token.createMember(payeeAlias, Token.MemoryCryptoEngine);

        await member1.subscribeToNotifications("token", {
            PLATFORM: 'TEST',
            TARGET: Token.Util.generateNonce(),
        });

        const status = await Token.notifyPaymentRequest({
          description: 'payment request',
          from: {alias: alias1},
          to: {alias: payeeAlias},
          transfer: {amount: '100', currency: 'USD'}
        });
        assert.equal(status, 'ACCEPTED');
    });

    async function waitUntil(fn, resolve, reject, waitTime = 1, start = new Date().getTime()) {
        try {
            await fn();
            resolve('Successful');
        } catch (e) {
            if (new Date().getTime() - start > GET_NOTIFICATION_TIMEOUT_MS) {
                reject('Timed out');
                return;
            }
            setTimeout(() => {
                waitUntil(fn, resolve, reject, waitTime * 2, start);
            }, waitTime * 2);
        }
    }

    it('should get notifications with paging', async () => {
        const keys = Crypto.generateKeys(Token.KeyLevel.PRIVILEGED);
        const alias2 = {type: 'USERNAME', value: Token.Util.generateNonce()};
        const member2 = await Token.createMember(alias2, Token.MemoryCryptoEngine);
        const notificationsEmpty = await member2.getNotifications(null, 100);
        assert.equal(notificationsEmpty.data.length, 0);

        await member2.subscribeToNotifications("token", {
            PLATFORM: 'TEST',
            TARGET: Token.Util.generateNonce(),
        });

        await Token.notifyAddKey(alias2, "Chrome 54.1", keys, Token.KeyLevel.PRIVILEGED);
        await Token.notifyAddKey(alias2, "Chrome 54.1", keys, Token.KeyLevel.PRIVILEGED);
        await Token.notifyAddKey(alias2, "Chrome 54.1", keys, Token.KeyLevel.PRIVILEGED);
        await Token.notifyAddKey(alias2, "Chrome 54.1", keys, Token.KeyLevel.PRIVILEGED);
        return new Promise((resolve, reject) => {
            waitUntil(async () => {
                const notifications = await member2.getNotifications(null, 2);
                assert.equal(notifications.data.length, 2);
                const lookedUp = await member2.getNotification(notifications.data[0].id);
                assert.equal(lookedUp.id, notifications.data[0].id);
                assert.isOk(lookedUp.subscriberId);
                assert.isOk(lookedUp.status);
                assert.isOk(lookedUp.content);
                assert.isOk(lookedUp.content.type);
                assert.isOk(lookedUp.content.title);
                assert.isOk(lookedUp.content.body);
                assert.isOk(lookedUp.content.createdAtMs);
                const notifications2 = await member2.getNotifications(notifications.offset, 100);
                assert.equal(notifications2.data.length, 2);
            }, resolve, reject);
        });
    });

    it('should send a and get push to fank', async () => {
        const keys = Crypto.generateKeys(Token.KeyLevel.PRIVILEGED);
        const subscriber = await member1.subscribeToNotifications("iron", {
            platform: "TEST",
        });
        await Token.notifyAddKey(alias1, "Chrome 54.1", keys, Token.KeyLevel.PRIVILEGED);
        return new Promise((resolve, reject) => {
            waitUntil(async () => {
                const notifications = await member1.getTestBankNotifications(subscriber.id);
                const lookedUp = await member1.getTestBankNotification(
                        subscriber.id,
                        notifications[0].id);
                assert.equal(lookedUp.id, notifications[0].id);
                assert.isOk(lookedUp.subscriberId);
                assert.isOk(lookedUp.status);
                assert.isOk(lookedUp.content);
                assert.isOk(lookedUp.content.type);
                assert.isOk(lookedUp.content.title);
                assert.isOk(lookedUp.content.body);
                assert.isOk(lookedUp.content.createdAtMs);
            }, resolve, reject);
        });
    });
});
