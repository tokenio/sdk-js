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
static Token.requestLinkAccounts(alias) => Promise(accountAuthorizationPayload)
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


## Sales Demo

### Bank
* ```Token.requestLinkAccounts(alias)```
* ```member.notifyAddKey (alias, publicKey)```
* ```member.isActive()```
* ```member.notifyLinkAccounts(alias, bank-id, accountsPayload)```
* ```member.persistInLocalStorage()```

### Merchant
* ```Token.loginMemberFromLocalStorage()```
* If fails:
* ```member.notifyAddKey(alias, publicKey)```


* ```member.isActive()```
* ```member.lookupAccounts()```
* ```account.createToken(amount, currency)```
* If fails:
* ```account.getTokens()``` (until you find the rightcorrect endorsed token)
* If succeeds:
* ```account.endorseToken(tokenId)```


* Either way: return tokenID to merchant, who does:
* ```account.redeemToken(token, 15, ‘USD’)```

### AISP (Backend still in progres) 
* ```Token.loginMemberFromLocalStorage()```
* If fails:
* ```member.notifyAddKey(alias, publicKey)```
* ```member.isActive()```(for seeing if we’re authenticated)
* ```member.getAddresses()```
* ```member.lookupAccounts()```
* ```account.createToken(acl list...)```
* If fails:
* ```getTokens(until you find the correct endorsed token)```
* If succeeds:
* ```endorseToken(tokenId)```


* Either way: return tokenID to merchant, who does:
* ```account.redeemToken(token, ‘transactions’)```
