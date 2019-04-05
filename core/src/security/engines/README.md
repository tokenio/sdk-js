Crypto Engines
==============

This directory contains implementations of the "CryptoEngine interface,"
code that manages crypto keys.

+ `MemoryCryptoEngine` keeps keys in memory. It doesn't persist anything, and
  "forgets" keys on restart. It's handy for tests.
+ `UnsecuredFileCryptoEngine` keeps keys in files in a designated directory.
+ `BrowserCryptoEngine` keeps keys in a browser's `IndexedDB`.
+ `ManualCryptoEngine` always uses the same keys you manually specify.

They are described at
https://developer-beta.token.io/sdk/?javascript#local-key-storage

These classes implement methods inspired by the Java interface
https://github.com/tokenio/sdk-java/blob/master/lib/src/main/java/io/token/security/CryptoEngine.java .
If you want to manage crypto keys in a way that's not already implemented
here, you want to create your own ____CryptoEngine class.

If you want to create a CryptoEngine class similar to others but that
*stores* keys differently, then it's easiest to define a thin wrapper
around a `KeyStore` class. You can see examples of this here:
`MemoryCryptoEngine` wraps `MemoryKeyStore`;
`UnsecuredFileCryptoEngine` wraps `UnsecuredFileKeyStore`;
`BrowserCryptoEngine` wraps `BrowserKeyStore`.

KeyStore methods
================

A `KeyStore` handles saving and loading keys. A `KeyStoreCryptoEngine`
subclass can wrap a `KeyStore`. A KeyStore implements the methods

``` javascript

   /**
     * Store a member's keypair.
     *
     * @param {string} memberId - ID of member
     * @param {Object} keypair - keypair to store
     * @return {Object} keypair - same keypair
     */
    async put(memberId, keypair) { }

    /**
     * Look up a key by memberId and level.
     *
     * @param {string} memberId - ID of member
     * @param {string} level - "LOW", "STANDARD", or "PRIVILEGED"
     * @return {Object} keypair
     */
    async getByLevel(memberId, level) { }

    /**
     * Look up a key by memberId and keyId.
     *
     * @param {string} memberId - ID of member
     * @param {string} keyId - key ID
     * @return {Object} keypair
     */
    async getById(memberId, keyId) { }

    /**
     * Return list of member's keys.
     *
     * @param {string} memberId - ID of member
     * @return {Object} list of keys
     */
    async listKeys(memberId) { }

    /**
     * OPTIONAL:
     * Keep track of the ID of the most recently active member.
     *
     * @param {string} memberId - ID of member
     */
    static setActiveMemberId(memberId) { }

    /**
     * OPTIONAL:
     * Get the ID of the most recently active member.
     *
     * @return {string} ID of member
     */
    static getActiveMemberId() { }
```


CryptoEngine methods
====================

A CryptoEngine implements the methods

``` javascript

   /**
    * Constructs the engine, using an existing member/keys if it is in localStorage
    *
    * @param {string} memberId - memberId of the member we want to create the engine for
    */
   constructor(memberId) {}

   /**
     * Generates and stores a new keypair, replacing the corresponding
     * old key (with the same security level) if there was one.
     *
     * @param {string} securityLevel - security level of the key we want to create
     *                 "LOW" "STANDARD" "PRIVILEGED"
     * @return {Key} key - generated key
     */
   async generateKey(securityLevel) {
      // generate a keypair
      const keypair = await Token.Crypto.generateKeys(securityLevel);

      ...store keypair...

      delete keypair.privateKey; // we're about to return keypair, but want to omit privateKey
      return keypair;
    }

    /**
     * Creates a signer object using the key with the specified key level. This can sign
     * strings and JSON objects.
     *
     * @param {string} securityLevel - security level of the key we want to use to sign
     *                 "LOW" "STANDARD" "PRIVILEGED"
     * @return {Object} signer - signer object
     */
    async createSigner(securityLevel) {
        ...load keypair...
        if (keypair) {
          return Token.Crypto.createSignerFromKeyPair(keyPair);
        } else {
          throw new Error(`No key with level ${securityLevel} found`);
        }
    }

    /**
     * Creates a verifier object using the key with the specified ID. This can verify
     * signatures created by a signer.
     *
     * @param {string} keyId - ID of the key to use. It's OK if this "keypair" has no
     *                         privateKey field.
     * @return {Object} verifier - verifier object
     */
    async createVerifier(keyId) {
       ...load keypair...
       if (keypair) {
         return Token.Crypto.createVerifierFromKeyPair(keyPair);
       } else {
         throw new Error(`No key with ID ${keyId} found`);
       }
    }

    /**
     * Optional. BrowserCryptoEngine ("localStorage crypto engine") implements this;
     * this is how Token's Merchant Checkout "remembers" who the customer is.
     *
     * Get's the currently active memberId. This allows login without caching memberId somewhere
     *
     * @return {string} memberId - active memberId
     */
    getActiveMemberId() {}
```

Signer
======

`createSigner` returns an object that implements the "Signer interface".
That is, they implement methods inspired by the Java interface
https://github.com/tokenio/lib-security/blob/master/lib/src/main/java/io/token/security/Signer.java
The easiest way to create one is to call Token.Crypto.createSignerFromKeyPair(keyPair),
but if you want to make your own, implement the functions:

``` javascript

    /**
     * Return signature of the string
     * @param {string} message - string to sign
     * @return {string} signature - crypto signature of message
     */
    async sign(message) {
        return await Token.Crypto.sign(message, this._keypair);
    }

    /**
     * Return signature of the object, JSON-ified
     * @param {object} json - object to sign
     * @return {string} signature - crypto signature of the JSONified structure
     */
    async signJson(json) {
        // stringify = require('fast-json-stable-stringify')
        return await Token.Crypto.sign(stringify(message), this._keypair);
    }

    /**
     * Return ID of key used for signing.
     * @return {string} keyId - key ID
     */
    getKeyId() {
        return this._keypair.id;
    }
```

Verifier
========

`createVerifier` returns an object that implements the "Verifier interface".
That is, they implement methods inspired by the Java interface
https://github.com/tokenio/lib-security/blob/master/lib/src/main/java/io/token/security/Verifier.java
The easiest way to create one is to call Token.Crypto.createVerifierFromKeyPair(keyPair),
but if you want to make your own, implement the functions:

``` javascript
   /**
     * Verify the signature goes with the passed message string.
     * @param {string} message - message that was signed
     * @param {string} signature - crypto signature
     * @return {boolean} is signature OK
     */
    async verify(message, signature) {
        return await Token.Crypto.verify(message, signature, this._keypair.publicKey);
    }
    /**
     * Verify the signature goes with the passed structure
     * @param {Object} json - Object that was signed
     * @param {string} signature - crypto signature
     * @return {boolean} is signature OK
     */
    async verifyJson: (json, signature) => {
        return await Token.Crypto.verifyJson(json, signature, this._keypair.publicKey);
    }
```
    