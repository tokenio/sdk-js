import Member from './Member';
import Crypto from '../Crypto';
import HttpClient from '../http/HttpClient';

class TokenIO {
  static createMember(alias) {
    const keys = Crypto.generateKeys();
    return HttpClient.createMemberId()
    .then((response) => {
      HttpClient.addFirstKey(keys, response.data.memberId);
      return new Member(response.data.memberId, [], [keys]);
    });
  }
}

export default TokenIO;
