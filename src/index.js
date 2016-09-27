import Crypto from './Crypto';
import Util from './Util';
import PaymentToken from './main/PaymentToken';
import Member from './main/Member';
import LocalStorage from './LocalStorage';
import HttpClient from './http/HttpClient';

// Promise polyfill for IE and older browsers
require('es6-promise').polyfill();

const Token = {
  createMember: alias => {
    const keys = Crypto.generateKeys();
    return HttpClient.createMemberId()
    .then(response => HttpClient.addFirstKey(keys, response.data.memberId)
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
  Crypto,
  Util,
  PaymentToken
};

module.exports = Token;
