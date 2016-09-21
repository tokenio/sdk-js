import { sign, strKey } from "./Crypto";

var gatewayPb = require('./compiled/gateway_pb');
var memberPb = require('./compiled/member_pb');
var securityPb = require('./compiled/security_pb');


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
    const req = new gatewayPb.UpdateMemberRequest();
    const update = new memberPb.MemberUpdate();
    const signature = new securityPb.Signature();
    const operation = new memberPb.MemberAddKeyOperation();
    operation.setPublicKey(strKey(keys.publicKey));
    operation.setLevel(level);
    operation.setTagsList(tags);
    update.setPrevHash("");
    update.setMemberId(memberId);
    update.setAddKey(operation);
    signature.setKeyId(keys.keyId);
    signature.setSignature(sign(JSON.stringify(update), keys));
    signature.setTimestampMs(new Date().getTime());
    req.setUpdate(update);
    req.setSignature(signature);

    console.log("Str:", req.toString());
    console.log("Bytes:", req.serializeBinary().buffer.byteLength);

    return instance({
      method: "post",
      url: `/members/${memberId}`,
      data: req.serializeBinary().buffer,
    }).then((res) => {
      console.log("Response:", res);
    }).catch((err) => {
      console.log("Error:", err);
    })
  }
}

export default HttpClient;
