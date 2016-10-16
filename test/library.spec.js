import tokenIo from "../src";
const Token = new tokenIo(TEST_ENV);

import BankClient from "./sample/BankClient";

describe('Token library', () => {
    it("should perform a transfer flow", () => {
        var alias1 = Token.Crypto.generateKeys().keyId;
        var alias2 = Token.Crypto.generateKeys().keyId;

        // For testing push notifications
        var pushToken = '36f21423d991dfe63fc2e4b4177409d29141fd4bcbdb5bff202a10535581f97900';

        var member1 = {};
        var member2 = {};
        var account = {};
        var tokenId = "";

        var setUpMem1 = () => Token
                .createMember(alias1)
                .then(member => {
                    member1 = member;
                    return member1
                        .subscribeToNotifications(pushToken)
                        .then(() => BankClient.requestLinkAccounts(alias1, 100000, 'EUR'))
                        .then(alp => member1.linkAccounts("bank-id", alp))
                        .then(accounts => {
                            account = accounts[0];
                        });
                });

        var setUpMem2 = () => Token
                .createMember(alias2)
                .then(member => {
                    member2 = member;
                });

        var createAndEndorse = () => member1
                .createToken(account.id, 9.24, 'EUR', alias2)
                .then(token => {
                    tokenId = token.id;
                    return member1
                        .endorseToken(tokenId);
                });

        return setUpMem1()
            .then(setUpMem2)
            .then(createAndEndorse)
            .then(() => member2.createTransfer(tokenId, 5, 'EUR'))
            .then(() => member1.getTransfers(tokenId));
    });
});
