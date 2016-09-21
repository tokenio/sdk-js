import Member from "./Member";
import { generateKeys } from "./Crypto";

// Promise polyfill for IE and older browsers
require("es6-promise").polyfill();
const axios = require("axios");
const instance = axios.create({
 baseURL: 'http://localhost:8000'
});

class TokenIO {
  static createMember(alias) {
    console.log("Creating member");

    const keys = generateKeys();
    return instance({
      method: "post",
      url: "/members",
    }).then((response) => {
      return new Member(response.data.memberId, [], [keys]);
    }).catch((error) => {
      console.log("Error: ", error);
    });
  }
}

export default TokenIO;
