var TokenIo = require("../dist/token-io.node.js");
var Token = new TokenIo("local");
var axios = require("axios");


// Define your device push token here
var pushToken = '268B10F95C3EEFF862B5E1E2215E9B2557FBFE7919F4730440F244EDC51169A1';

// And choose the type of notification at the bottom



var username1 = Token.Crypto.generateKeys().keyId;
var username2 = Token.Crypto.generateKeys().keyId;
var member1 = {};
var member2 = {};
var account1 = {};
var accountsLinkPayload = Token.Util.generateNonce();

const instance = axios.create({
    baseURL: "http://prd.api.token.io:81"
});

var requestLinkAccounts = (
    username,
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
                    username: username1,
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
        .createMember(username1)
        .then(res => {
            member1 = res;
            return requestLinkAccounts(username1, 100000, 'EUR')
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
    username2 = Token.Crypto.generateKeys().keyId;
    return Token
        .createMember(username2)
        .then(member => {
            member2 = member;
        });
};

var notifyLinkAccounts = () => {
    return setUp1().then(() => {
        Token.notifyLinkAccounts(username1, 'bank-id', 'bank-name', accountsLinkPayload);
    });
};

var notifyAddKey = () => {
    var keys = Token.Crypto.generateKeys();
    return setUp1().then(() => {
        Token.notifyAddKey(username1, keys.publicKey, "Chrome 53.0");
    });
};

var notifyBoth = () => {
    var keys = Token.Crypto.generateKeys();
    return setUp1().then(() => {
        Token.notifyLinkAccountsAndAddKey(
            username1,
            'bank-id',
            'bank-name',
            accountsLinkPayload,
            keys.publicKey,
            "Chrome 53.0");
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
                        .loginWithUsername(keys, username1)
                        .then(memberNew => {
                            return memberNew
                                .createToken(account1.id, 900.24, "EUR", username2)
                                .then(token => memberNew.endorseToken(token.id));
                        });
                });
        })
        .catch(() => {});
};
var transferProcessed = () => {
    return setUp1()
        .then(() => setUp2())
        .then(() => {
            return member1.createToken(account1.id, 38.71, 'EUR', username2).then(token => {
                return member1.endorseToken(token.id).then(() => {
                    return member2.getToken(token.id).then(lookedUp => {
                        return member2.createTransfer(lookedUp, 10.21, 'EUR');
                    });
                });
            });
        });
}


// notifyLinkAccounts();
// notifyAddKey();
// notifyBoth();
stepUp();
// transferProcessed();

// Do only one at a time! race conditions :)
