var Token = require("../dist/token-io.node.js");

var alias = Token.Crypto.generateKeys().keyId;
var pushToken = '36f21423d991dfe63fc2e4b4177409d29141fd4bcbdb5bff202a10535581f979';
var accountsLinkPayload = 'eyJhY2NvdW50cyI6W3siYWNjb3VudE51bWJlciI6IlR6N3Jubkl' +
  'pd1FEcU9lVi0iLCJuYW1lIjoiMTIzIn1dLCJhbGlhcyI6Ik1NWXhCZTdISU9RTUM3S2oifQ==';

var setUp = () =>
  Token.createMember(alias).then(member =>
  member.subscribeDevice(pushToken));

var notifyLinkAccounts = () => {
  setUp().then(() => {
    Token.notifyLinkAccounts(alias, 'bank-id', accountsLinkPayload);
  });
};

var notifyAddKey = () => {
  var keys = Token.Crypto.generateKeys();
  setUp().then(() => {
    Token.notifyAddKey(alias, keys.publicKey, ["tag1"]);
  });
};

var notifyBoth = () => {
  var keys = Token.Crypto.generateKeys();
  setUp().then(() => {
    Token.notifyLinkAccountsAndAddKey(alias, 'bank-id', accountsLinkPayload,
      keys.publicKey, ["tag1"]);
  });
};

// notifyLinkAccounts();
// notifyAddKey();
notifyBoth();
