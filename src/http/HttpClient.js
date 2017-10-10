import config from "../config.json";
import Crypto from "../security/Crypto";
import ErrorHandler from "./ErrorHandler";
import DeveloperHeader from "./DeveloperHeader";
import VersionHeader from "./VersionHeader";

const axios = require('axios');

/**
 * Client to make unauthenticated requests to the Token gateway.
 */
class HttpClient {
    /**
     * Creates the client with the given environment.
     *
     * @param {string} env - environment to point to, like 'prd'
     * @param {function} globalRpcErrorCallback - callback to invoke on any cross-cutting RPC
     * @param {string} developerKey - the developer key
     * call error. For example: SDK version mismatch
     */
    constructor(env, globalRpcErrorCallback, developerKey) {
        if (!config.urls[env]) {
            throw new Error('Invalid environment string. Please use one of: ' +
                JSON.stringify(config.urls));
        }
        this._instance = axios.create({
            baseURL: config.urls[env]
        });

        const versionHeader = new VersionHeader();
        const developerHeader = new DeveloperHeader(developerKey);
        this._instance.interceptors.request.use((request) => {
            versionHeader.addVersionHeader(request);
            developerHeader.addDeveloperHeader(request);
            return request;
        });

        const errorHandler = new ErrorHandler(globalRpcErrorCallback);
        this._instance.interceptors.response.use(null, (error) => {
            throw errorHandler.handleError(error);
        });
    }

    /**
     * Creates a memberId.
     *
     * @return {Object} response - response to the API call
     */
    createMemberId() {
        const request = {
            method: 'post',
            url: '/members'
        };
        return this._instance(request);
    }

    /**
     * Gets a member given an alias.
     *
     * @param {Object} alias - alias to lookup
     * @return {Object} response - response to the API call
     */
    resolveAlias(alias) {
        const request = {
            method: 'get',
            url: `/resolve-alias?value=${alias.value}&type=${alias.type}`
        };
        return this._instance(request);
    }

    /**
     * Gets the member's information.
     *
     * @param {string} memberId - member id to lookup the member for
     * @return {Object} response - response to the API call
     */
    getMember(memberId) {
        const request = {
            method: 'get',
            url: `/members/${memberId}`
        };
        return this._instance(request);
    }

    /**
     * Notifies a user.
     *
     * @param {Object} alias - user to notify
     * @param {Object} body - body of the notification
     * @return {Object} response - response to the API call
     */
    notify(alias, body) {
        const req = {
            alias,
            body
        };
        const request = {
            method: 'post',
            url: `/notify`,
            data: req
        };
        return this._instance(request);
    }

    /**
     * Approve a first key for a member (self signed).
     *
     * @param {string} memberId - id of the member
     * @param {Object} key - key to approve
     * @param {Object} cryptoEngine - engine to use for signing
     * @return {Object} response - response to the API call
     */
    async approveFirstKey(memberId, key, cryptoEngine) {
        const signer = await cryptoEngine.createSigner(config.KeyLevel.PRIVILEGED);
        const update = {
            memberId: memberId,
            operations: [
                {
                    addKey: {
                        key: {
                            id: key.id,
                            publicKey: Crypto.strKey(key.publicKey),
                            level: key.level,
                            algorithm: key.algorithm
                        }
                    }
                }
            ]
        };
        const req = {
            update,
            updateSignature: {
                memberId: memberId,
                keyId: signer.getKeyId(),
                signature: signer.signJson(update)
            }
        };
        const request = {
            method: 'post',
            url: `/members/${memberId}/updates`,
            data: req
        };
        return this._instance(request);
    }

    /**
     * Approve the first keys for a member (self signed).
     *
     * @param {string} memberId - id of the member
     * @param {Array} keys - keys to approve
     * @param {Object} cryptoEngine - engine to use for signing
     * @return {Object} response - response to the API call
     */
    async approveFirstKeys(memberId, keys, cryptoEngine) {
        const signer = await cryptoEngine.createSigner(config.KeyLevel.PRIVILEGED);
        const update = {
            memberId: memberId,
            operations: keys.map((key) => ({
                addKey: {
                    key: {
                        id: key.id,
                        publicKey: Crypto.strKey(key.publicKey),
                        level: key.level,
                        algorithm: key.algorithm
                    }
                }
            })),
        };
        const req = {
            update,
            updateSignature: {
                memberId: memberId,
                keyId: signer.getKeyId(),
                signature: signer.signJson(update)
            }
        };
        const request = {
            method: 'post',
            url: `/members/${memberId}/updates`,
            data: req
        };
        return this._instance(request);
    }

    /**
     * Sends a notification to a user to request a payment.
     *
     * @param {Object} tokenPayload - requested transfer token
     * @return {Object} response - response to the API call
     */
    notifyPaymentRequest(tokenPayload) {
        const req = {
            tokenPayload
        };
        const request = {
            method: 'post',
            url: `/request-transfer`,
            data: req
        };
        return this._instance(request);
    }
}

export default HttpClient;
