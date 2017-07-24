import Crypto from "../security/Crypto";
import {urls, KeyLevel} from "../constants";
import ErrorHandler from "./ErrorHandler";
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
     * call error. For example: SDK version mismatch
     */
    constructor(env, globalRpcErrorCallback) {
        this._instance = axios.create({
            baseURL: urls[env]
        });

        const versionHeader = new VersionHeader();
        this._instance.interceptors.request.use((config) => {
            versionHeader.addVersionHeader(config);
            return config;
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
        const config = {
            method: 'post',
            url: '/members'
        };
        return this._instance(config);
    }

    /**
     * Gets a memberId given a username.
     *
     * @param {string} username - username to lookup
     * @return {Object} response - response to the API call
     */
    getMemberId(username) {
        const config = {
            method: 'get',
            url: `/memberid?username=${username}`
        };
        return this._instance(config);
    }

    /**
     * Gets the member's information.
     *
     * @param {string} memberId - member id to lookup the member for
     * @return {Object} response - response to the API call
     */
    getMember(memberId) {
        const config = {
            method: 'get',
            url: `/members/${memberId}`
        };
        return this._instance(config);
    }

    /**
     * Notifies a user.
     *
     * @param {string} username - user to notify
     * @param {Object} body - body of the notification
     * @return {Object} response - response to the API call
     */
    notify(username, body) {
        const req = {
            username,
            body
        };
        const config = {
            method: 'post',
            url: `/notify`,
            data: req
        };
        return this._instance(config);
    }

    /**
     * Approve a first key for a member (self signed).
     *
     * @param {string} memberId - id of the member
     * @param {Object} key - key to approve
     * @param {Object} cryptoEngine - engines to use for signing
     * @return {Object} response - response to the API call
     */
    async approveFirstKey(memberId, key, cryptoEngine) {
        const signer = await cryptoEngine.createSigner(KeyLevel.PRIVILEGED);
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
        const config = {
            method: 'post',
            url: `/members/${memberId}/updates`,
            data: req
        };
        return this._instance(config);
    }

    /**
     * Approve the first keys for a member (self signed).
     *
     * @param {string} memberId - id of the member
     * @param {Array} keys - keys to approve
     * @param {Object} cryptoEngine - engines to use for signing
     * @return {Object} response - response to the API call
     */
    async approveFirstKeys(memberId, keys, cryptoEngine) {
        const signer = await cryptoEngine.createSigner(KeyLevel.PRIVILEGED);
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
        const config = {
            method: 'post',
            url: `/members/${memberId}/updates`,
            data: req
        };
        return this._instance(config);
    }
}

export default HttpClient;
