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

    useAccessToken(accessTokenId) {
        this._context.onBehalfOf = accessTokenId;
    }

    clearAccessToken() {
        this._context.onBehalfOf = undefined;
    }

    subscribeToNotifications(target, provider, platform) {
        const req = {
            provider,
            target,
            platform
        };
        const config = {
            method: 'post',
            url: `/subscribers`,
            data: req
        };
        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    getSubscribers() {
        const config = {
            method: 'get',
            url: `/subscribers`
        };
        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    getSubscriber(subscriberId) {
        const config = {
            method: 'get',
            url: `/subscribers/${subscriberId}`
        };
        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    unsubscribeFromNotifications(subscriberId) {
        const config = {
            method: 'delete',
            url: `/subscribers/${subscriberId}`
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
    // Tokens
    //
    createToken(payload) {
        const config = {
            method: 'post',
            url: `/tokens`,
            data: {
                payload: payload
            }
        };

        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    endorseToken(token) {
        return this._tokenOperation(
            token,
            'endorse',
            'endorsed');
    }

    cancelToken(transferToken) {
        return this._tokenOperation(
            transferToken,
            'cancel',
            'cancelled');
    }

    _tokenOperation(transferToken, operation, suffix) {
        const payload = stringify(transferToken.json) + `.${suffix}`;
        const req = {
            tokenId: transferToken.id,
            signature: {
                keyId: this._keys.keyId,
                signature: Crypto.sign(payload, this._keys),
                timestampMs: new Date().getTime()
            }
        };
        const tokenId = transferToken.id;
        const config = {
            method: 'put',
            url: `/tokens/${tokenId}/${operation}`,
            data: req
        };
        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    createTransfer(transferToken, amount, currency) {
        const payload = {
            nonce: Util.generateNonce(),
            tokenId: transferToken.id,
            amount: {
                value: amount.toString(),
                currency
            },
            transfer: transferToken.transfer
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
            url: `/transfers`,
            data: req
        };

        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    getToken(tokenId) {
        const config = {
            method: 'get',
            url: `/tokens/${tokenId}`
        };

        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    getTokens(offset, limit) {
        const config = {
            method: 'get',
            url: `/tokens?offset=${offset}&limit=${limit}`
        };
        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    //
    // Transfers
    //
    getTransfer(transferId) {
        const config = {
            method: 'get',
            url: `/transfers/${transferId}`
        };

        Auth.addAuthorizationHeaderMemberId(
            this._keys,
            this._memberId,
            config,
            this._context);
        return instance(config);
    }

    getTransfers(tokenId, offset, limit) {
        const config = {
            method: 'get',
            url: `/transfers?tokenId=${tokenId}&offset=${offset}&limit=${limit}`
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
            url: `/members`
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
            url: `/members`
        };
        Auth.addAuthorizationHeaderAlias(
            keys,
            alias,
            config);
        return instance(config);
    }

    addKey(prevHash, publicKey, keyLevel) {
        const update = {
            memberId: this._memberId,
            addKey: {
                publicKey: Crypto.strKey(publicKey)
            }
        };

        // Do this because default this._keys are invisible in protos
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
