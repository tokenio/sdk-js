var Token = require("../dist/token-io.node.js");
var axios = require("axios");

var alias = Token.Crypto.generateKeys().keyId;
var pushToken = '8E8E256A58DE0F62F4A427202DF8CB07C6BD644AFFE93210BC49B8E5F9402554';
var accountsLinkPayload = 'eyJhY2NvdW50cyI6W3siYWNjb3VudE51bWJlciI6IlR6N3Jubkl' +
    'pd1FEcU9lVi0iLCJuYW1lIjoiMTIzIn1dLCJhbGlhcyI6Ik1NWXhCZTdISU9RTUM3S2oifQ==';

const instance = axios.create({
    baseURL: "http://prd.api.token.io:81";
});


var requestLinkAccounts =  (
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
                    lastName: "JS Testoff " + randLastName,
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
                        alias,
                        secret: "",
                        accounts: [ randomAccNumber ]
                    }
                });
             })
             .then(res => res.data.accountsLinkPayload);
    }

var setUp = () =>
    Token.createMember(alias).then(member =>
        member.subscribeToNotifications(pushToken));

var notifyLinkAccounts = () => {
    setUp().then(() => {
        Token.notifyLinkAccounts(alias, 'bank-id', accountsLinkPayload);
    });
};

var notifyAddKey = () => {
    var keys = Token.Crypto.generateKeys();
    setUp().then(() => {
        Token.notifyAddKey(alias, keys.publicKey, "Chrome 53.0");
    });
};

var notifyBoth = () => {
    var keys = Token.Crypto.generateKeys();
    setUp().then(() => {
        Token.notifyLinkAccountsAndAddKey(alias, 'bank-id', accountsLinkPayload,
            keys.publicKey, "Chrome 53.0");
    });
};

// notifyLinkAccounts();
// notifyAddKey();
notifyBoth();
