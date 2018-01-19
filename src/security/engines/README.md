CryptoEngines
=============

This directory contains implementations of the "CryptoEngine interface."
That is, they are classes that implement methods inspired by the Java interface
https://github.com/tokenio/sdk-java/blob/master/lib/src/main/java/io/token/security/CryptoEngine.java .
If you want to store members' crypto keys in a way that's not already implemented
here, you want to create your own ____CryptoEngine class.
As described below, to generate and use those keys, the class can use Token.Crypto functions.

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
   generateKey(securityLevel) {
      // generate a keypair
      const keypair = Token.Crypto.generateKeys(securityLevel);

      ...store keypair...

      delete keypair.secretKey; // we're about to return keypair, but want to omit secretKey
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
          return Token.Crypto.createSignerFromKeypair(keypair);
        } else {
          throw new Error(`No key with level ${securityLevel} found`);
        }
    }

    /**
     * Creates a verifier object using the key with the specified ID. This can verify
     * signatures created by a signer.
     *
     * @param {string} keyId - ID of the key to use. It's OK if this "keypair" has no
     *                         secretKey field.
     * @return {Object} verifier - verifier object
     */
    async createVerifier(keyId) {
       ...load keypair...
       if (keypair) {
         return Token.Crypto.createVerifierFromKeypair(keypair);
       } else {
         throw new Error(`No key with id ${keyId} found`);
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

Signer: createSigner returns an object that implements the "Signer interface".
That is, they implement methods inspired by the Java interface
https://github.com/tokenio/lib-security/blob/master/lib/src/main/java/io/token/security/Signer.java
The easiest way to create one is to call Token.Crypto.createSignerFromKeypair(keypair),
but if you want to make your own, implement the functions:

    /**
     * Return signature of the string
     * @param {string} message - string to sign
     * @return {string} signature - crypto signature of message
     */
    sign(message) {
        return Token.Crypto.sign(message, this._keypair);
    }

    /**
     * Return signature of the object, JSON-ified
     * @param {object} json - object to sign
     * @return {string} signature - crypto signature of the JSONified structure
     */
    signJson(json) {
        // stringify = require('json-stable-stringify')
        return Token.Crypto.sign(stringify(message), this._keypair);
    }

    /**
     * Return id of key used for signing.
     * @return {string} keyId - key ID
     */
    getKeyId() {
        return this._keypair.id;
    }

Verifier: createVerifier returns an object that implements the "Verifier interface".
That is, they implement methods inspired by the Java interface
https://github.com/tokenio/lib-security/blob/master/lib/src/main/java/io/token/security/Verifier.java
The easiest way to create one is to call Token.Crypto.createVerifierFromKeypair(keypair),
but if you want to make your own, implement the functions:

    /**
     * Verify the signature goes with the passed message string.
     * @param {string} message - message that was signed
     * @param {string} signature - crypto signature
     * @return {boolean} is signature OK
     */
    verify(message, signature) {
        return Token.Crypto.verify(message, signature, this._keypair.publicKey);
    }
    /**
     * Verify the signature goes with the passed structure
     * @param {Object} json - Object that was signed
     * @param {string} signature - crypto signature
     * @return {boolean} is signature OK
     */
    verifyJson: (json, signature) => {
        return Token.Crypto.verifyJson(json, signature, this._keypair.publicKey);
    }
    