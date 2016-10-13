var Token = require("../dist/token-io.node.js");

var alias = Token.Crypto.generateKeys().keyId;
var pushToken = '8E8E256A58DE0F62F4A427202DF8CB07C6BD644AFFE93210BC49B8E5F9402554';
var accountsLinkPayload = 'eyJhY2NvdW50cyI6W3siYWNjb3VudE51bWJlciI6IlR6N3Jubkl' +
    'pd1FEcU9lVi0iLCJuYW1lIjoiMTIzIn1dLCJhbGlhcyI6Ik1NWXhCZTdISU9RTUM3S2oifQ==';

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
