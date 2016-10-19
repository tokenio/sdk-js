const chai = require('chai');
const assert = chai.assert;
const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/Crypto";
import BankClient from "../sample/BankClient";

let member1 = {};
let username1 = '';

// Set up a first member
const setUp1 = () => {
    username1 = Crypto.generateKeys().keyId;
    return Token.createMember(username1)
        .then(res => {
            member1 = res;
            return true;
        });
};

describe('Notifications', () => {
    beforeEach(() => {
        return Promise.all([setUp1()]);
    });
    it('should create and get subscribers', () => {
        const randomStr = Crypto.generateKeys().keyId;
        return member1.subscribeToNotifications(randomStr)
            .then(subscriber => {
                return member1.getSubscribers()
                    .then(subscribers => {
                        assert.equal(subscriber.id, subscribers[0].id);
                    });
            });
    });
    it('should create and get subscriber by Id', () => {
        const randomStr = Crypto.generateKeys().keyId;
        return member1.subscribeToNotifications(randomStr, "Token", "ANDROID")
            .then(subscriber => {
                return member1.getSubscriber(subscriber.id)
                    .then(subscriber2 => {
                        assert.equal(subscriber.platform, subscriber2.platform);
                        assert.equal(subscriber.platform, "ANDROID");
                    });
            });
    });
    it('should subscribe and unsubscribe device', done => {
      member1.subscribeToNotifications("8E8E256A58DE0F62F4A427202DF8CB07C6BD644AFFE93210BC49B8E5F9402554")
      .then(subscriber => {
        member1.unsubscribeFromNotifications(subscriber.id)
          .then(() => {
              Token.notifyLinkAccounts(username1, "bank-id", 'bank-name', "alp...")
                  .then(() => {
                      done(new Error("Should fail"));
                  }).catch(() => done());
          });
      });
    });

    it('should send a push for linking accounts', () => {
        const target = Crypto.generateKeys().keyId;
        return member1.subscribeToNotifications(target)
            .then(() => BankClient.requestLinkAccounts(username1, 100000, 'EUR'))
            .then(alp => Token.notifyLinkAccounts(username1, 'bank-id', 'bank-name', alp));
    });

    it('should send a push for adding key', () => {
        const target = Crypto.generateKeys().keyId;
        const keys = Crypto.generateKeys();
        return member1.subscribeToNotifications(target)
            .then(alp => Token.notifyAddKey(username1,
                keys.publicKey, "Chrome 54.1"));
    });

    it('should send a push for adding a key and linking accounts', () => {
        const randomStr = '8E8E256A58DE0F62F4A427202DF8CB07C6BD644AFFE93210BC49B8E5F9402554000';
        const keys = Crypto.generateKeys();
        return member1.subscribeToNotifications(randomStr)
            .then(() => BankClient.requestLinkAccounts(username1, 100000, 'EUR'))
            .then(alp => Token.notifyLinkAccountsAndAddKey(
                username1,
                'bank-id',
                'bank-name',
                alp,
                keys.publicKey,
                'Chrome 51.0'));
    });

    it('should send an actual push to device', () => {
        return member1.subscribeToNotifications('8E8E256A58DE0F62F4A427202DF8CB07C6BD644AFFE93210BC49B' +
            '8E5F9402554000')
            .then(() => BankClient.requestLinkAccounts(username1, 100000, 'EUR'))
            .then(alp => Token.notifyLinkAccounts(username1, 'bank-id', 'bank-name', alp));
    });
});
