// const chai = require('chai');
// const assert = chai.assert;
//
// const Token = require('../../src');
// import Crypto from '../../src/Crypto';
// import BankClient from '../sample/BankClient';
//
// let member1 = {};
// let alias1 = '';
// let account1 = {};
//
// let member2 = {};
// let alias2 = '';
// let account2 = {};
//
// let token1 = {};
//
// // Set up a first member
// const setUp1 = () => {
//   alias1 = Crypto.generateKeys().keyId;
//   return Token.createMember(alias1)
//     .then(res => {
//       member1 = res;
//       return BankClient.requestLinkAccounts(alias1, 100000, 'EUR').then(alp => {
//         return member1.linkAccounts('bank-id', alp).then(accs => {
//           account1 = accs[0];
//         });
//       });
//     });
// };
//
// // Set up a second member
// const setUp2 = () => {
//   alias2 = Crypto.generateKeys().keyId;
//   return Token.createMember(alias2)
//     .then(res => {
//       member2 = res;
//       return BankClient.requestLinkAccounts(alias1, 100000, 'EUR').then(alp => {
//         return member2.linkAccounts('bank-id', alp).then(accs => {
//           account2 = accs[0];
//         });
//       });
//     });
// };
//
// // Set up an endorsed payment token
// const setUp3 = () => {
//   return account1.createToken(38.71, 'EUR', alias2).then(token => {
//     return account1.endorseToken(token.id).then(() => {
//       return account2.lookupToken(token.id).then(lookedUp => {
//         return account2.redeemToken(lookedUp, 10.21, 'EUR').then(payment => {
//           token1 = lookedUp;
//         });
//       });
//     });
//   });
// };
//
// describe('Tokens', () => {
//   beforeEach(() => {
//     return Promise.all([setUp1(), setUp2()])
//     .then(setUp3);
//   });
//
//   it('should see a transction', () => {
//     return account1.lookupTokens().then(payments => {
//       console.log("Payments", payments);
//       // assert.equal(payments.length, 1);
//       // assert.equal(payments[0], 1);
//     }).catch(err => console.log(err));
//   });
// });
