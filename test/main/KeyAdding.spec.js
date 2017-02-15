// const chai = require('chai');
// const assert = chai.assert;
// import 'babel-regenerator-runtime';
//
// const tokenIo = require('../../src');
// const Token = new tokenIo(TEST_ENV);
// import Crypto from "../../src/security/Crypto";
//
// let member = {};
// let username = '';
//
// describe('Key addition detection', () => {
//
//     beforeEach(async () => {
//         const keys = Crypto.generateKeys();
//         username = Token.Util.generateNonce();
//         member = await Token.createMember(username, Token.MemoryCryptoEngine);
//         await member.approveKey(keys);
//     });
//
//     it('should not have access before being added', async () => {
//         const deviceInfo = await Token.provisionDeviceLow(username, Token.MemoryCryptoEngine);
//         try {
//             const memberNew = await Token.login(Token.MemoryCryptoEngine, deviceInfo.memberId);
//             await memberNew.keys();
//             return Promise.reject(new Error("should fail"));
//         } catch (err) {
//             console.log(err.message);
//             return;
//         }
//     });
//
//     it('should have access after being added', async () => {
//         const deviceInfo = await Token.provisionDeviceLow(username, Token.MemoryCryptoEngine);
//         await member.approveKey(deviceInfo.keys[0]);
//         const memberNew = await Token.login(Token.MemoryCryptoEngine, deviceInfo.memberId);
//         await memberNew.keys();
//     });
// });
