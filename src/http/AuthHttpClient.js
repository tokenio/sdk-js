import Crypto from "../Crypto";
import Util from "../Util";
import Auth from "./Auth";
import AuthContext from "./AuthContext"
import {uriHost} from "../constants";
import KeyLevel from "../main/KeyLevel";
const stringify = require('json-stable-stringify');

const axios = require('axios');
const instance = axios.create({
    baseURL: uriHost
});

/**
 * Authenticated client for making requests to the Token gateway
 */
class AuthHttpClient {
    constructor(memberId, keys){
        this._memberId = memberId;
        this._keys = keys;
        this._context = new AuthContext();
    }

    setOnBehalfOf(accessTokenId) {
        this._context.onBehalfOf = accessTokenId;
    }

    clearOnBehalfOf() {
        this._context.onBehalfOf = undefined;
    }
    
    subscribeDevice(notificationUri, provider, platform, tags) {
        const req = {
            provider,
            notificationUri,
            platform,
            tags
        };
        const config = {
            method: 'post',
            url: `/devices`,
            data: req
        };
        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    unsubscribeDevice(notificationUri, provider) {
        const req = {
            provider
        };
        const config = {
            method: 'delete',
            url: `/devices/${notificationUri}`,
            data: req
        };
        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    //
    // ADDRESSES
    //
    addAddress(name, data) {
        const req = {
            name,
            data,
            dataSignature: {
                keyId: this._keys.keyId,
                signature: Crypto.sign(data, this._keys),
                timestampMs: new Date().getTime()
            }
        };
        const config = {
            method: 'post',
            url: `/addresses`,
            data: req
        };

        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    getAddress(addressId) {
        const config = {
            method: 'get',
            url: `/addresses/${addressId}`
        };

        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    getAddresses() {
        const config = {
            method: 'get',
            url: `/addresses`
        };

        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    //
    // ACCOUNTS
    //
    linkAccounts(bankId, accountsLinkPayload) {
        const req = {
            bankId,
            accountsLinkPayload
        };
        const config = {
            method: 'post',
            url: `/accounts`,
            data: req
        };
        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    getAccounts() {
        const config = {
            method: 'get',
            url: `/accounts`
        };
        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    setAccountName(accountId, name) {
        const config = {
            method: 'patch',
            url: `/accounts/${accountId}?name=${name}`
        };
        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    getBalance(accountId) {
        const config = {
            method: 'get',
            url: `/accounts/${accountId}/balance`
        };
        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    getTransaction(accountId, transactionId) {
        const config = {
            method: 'get',
            url: `/accounts/${accountId}/transactions/${transactionId}`
        };
        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    getTransactions(accountId, offset, limit) {
        const config = {
            method: 'get',
            url: `/accounts/${accountId}/transactions?offset=${offset}&limit=${limit}`
        };
        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    //
    // Payment Tokens
    //
    createPaymentToken(paymentToken) {
        const config = {
            method: 'post',
            url: `/payment-tokens`,
            data: {
                payload: paymentToken
            }
        };

        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    endorsePaymentToken(paymentToken) {
        return this._paymentTokenOperation(
            paymentToken,
            'endorse',
            'endorsed');
    }

    cancelPaymentToken(paymentToken) {
        return this._paymentTokenOperation(
            paymentToken,
            'cancel',
            'cancelled');
    }

    _paymentTokenOperation(paymentToken, operation, suffix) {
        const payload = stringify(paymentToken.json) + `.${suffix}`;
        const req = {
            tokenId: paymentToken.id,
            signature: {
                keyId: this._keys.keyId,
                signature: Crypto.sign(payload, this._keys),
                timestampMs: new Date().getTime()
            }
        };
        const tokenId = paymentToken.id;
        const config = {
            method: 'put',
            url: `/payment-tokens/${tokenId}/${operation}`,
            data: req
        };
debugger;
        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    redeemPaymentToken(paymentToken, amount, currency) {
        const payload = {
            nonce: Util.generateNonce(),
            tokenId: paymentToken.id,
            amount: {
                value: amount.toString(),
                currency
            },
            transfer: paymentToken.transfer
        };

        const req = {
            payload,
            payloadSignature: {
                keyId: this._keys.keyId,
                signature: Crypto.signJson(payload, this._keys),
                timestampMs: new Date().getTime()
            }
        };
        const config = {
            method: 'post',
            url: `/payments`,
            data: req
        };

        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    getPaymentToken(tokenId) {
        const config = {
            method: 'get',
            url: `/payment-tokens/${tokenId}`
        };

        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    getPaymentTokens(offset, limit) {
        const config = {
            method: 'get',
            url: `/payment-tokens?offset=${offset}&limit=${limit}`
        };
        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    //
    // Payments
    //
    getPayment(paymentId) {
        const config = {
            method: 'get',
            url: `/payments/${paymentId}`
        };

        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    getPayments(tokenId, offset, limit) {
        const config = {
            method: 'get',
            url: `/payments?tokenId=${tokenId}&offset=${offset}&limit=${limit}`
        };
        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    //
    // Access Tokens
    //
    createAccessToken(accessToken) {
        const config = {
            method: 'post',
            url: `/access-tokens`,
            data: {
                payload: accessToken
            }
        };

        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    //
    // Directory
    //
    getMember() {
        const config = {
            method: 'get',
            url: `/member`
        };
        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    static getMemberByAlias(keys, alias) {
        const config = {
            method: 'get',
            url: `/member`
        };
        Auth.addAuthorizationHeaderAlias(
            keys,
            alias,
            config);
        return instance(config);
    }

    addKey(prevHash, publicKey, keyLevel, tags) {
        const update = {
            memberId: this._memberId,
            addKey: {
                publicKey: Crypto.strKey(publicKey)
            }
        };

        // Do this because default this._keys are invisible in protos
        if (tags.length > 0) {
            update.addKey.tags = tags;
        }

        if (keyLevel !== KeyLevel.PRIVILEGED) {
            update.addKey.level = keyLevel;
        }

        return this._memberUpdate(update, prevHash);
    }

    removeKey(prevHash, keyId) {
        const update = {
            memberId: this._memberId,
            removeKey: {
                keyId
            }
        };
        return this._memberUpdate(update, prevHash);
    }

    addAlias(prevHash, alias) {
        const update = {
            memberId: this._memberId,
            addAlias: {
                alias
            }
        };
        return this._memberUpdate(update, prevHash);
    }

    removeAlias(prevHash, alias) {
        const update = {
            memberId: this._memberId,
            removeAlias: {
                alias
            }
        };
        return this._memberUpdate(update, prevHash);
    }

    _memberUpdate(update, prevHash) {
        if (prevHash !== '') {
            update.prevHash = prevHash;
        }

        const req = {
            update,
            updateSignature: {
                keyId: this._keys.keyId,
                signature: Crypto.signJson(update, this._keys),
                timestampMs: new Date().getTime()
            }
        };
        const config = {
            method: 'post',
            url: `/members/${this._memberId}`,
            data: req
        };
        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }
}

export default AuthHttpClient;
