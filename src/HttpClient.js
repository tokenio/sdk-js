import { sign, strKey } from "./Crypto";

// Promise polyfill for IE and older browsers
require("es6-promise").polyfill();
const axios = require("axios");
const instance = axios.create({
 baseURL: 'http://localhost:8000'
});


class HttpClient {
  static createMemberId() {
    return instance({
      method: "post",
      url: "/members",
    });
  }

  static addFirstKey(keys, memberId, level=0, tags=[]) {
    const update = {
      prev_hash: '',
      member_id: memberId,
      add_key: {
        public_key: strKey(keys.publicKey),
        level,
        tags,
      },
    };
    const req = {
      update,
      signature: {
        key_id: keys.keyId,
        signature: sign(JSON.stringify(update), keys),
        timestamp_ms: new Date().getTime(),
      }
    }
    return instance({
      method: "post",
      url: `/members/${memberId}`,
      data: req,
    }).then((res) => {
      console.log("Response:", res);
    }).catch((err) => {
      console.log("Error:", err);
    })
  }
}

export default HttpClient;
