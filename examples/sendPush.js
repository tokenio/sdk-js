var Token = require("./dist/token-io.node.js");

var alias = Token.Crypto.generateKeys().keyId;
var pushToken = '0ECA0A78592EC9BA1290147A81BB88C8292D1F38772EABA8E528A656318534D9';
var accountLinkPayload = 'eyJhY2NvdW50cyI6W3siYWNjb3VudE51bWJlciI6IlR6N3Jubkl' +
  'pd1FEcU9lVi0iLCJuYW1lIjoiMTIzIn1dLCJhbGlhcyI6Ik1NWXhCZTdISU9RTUM3S2oifQ==';

var setUp = () =>
  Token.createMember(alias).then(member =>
  member.subscribeDevice(pushToken));

var notifyLinkAccounts = () => {
  setUp().then(() => {
    Token.notifyLinkAccounts(alias, 'bank-id', accountLinkPayload);
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
    Token.notifyLinkAccountsAndAddKey(alias, 'bank-id', accountLinkPayload,
      keys.publicKey, ["tag1"]);
  });
};

// notifyLinkAccounts();
// notifyAddKey();
notifyBoth();
