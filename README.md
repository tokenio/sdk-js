# Token-io SDK

### Installation

Dillinger requires a recent version of npm to run.

Install the npm package:

```sh
$ npm install token-io
```

To use in a browser:

```sh
$ var Token = require("token-io")
```

Works in a node as well, but have to directly require the node file from dist.

To build:
```sh
$ npm run build
```

To test in the browser:
```sh
$ npm run testBrowser
```

To test in node:
```sh
$ npm run testNode
```

### API

#### Token
```
static Token.createMember(alias) => Promise(Member)
static Token.loginMember(memberId, keys) => Member
static Token.loginMemberFromLocalStorage() => Member
```

#### Member(id, keys)
```
member.approveKey(publicKey, level=0, tags=[])
  => Promise()
member.removeKey(	keyId)
  => Promise()
member.addAlias(alias) => Promise()
member.removeAlias(alias) => Promise()
member.linkAccounts(bankId, accountLinkPayload)
  => Promise(Accounts)
member.lookupAccounts() => Promise(Accounts)
(X) member.subscribeDevice(notificationUri, provider=“Token”,
     platform=“IOS”, tags=[]) =>  Promise()
(X) member.notifyAddKey(alias, publicKey) => Promise()
(X) member.notifyLinkBank(alias, bankCode, accountLinkPayload) => Promise()
member.getAllAliases() => Promise(aliases)
member.getFirstAlias() => Promise(alias)
member.getPublicKeys() => Promise(keys)
member.saveToLocalStorage() => void
(X) member.isActive() => Promise()
(X) member.createAddress() => Promise()
(X) member.getAddresses() => Promise(addresses)
```

#### Account
```
(X) account.setAccountName(name) => Promise()
account.createToken(amount, currency, alias, description)
  => Promise(PaymentToken)
account.createTokenFromPayload(PaymentToken)
  => Promise(PaymentToken)
account.lookupToken(tokenId)
(X) account.lookupTokens()
(X) account.endorseToken(token)
(X) account.declineToken(token)
(X) account.revokeToken(token)
(X) account.redeemToken(tokenId, amount, currency)
(X) account.redeemToken(tokenId, 'transactions')
```

#### PaymentToken
```
static PaymentToken.create(member, account, amount, currency, alias, description)
    => PaymentToken
token.json => Json representation of token
```
