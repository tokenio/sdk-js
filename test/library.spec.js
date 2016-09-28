// const chai = require('chai');
// let Token = {};
// if (BROWSER) {
//   Token = require('../dist/token-io');
// } else {
//   Token = require('../dist/token-io.node');
// }
// const assert = chai.assert;
//
// describe('Token library', () => {
//   it("should create a member from scratch", () => {
//     const randomAlias = Token.Crypto.generateKeys().keyId;
//
//     return Token.createMember(randomAlias)
//     .then(member => {
//       assert.isOk(member);
//       assert.isString(member.id);
//       assert.isAbove(member.id.length, 1);
//     });
//   });
// });
