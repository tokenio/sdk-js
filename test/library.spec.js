let Token = {};
if (BROWSER) {
  Token = require('../dist/token-io');
} else {
  Token = require('../dist/token-io.node');
}

import BankClient from './sample/BankClient';

describe('Token library', () => {
  it("should perform a payment flow", () => {
    var alias1 = Token.Crypto.generateKeys().keyId;
    var alias2 = Token.Crypto.generateKeys().keyId;

    // For testing push notifications
    var pushToken = '36f21423d991dfe63fc2e4b4177409d29141fd4bcbdb5bff202a10535581f97900';

    var member1 = {};
    var member2 = {};
    var account1 = {};
    var account2 = {};
    var tokenId = "";

    var setUpMem1 = () =>
      Token.createMember(alias1)
      .then(member => {
        member1 = member;
        return member1.subscribeDevice(pushToken)
        .then(() => BankClient.requestLinkAccounts(alias1, 100000, 'EUR'))
        .then(alp => member1.linkAccounts("bank-id", alp))
        .then(accounts => {
          account1 = accounts[0];
        });
      });

    var setUpMem2 = () =>
      Token.createMember(alias2)
      .then(member => {
        member2 = member;
        BankClient.requestLinkAccounts(alias2, 100000, 'EUR')
        .then(alp => member2.linkAccounts("bank-id", alp));
      });

    var createAndEndorse = () =>
      member1.createPaymentToken(account1.id, 9.24, 'EUR', alias2)
      .then(token => {
        tokenId = token.id;
        return member1.endorsePaymentToken(tokenId);
      });

    return setUpMem1()
    .then(setUpMem2)
    .then(createAndEndorse)
    .then(() => member2.redeemPaymentToken(tokenId, 5, 'EUR'))
    .then(() => member1.lookupPayments(tokenId))
    .then(pmts => console.log("Payments:", pmts))
    .catch(any => console.log(any));
  });
});
