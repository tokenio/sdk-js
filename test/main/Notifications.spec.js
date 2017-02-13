const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/security/Crypto";
import BankClient from "../sample/BankClient";
import {KeyLevel} from "../../src/constants";

const GET_NOTIFICATION_TIMEOUT_MS = 5000;
let member1 = {};
let username1 = '';

// Set up a first member
const setUp1 = async () => {
    username1 = Crypto.generateKeys().keyId;
    member1 = await Token.createMember(username1);
};

describe('Notifications', () => {
    beforeEach(setUp1);

    it('should create and get subscribers', async () => {
        const randomStr = Crypto.generateKeys().keyId;
        const subscriber = await member1.subscribeToNotifications(randomStr);
        const subscribers = await member1.getSubscribers();
        assert.equal(subscriber.id, subscribers[0].id);
    });

    it('should create and get subscriber by Id', async () => {
        const randomStr = Crypto.generateKeys().keyId;
        const subscriber = await member1.subscribeToNotifications(randomStr, "ANDROID");
        const subscriber2 = await member1.getSubscriber(subscriber.id);
        assert.equal(subscriber.platform, subscriber2.platform);
        assert.equal(subscriber.platform, "ANDROID");
    });

    it('should subscribe and unsubscribe device', async () => {
      const subscriber = await member1.subscribeToNotifications("8E8E256A58DE0F62F4A427202DF8CB07C6BD644AFFE93210BC49B8E5F9402554");
      await member1.unsubscribeFromNotifications(subscriber.id);
      try {
          const status = await Token.notifyLinkAccounts(username1, "iron", 'bank-name', "alp...");
          return Promise.reject(new Error("Should fail"));
      } catch (err) {
          return true;
      }
    });

    it('should send a push for linking accounts', async () => {
        const target = Crypto.generateKeys().keyId;
        await member1.subscribeToNotifications(target);
        const alp = await BankClient.requestLinkAccounts(username1, 100000, 'EUR');
        const status = await Token.notifyLinkAccounts(username1, 'iron', 'bank-name', alp);
        assert.equal(status, 'ACCEPTED');
    });

    it('should send a push for adding key', async () => {
        const target = "DEV:9CF5BCAE80D74DEE05F040CBD57E1DC4F5FE8F1288A80A5061D58C1AD90FC77900";
        const keys = Crypto.generateKeys();
        const alp = await member1.subscribeToNotifications(target);
        await Token.notifyAddKey(username1, "Chrome 54.1", keys, KeyLevel.PRIVILEGED);
    });

    it('should send a push for adding a key and linking accounts', async () => {
        const randomStr = '4011F723D5684EEB9D983DD718B2B2A484C23B7FB63FFBF15BE9F0F5ED239A5B';
        const keys = Crypto.generateKeys();
        await member1.subscribeToNotifications(randomStr)
        const alp = await BankClient.requestLinkAccounts(username1, 100000, 'EUR');
        await Token.notifyLinkAccountsAndAddKey(
                username1,
                'iron',
                'bank-name',
                alp,
                'Chrome 51.0',
                keys,
                KeyLevel.PRIVILEGED);
    });

    it('should send an actual push to device', async () => {
        await member1.subscribeToNotifications('DEV:9CF5BCAE80D74DEE05F040CBD57E1DC4F5FE8F1288A80A5061D58C1AD90FC77900' +
            '8E5F9402554000');
        const alp = await BankClient.requestLinkAccounts(username1, 100000, 'EUR');
        await Token.notifyLinkAccounts(username1, 'iron', 'bank-name', alp);
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
        const target = "DEV:9CF5BCAE80D74DEE05F040CBD57E1DC4F5FE8F1288A80A5061D58C1AD90FC77900";
        const keys = Crypto.generateKeys();
        const username2 = Crypto.generateKeys().keyId;
        const member2 = await Token.createMember(username2);
        const notificationsEmpty = await member2.getNotifications(null, 100);
        assert.equal(notificationsEmpty.data.length, 0);

        const alp = await member2.subscribeToNotifications(target);
        await Token.notifyAddKey(username2, "Chrome 54.1", keys, KeyLevel.PRIVILEGED);
        await Token.notifyAddKey(username2, "Chrome 54.1", keys, KeyLevel.PRIVILEGED);
        await Token.notifyAddKey(username2, "Chrome 54.1", keys, KeyLevel.PRIVILEGED);
        await Token.notifyAddKey(username2, "Chrome 54.1", keys, KeyLevel.PRIVILEGED);
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
});
