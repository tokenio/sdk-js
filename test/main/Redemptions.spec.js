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
//         token1 = lookedUp;
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
//   it('should redeem a basic token', () => {
//     return account2.redeemToken(token1, 10.21, 'EUR').then(payment => {
//       assert.equal(10.21, payment.amount);
//       assert.equal('EUR', payment.currency);
//       assert.isAtLeast(payment.signatures.length, 1);
//     });
//   });
//   it('should redeem a basic token by id', () => {
//     return account2.redeemToken(token1.id, 15.28, 'EUR').then(payment => {
//       assert.equal(15.28, payment.amount);
//       assert.equal('EUR', payment.currency);
//       assert.isAtLeast(payment.signatures.length, 1);
//     });
//   });
//   it('should fail if redeem amount is too high', done => {
//     account2.redeemToken(token1.id, 1242.28, 'EUR').then(payment => {
//       done(new Error("should fail"));
//     })
//     .catch(() => done());
//   });
//
//   it('should fail if redeemer is wrong', done => {
//     account1.redeemToken(token1.id, 10.28, 'EUR').then(payment => {
//       done(new Error("should fail"));
//     })
//     .catch(() => done());
//   });
//   it('should fail if wrong currency', done => {
//     account1.redeemToken(token1.id, 10.28, 'USD').then(payment => {
//       done(new Error("should fail"));
//     })
//     .catch(() => done());
//   });
// });
