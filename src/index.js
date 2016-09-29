import Crypto from './Crypto';
import Util from './Util';
import PaymentToken from './main/PaymentToken';
import Member from './main/Member';
import LocalStorage from './LocalStorage';
import UnauthenticatedClient from './http/UnauthenticatedClient';
import AuthHttpClient from './http/AuthHttpClient';

// Promise polyfill for IE and older browsers
require('es6-promise').polyfill();

const Token = {
  createMember: alias => {
    const keys = Crypto.generateKeys();
    return UnauthenticatedClient.createMemberId()
    .then(response => UnauthenticatedClient.addFirstKey(keys,
        response.data.memberId)
      .then(() => {
        const member = new Member(response.data.memberId, keys);
        return member.addAlias(alias)
        .then(() => member);
      })
    );
  },

  loginMember: (memberId, keys) => {
    return new Member(memberId, keys);
  },

  loginMemberFromLocalStorage: () => {
    return LocalStorage.loadMember();
  },

  getMember: (keys, alias) =>
    AuthHttpClient.getMemberByAlias(keys, alias)
      .then(res =>
        new Member(res.data.member.id, keys)),

  notifyLinkAccounts(alias, bankId, accountLinkPayload) {
    return UnauthenticatedClient.notifyLinkAccounts(alias, bankId,
      accountLinkPayload);
  },

  notifyAddKey(alias, publicKey, tags = []) {
    return UnauthenticatedClient.notifyAddKey(alias, publicKey, tags);
  },

  notifyLinkAccountsAndAddKey(alias, bankId, accountLinkPayload, publicKey,
      tags = []) {
    return UnauthenticatedClient.notifyLinkAccountsAndAddKey(alias, bankId,
      accountLinkPayload, publicKey, tags);
  },
  Crypto,
  Util,
  PaymentToken
};

module.exports = Token;
