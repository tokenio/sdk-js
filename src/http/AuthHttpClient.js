import Crypto from "../Crypto";
import Util from "../Util";
import AuthHeader from "./AuthHeader";
import AuthContext from "./AuthContext"
import {urls} from "../constants";
import KeyLevel from "../main/KeyLevel";
const stringify = require('json-stable-stringify');
const axios = require('axios');

/**
 * Authenticated client for making requests to the Token gateway
 */
class AuthHttpClient {
    constructor(env, memberId, keys){
        this._instance = axios.create({
            baseURL: urls[env]
        });
        this._memberId = memberId;
        this._keys = keys;
        this._context = new AuthContext();
        this._authHeader = new AuthHeader(urls[env], keys);
        this._resetInterceptor();
    }

    _resetInterceptor() {
        this._instance.interceptors.request.eject(this._interceptor);

        this._interceptor = this._instance.interceptors.request.use((config) => {
            this._authHeader.addAuthorizationHeaderMemberId(this._memberId, config, this._context);
            return config;
        })
    }

    useAccessToken(accessTokenId) {
        this._context.onBehalfOf = accessTokenId;
        this._resetInterceptor();
    }

    clearAccessToken() {
        this._context.onBehalfOf = undefined;
        this._resetInterceptor();
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
        return this._instance(config);
    }

    getSubscribers() {
        const config = {
            method: 'get',
            url: `/subscribers`
        };
        return this._instance(config);
    }

    getSubscriber(subscriberId) {
        const config = {
            method: 'get',
            url: `/subscribers/${subscriberId}`
        };
        return this._instance(config);
    }

    unsubscribeFromNotifications(subscriberId) {
        const config = {
            method: 'delete',
            url: `/subscribers/${subscriberId}`
        };
        return this._instance(config);
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
        return this._instance(config);
    }

    getAddress(addressId) {
        const config = {
            method: 'get',
            url: `/addresses/${addressId}`
        };
        return this._instance(config);
    }

    getAddresses() {
        const config = {
            method: 'get',
            url: `/addresses`
        };
        return this._instance(config);
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
        return this._instance(config);
    }

    getAccounts() {
        const config = {
            method: 'get',
            url: `/accounts`
        };
        return this._instance(config);
    }

    setAccountName(accountId, name) {
        const config = {
            method: 'patch',
            url: `/accounts/${accountId}?name=${name}`
        };
        return this._instance(config);
    }

    getBalance(accountId) {
        const config = {
            method: 'get',
            url: `/accounts/${accountId}/balance`
        };
        return this._instance(config);
    }

    getTransaction(accountId, transactionId) {
        const config = {
            method: 'get',
            url: `/accounts/${accountId}/transactions/${transactionId}`
        };
        return this._instance(config);
    }

    getTransactions(accountId, offset, limit) {
        const config = {
            method: 'get',
            url: `/accounts/${accountId}/transactions?offset=${offset}&limit=${limit}`
        };
        return this._instance(config);
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
        return this._instance(config);
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
        return this._instance(config);
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
        return this._instance(config);
    }

    getToken(tokenId) {
        const config = {
            method: 'get',
            url: `/tokens/${tokenId}`
        };
        return this._instance(config);
    }

    getTokens(type, offset, limit) {
        const config = {
            method: 'get',
            url: `/tokens?type=${type}&offset=${offset}&limit=${limit}`
        };
        return this._instance(config);
    }

    //
    // Transfers
    //
    getTransfer(transferId) {
        const config = {
            method: 'get',
            url: `/transfers/${transferId}`
        };
        return this._instance(config);
    }

    getTransfers(tokenId, offset, limit) {
        const config = {
            method: 'get',
            url: `/transfers?tokenId=${tokenId}&offset=${offset}&limit=${limit}`
        };
        return this._instance(config);
    }

    //
    // Directory
    //
    getMember() {
        const config = {
            method: 'get',
            url: `/members`
        };
        return this._instance(config);
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

    addUsername(prevHash, username) {
        const update = {
            memberId: this._memberId,
            addUsername: {
                username
            }
        };
        return this._memberUpdate(update, prevHash);
    }

    removeUsername(prevHash, username) {
        const update = {
            memberId: this._memberId,
            removeUsername: {
                username
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
            url: `/members/${this._memberId}/updates`,
            data: req
        };
        return this._instance(config);
    }
}

export default AuthHttpClient;
