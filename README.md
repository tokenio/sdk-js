# Token-io SDK

A javascript SDK for interacting with the Token System. Visit Token at http://token.io.

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
Note that information token support has not yet been added to this sdk.

#### Token
```
static Token.createMember(alias) => Promise(Member)
static Token.loginMember(memberId, keys) => Member
static Token.loginMemberFromLocalStorage() => Member
static Token.getMember(keys, alias) => Promise(Member)
static Token.requestLinkAccounts(alias) => Promise(accountAuthorizationPayload)
static Token.notifyAddKey(alias, publicKey) => Promise()
static Token.notifyLinkAccounts(alias, bankCode, accountLinkPayload) => Promise()
static Token.notifyLinkAccountsAndAddKey(alias, bankCode, accountLinkPayload)
  => Promise()
```

#### Member
```
member.saveToLocalStorage() => void
member.approveKey(publicKey, level=0, tags=[])
  => Promise()
member.removeKey(keyId)
  => Promise()
member.addAlias(alias) => Promise()
member.removeAlias(alias) => Promise()
member.linkAccounts(bankId, accountLinkPayload)
  => Promise(Account[])
member.lookupAccounts() => Promise(Account[])
member.subscribeDevice(notificationUri, provider=“Token”,
     platform=“IOS”, tags=[]) =>  Promise()
member.getAllAliases() => Promise(string[])
member.getPublicKeys() => Promise(key[])
member.createAddress(name, address) => Promise()
member.getAddresses() => Promise(Address[])
member.createPaymentToken(amount, currency, alias, description)
  => Promise(PaymentToken)
member.lookupPaymentToken(tokenId) => Promise(PaymentToken)
member.lookupPaymentTokens() => Promise(PaymentToken[])
member.endorsePaymentToken(token or tokenId) => Promise()
member.cancelPaymentToken(token or tokenId) => Promise()
member.redeemPaymentToken(tokenId, amount, currency) => Promise(Payment)
member.lookupPayment(paymentId) => Promise(Payment)
member.lookupPayments() => Promise(Payment[])
member.id => memberid
member.keys => keys
```

#### Account
```
(X) account.setAccountName(name) => Promise()
account.lookupBalance() => Promise(balance)
account.lookupTransactions() => Promise(Transaction[])
```
#### Crypto
```
Token.Crypto.generateKeys() => keys
Token.Crypto.signJson(json, keys) => signature
Token.Crypto.sign(message, keys) => signature
Token.Crypto.strKey(Buffer key) => str key
Token.Crypto.bufferKey(str key) => Buffer key
```

#### Util
```
Token.Util.generateNonce() => nonce
```


#### PaymentToken
```
token.json => Json representation of token
token.id => token id
token.payer => payer
token.transfer => transfer
token.amount => amount
token.currency => currency
token.redeemer => redeemer
token.description => description
token.version => version
token.issuer => issuer
token.nonce => nonce
token.signatures => signatures
```
### Payment
```
payment.id => payment Id;
payment.referenceId => reference Id;
payment.payload => payload
payment.amount => amount
payment.currency => currency
payment.transfer => transfer
payment.signatures => signatures
```

## Sales Demo

### Bank
* ```Token.requestLinkAccounts(alias)```
* ```Token.notifyLinkAccountsAndAddKey(alias, bank-id, accountLinkPayload, publicKey, tags)```
* ```Token.getMember(keys, alias)``` (loop, for seeing if we’re authenticated)
* ```member.saveToLocalStorage()```

### Merchant
* ```Token.loginMemberFromLocalStorage()```
* If fails:
* ```member.notifyAddKey(alias, publicKey)```


* ```Token.getMember(keys, alias)``` (loop, for seeing if we’re authenticated)
* ```member.lookupAccounts()```
* ```member.lookupAddresses()```
* ```member.createPaymentToken(accountId, amount, currency)```
* ```member.endorsePaymentToken(token)```
* If fails:
* ```member.getTokens()``` (until you find the correct endorsed token)


* Either way: return tokenID to merchant, who does:
* ```member.redeemPaymentToken(token, 15, ‘EUR’)```

### AISP (Backend still in progress)
* ```Token.loginMemberFromLocalStorage()```
* If fails:
* ```member.notifyAddKey(alias, publicKey)```
* ```Token.getMember(keys, alias)``` (loop, for seeing if we’re authenticated)
* ```member.getAddresses()```
* ```member.lookupAccounts()```
* ```member.createPaymentToken(acl list...)```
* ```member.endorsePaymentToken(token)```
* If fails:
* ```member.getTokens(until you find the correct endorsed token)```

* Either way: return tokenID to AISP, who does:
* ```account.redeemPaymentToken(token, ‘transactions’)```
