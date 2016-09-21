import Member from "./Member";
import { generateKeys } from "./Crypto";
import HttpClient from "./HttpClient";


class TokenIO {
  static createMember(alias) {
    console.log("Creating member");

    const keys = generateKeys();
    return HttpClient.createMemberId()
    .then((response) => {
      HttpClient.addFirstKey(keys, response.data.memberId);
      return new Member(response.data.memberId, [], [keys]);
    }).catch((error) => {
      console.log("Error: ", error);
    });
  }
}

export default TokenIO;
