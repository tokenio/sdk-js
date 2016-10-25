# Token-io SDK  (Readme may not up to date, view source)

A javascript SDK for interacting with the Token System. Visit Token at http://token.io.

### Installation

Token requires a recent version of npm to build.

Install the npm package:

```sh
$ npm install token-io
```

To use in a browser:

```sh
$ var tokenIo = require("token-io");
$ var Token = tokenIo(env = "prd");
```


Works in a node as well, but have to directly require the node file from token-io/dist.
Minified files available in dist as well.

To build:
```sh
$ yarn run build
```

To test in the browser:
```sh
$ yarn run testBrowserStg
```

To test in node:
```sh
$ yarn run testNodeStg
```

To update the version
```sh
$ npm version patch
```

Make sure to update the version before pushing a change

### API

#### Token
```
static Token.usernameExists(username) => Promise(boolean)
static Token.createMember(username) => Promise(Member)
static Token.loginMember(memberId, keys) => Promise(Member)
static Token.loginFromLocalStorage() => Promise(Member)
static Token.loginWithUsername(keys, username) => Promise(Member)
static Token.notifyAddKey(username, publicKey, name="") => Promise()
static Token.notifyLinkAccounts(username, bankCode, accountsLinkPayload) => Promise()
static Token.notifyLinkAccountsAndAddKey(username, bankCode, accountsLinkPayload, publicKey, name="")
  => Promise()
```

#### Member
```
member.saveToLocalStorage() => void
member.approveKey(publicKey, level="PRIVILEGED")
  => Promise()
member.removeKey(keyId)
  => Promise()
member.addUsername(username) => Promise()
member.removeUsername(username) => Promise()
member.linkAccounts(bankId, accountsLinkPayload)
  => Promise(Account[])
member.getAccounts() => Promise(Account[])
member.subscribeToNotifications(notificationUri, platform=“IOS”) =>  Promise(Subscriber)
member.getSubscribers() =>  Promise(Subscriber [])
member.getSubscriber(subscriberId) =>  Promise(Subscriber)
member.unsubscribeFromNotifications(subscriberId) =>  Promise()
member.getAllUsernames() => Promise(string[])
member.getPublicKeys() => Promise(key[])
member.addAddress(name, address) => Promise()
member.getAddresses() => Promise(Address[])
member.createTransferToken(amount, currency, username, description)
  => Promise(TransferToken)
member.getTransferToken(tokenId) => Promise(TransferToken)
member.getTransferTokens() => Promise(TransferToken[])
member.endorseTransferToken(token or tokenId) => Promise()
member.cancelTransferToken(token or tokenId) => Promise()
member.redeemTransferToken(tokenId, amount, currency) => Promise(Transfer)
member.getTransfer(transferId) => Promise(Transfer)
member.getTransfers() => Promise(Transfer[])
member.id => memberid
member.keys => keys
```

#### Account
```
account.setAccountName(name) => Promise()
account.getBalance() => Promise(balance)
account.getTransactions() => Promise(Transaction[])
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

#### KeyLevel
```
// Used for setting key security level, probably use standard or low for browsers
Token.KeyLevel.PRIVILEGED => string
Token.KeyLevel.STANDARD => string  
Token.KeyLevel.LOW => string
```

#### TransferToken
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
token.payloadSignatures => signatures
```
### Transfer
```
transfer.id => transfer Id;
transfer.referenceId => reference Id;
transfer.payload => payload
transfer.amount => amount
transfer.currency => currency
transfer.transfer => transfer
transfer.payloadSignatures => signatures
```

## Sales Demo

### Bank
* ```Token.requestLinkAccounts(username, accountsLinkPayload)```
* ```Token.notifyLinkAccountsAndAddKey(username, bank-id, accountsLinkPayload, publicKey, name)```
* ```Token.loginWithUsername(keys, username)``` (loop, for seeing if we’re authenticated)
* ```member.saveToLocalStorage()```

### Merchant
* ```Token.loginFromLocalStorage()```

If fails:
* ```member.notifyAddKey(username, publicKey)```

Then
* ```Token.loginWithUsername(keys, username)``` (loop, for seeing if we’re authenticated)
* ```member.getAccounts()```
* ```member.getAddresses()```
* ```member.createTransferToken(accountId, amount, currency)```
* ```member.endorseTransferToken(token)```

If fails:
* ```member.getTokens()``` (until you find the correct endorsed token)


Either way: return tokenID to merchant, who does:
* ```member.redeemTransferToken(token, 15, ‘EUR’)```

### AISP (Backend still in progress)
* ```Token.loginFromLocalStorage()```

If fails:
* ```member.notifyAddKey(username, publicKey)```

Then
* ```Token.loginWithUsername(keys, username)``` (loop, for seeing if we’re authenticated)
* ```member.createAccessToken(acl list...)```
* ```member.endorseAccessToken(token)```

Return tokenID to AISP, who does:
* ```account.redeemTransferToken(token, ‘transactions’)```
