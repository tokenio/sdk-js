import Member from './Member';
import Crypto from '../Crypto';
import Util from '../Util';
import LocalStorage from '../LocalStorage';
import PaymentToken from './PaymentToken';
import HttpClient from '../http/HttpClient';

class TokenIO {

  static createMember(alias) {
    const keys = Crypto.generateKeys();
    return HttpClient.createMemberId()
    .then(response => HttpClient.addFirstKey(keys, response.data.memberId)
      .then(() => {
        const member = new Member(response.data.memberId, keys);
        return member.addAlias(alias)
        .then(() => member);
      })
    );
  }

  static loginMember(memberId, keys) {
    return new Member(memberId, keys);
  }

  static loginMemberFromLocalStorage() {
    return LocalStorage.loadMember();
  }
}

TokenIO.Crypto = Crypto;
TokenIO.Util = Util;
TokenIO.PaymentToken = PaymentToken;

export default TokenIO;
