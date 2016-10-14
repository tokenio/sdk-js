var Token = require("../dist/token-io.node.js");
var axios = require("axios");


// Define your device push token here
var pushToken = '8E8E256A58DE0F62F4A427202DF8CB07C6BD644AFFE93210BC49B8E5F9402554';

// And choose the type of notification at the bottom



var alias1 = Token.Crypto.generateKeys().keyId;
var alias2 = Token.Crypto.generateKeys().keyId;
var member1 = {};
var member2 = {};
var account1 = {};
var accountsLinkPayload = Token.Util.generateNonce();

const instance = axios.create({
    baseURL: "http://prd.api.token.io:81"
});

var requestLinkAccounts = (
    alias,
    balance = 100000,
    currency = "EUR",
    accountName = "123") => {
    const randLastName = Token.Util.generateNonce();
    const randomAccNumber = Token.Util.generateNonce();

    return instance(
        {
            method: 'put',
            url: `/clients`,
            data: {
                firstName: "JS Test",
                lastName: "JS Testoff " + randLastName
            }
        })
        .then(res => res.data.client)
        .then(client => {
            return instance(
                    {
                    method: 'put',
                    url: `/clients/${client.id}/accounts`,
                    data: {
                        name: accountName,
                        account_number: randomAccNumber,
                        balance: {
                            value: balance,
                            currency: currency
                        }
                    }
                })
                .then(ignored => client);
        })
        .then(client => {
            return instance({
                method: 'put',
                url: `/clients/${client.id}/link-accounts`,
                data: {
                    alias: alias1,
                    secret: "",
                    accounts: [randomAccNumber]
                }
            });
         })
         .then(res => res.data.accountsLinkPayload);
};

// Set up a first member
const setUp1 = () => {
    return Token
        .createMember(alias1)
        .then(res => {
            member1 = res;
            return requestLinkAccounts(alias1, 100000, 'EUR')
                .then(alp => {
                    return member1
                        .linkAccounts('bank-id', alp)
                        .then(accs => {
                            account1 = accs[0];
                            return member1.subscribeToNotifications(pushToken);
                        });
                });
        });
};

// Set up a second member
const setUp2 = () => {
    alias2 = Token.Crypto.generateKeys().keyId;
    return Token
        .createMember(alias2)
        .then(member => {
            member2 = member;
        });
};

var notifyLinkAccounts = () => {
    return setUp1().then(() => {
        Token.notifyLinkAccounts(alias1, 'bank-id', accountsLinkPayload);
    });
};

var notifyAddKey = () => {
    var keys = Token.Crypto.generateKeys();
    return setUp1().then(() => {
        Token.notifyAddKey(alias1, keys.publicKey, "Chrome 53.0");
    });
};

var notifyBoth = () => {
    var keys = Token.Crypto.generateKeys();
    return setUp1().then(() => {
        Token.notifyLinkAccountsAndAddKey(alias1, 'bank-id', accountsLinkPayload,
            keys.publicKey, "Chrome 53.0");
    });
};

var stepUp = () => {
    var keys = Token.Crypto.generateKeys();
    return setUp1()
        .then(() => setUp2())
        .then(() => {
            member1
                .approveKey(Token.Crypto.strKey(keys.publicKey), "LOW")
                .then(() => {
                    return Token
                        .loginWithAlias(keys, alias1)
                        .then(memberNew => {
                            return memberNew
                                .createTransferToken(account1.id, 900.24, "EUR", alias2)
                                .then(token => memberNew.endorseTransferToken(token.id));
                        });
                });
        })
        .catch(() => {});
};
var transferProcessed = () => {
    return setUp1()
        .then(() => setUp2())
        .then(() => {
            return member1.createTransferToken(account1.id, 38.71, 'EUR', alias2).then(token => {
                return member1.endorseTransferToken(token.id).then(() => {
                    return member2.getTransferToken(token.id).then(lookedUp => {
                        return member2.redeemTransferToken(lookedUp, 10.21, 'EUR');
                    });
                });
            });
        });
}


// notifyLinkAccounts();
// notifyAddKey();
// notifyBoth();
stepUp();
// transferProcessed().catch(err => console.log(err));

// Do only one at a time! race conditions :)
