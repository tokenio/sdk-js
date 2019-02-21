import config from '../config.json';
import ErrorHandler from './ErrorHandler';
import DeveloperHeader from './DeveloperHeader';
import VersionHeader from './VersionHeader';
import Util from '../Util';
import axios from 'axios';

/**
 * Client to make unauthenticated requests to the Token gateway.
 */
class HttpClient {
    /**
     * Creates the client with the given environment.
     *
     * @param {Object} options
     */
    constructor({
        env,
        developerKey,
        globalRpcErrorCallback,
        loggingEnabled,
        customSdkUrl,
        customResponseInterceptor,
    }) {
        if (!(config.urls[env] || customSdkUrl)) {
            throw new Error('Invalid environment string. Please use one of: ' +
                JSON.stringify(config.urls));
        }
        this._instance = axios.create({
            baseURL: customSdkUrl || config.urls[env],
        });
        if (loggingEnabled) {
            Util.setUpHttpErrorLogging(this._instance);
        }
        Util.setUpCustomResponseInterceptor(this._instance, customResponseInterceptor);

        const versionHeader = new VersionHeader();
        const developerHeader = new DeveloperHeader(developerKey);
        this._instance.interceptors.request.use(request => {
            versionHeader.addVersionHeader(request);
            developerHeader.addDeveloperHeader(request);
            return request;
        });

        const errorHandler = new ErrorHandler(globalRpcErrorCallback);
        this._instance.interceptors.response.use(null, error => {
            throw errorHandler.handleError(error);
        });
    }

    /**
     * Creates a memberId.
     *
     * @param  {string} memberType - type of member to create. 'PERSONAL' if undefined
     * @param  {string} tokenRequestId - (optional) token request id if the member is being claimed
     * @return {Object} response to the API call
     */
    createMemberId(memberType, tokenRequestId) {
        if (memberType === undefined) {
            memberType = 'PERSONAL';
        }
        if (tokenRequestId && memberType !== 'TRANSIENT') {
            throw new Error('Can only claim transient members');
        }
        const req = {
            memberType,
            tokenRequestId,
        };
        const request = {
            method: 'post',
            url: '/members',
            data: req,
        };
        return this._instance(request);
    }

    normalizeAlias(alias) {
        const request = {
            method: 'get',
            url: `/aliases/normalize/${alias.type}/${alias.value}/${alias.realm || 'token'}`,
        };
        return this._instance(request);
    }

    /**
     * Gets a member given an alias.
     *
     * @param {Object} alias - alias to lookup
     * @return {Object} response to the API call
     */
    resolveAlias(alias) {
        const request = {
            method: 'get',
            url: `/resolve-alias?value=${alias.value}&type=${alias.type}&realm=${alias.realm || ''}`, // eslint-disable-line max-len
        };
        return this._instance(request);
    }

    /**
     * Gets the member's information.
     *
     * @param {string} memberId - member id to lookup the member for
     * @return {Object} response to the API call
     */
    getMember(memberId) {
        const request = {
            method: 'get',
            url: `/members/${memberId}`,
        };
        return this._instance(request);
    }

    /**
     * Gets a blob from the server.
     *
     * @param {string} blobId - id of the blob
     * @return {Object} response to the API call
     */
    async getBlob(blobId) {
        const request = {
            method: 'get',
            url: `/blobs/${blobId}`,
        };
        return this._instance(request);
    }

    /**
     * Notifies a user.
     *
     * @param {Object} alias - user to notify
     * @param {Object} body - body of the notification
     * @return {Object} response to the API call
     */
    notify(alias, body) {
        const req = {
            alias,
            body,
        };
        const request = {
            method: 'post',
            url: '/notify',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Approve a first key for a member (self signed).
     *
     * @param {string} memberId - id of the member
     * @param {Object} key - key to approve
     * @param {Object} cryptoEngine - engine to use for signing
     * @return {Object} response to the API call
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
                            publicKey: key.publicKey,
                            level: key.level,
                            algorithm: key.algorithm,
                            ...key.expiresAtMs && {expiresAtMs: key.expiresAtMs},
                        },
                    },
                },
            ],
        };
        const req = {
            update,
            updateSignature: {
                memberId: memberId,
                keyId: signer.getKeyId(),
                signature: await signer.signJson(update),
            },
        };
        const request = {
            method: 'post',
            url: `/members/${memberId}/updates`,
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Approve the first keys for a member (self signed).
     *
     * @param {string} memberId - id of the member
     * @param {Array} keys - keys to approve
     * @param {Object} cryptoEngine - engine to use for signing
     * @return {Object} response to the API call
     */
    async approveFirstKeys(memberId, keys, cryptoEngine) {
        const signer = await cryptoEngine.createSigner(config.KeyLevel.PRIVILEGED);
        const update = {
            memberId: memberId,
            operations: keys.map(key => ({
                addKey: {
                    key: {
                        id: key.id,
                        publicKey: key.publicKey,
                        level: key.level,
                        algorithm: key.algorithm,
                        ...key.expiresAtMs && {expiresAtMs: key.expiresAtMs},
                    },
                },
            })),
        };
        const req = {
            update,
            updateSignature: {
                memberId: memberId,
                keyId: signer.getKeyId(),
                signature: await signer.signJson(update),
            },
        };
        const request = {
            method: 'post',
            url: `/members/${memberId}/updates`,
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Sends a notification to a user to request a payment.
     *
     * @param {Object} tokenPayload - requested transfer token
     * @return {Object} response to the API call
     */
    notifyPaymentRequest(tokenPayload) {
        const req = {
            tokenPayload,
        };
        const request = {
            method: 'post',
            url: '/request-transfer',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Notifies subscribed devices that a token should be created and endorsed.
     *
     * @param tokenRequestId - token request ID
     * @param addKey - (optional) add key payload
     * @param receiptContact - (optional) receipt contact
     * @return {Object} response to the API call
     */
    notifyCreateAndEndorseToken(tokenRequestId, addKey, receiptContact) {
        const req = {
            tokenRequestId: tokenRequestId,
            addKey: addKey,
            contact: receiptContact,
        };
        const request = {
            method: 'post',
            url: '/notify/create-and-endorse-token',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Notifies subscribed devices that a token payload should be endorsed and keys should be
     * added.
     *
     * @param {Object} endorseAndAddKey - the endorseAndAddKey payload to be sent
     * @return {Object} response to the API call
     * @deprecated use notifyCreateAndEndorseToken instead
     */
    notifyEndorseAndAddKey(endorseAndAddKey) {
        const req = {
            endorseAndAddKey,
        };
        const request = {
            method: 'post',
            url: '/notify/endorse-and-add-key',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Invalidate a notification.
     *
     * @param {Object} notificationId - the notification id to invalidate
     * @return {Object} response to the API call
     */
    invalidateNotification(notificationId) {
        const req = {
            notificationId,
        };
        const request = {
            method: 'post',
            url: '/notify/invalidate-notification',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Gets banks or countries.
     *
     * @param {Object} options - optional parameters
     * @param {boolean} getCountries - get countries instead of banks if true
     * @return {Object} response to the API call
     */
    async getBanksOrCountries(options = {}, getCountries) {
        const formattedOptions = Object.assign({}, {
            // Can be at most 1000
            ids: options.ids || [],
            search: options.search || '',
            country: options.country || '',
            // Default to 1 if not specified
            page: options.page,
            // Can be at most 200, default to 200 if not specified
            perPage: options.perPage,
            // Optional provider
            provider: options.provider || '',
            // Optional destination country
            destinationCountry: options.destinationCountry || '',
        });
        const {
            ids,
            search,
            country,
            page,
            perPage,
            provider,
            destinationCountry,
        } = formattedOptions;
        let url = `/banks${getCountries ? '/countries' : ''}?`;
        for (const id of ids) {
            url += `ids=${encodeURIComponent(id)}&`;
        }
        if (search) url += `search=${encodeURIComponent(search)}&`;
        if (country) url += `country=${encodeURIComponent(country)}&`;
        if (page) url += `page=${encodeURIComponent(page)}&`;
        if (perPage) url += `perPage=${encodeURIComponent(perPage)}&`;
        if (provider) url += `provider=${encodeURIComponent(provider)}&`;
        if (destinationCountry)
            url += `destinationCountry=${encodeURIComponent(destinationCountry)}&`;
        const request = {
            method: 'get',
            url: url,
        };
        return this._instance(request);
    }

    /**
     * Updates an existing token request.
     *
     * @param {string} requestId - token request ID
     * @param {Object} options - new token request options
     * @return {Promise} response to the API call
     */
    async updateTokenRequest(requestId, options) {
        const request = {
            method: 'put',
            url: `/token-requests/${requestId}`,
            data: {
                requestId: requestId,
                requestOptions: options,
            },
        };
        return this._instance(request);
    }

    /**
     * Retrieves a request for a token. Called by the web(user) or by a TPP, to get request details.
     *
     * @param {string} requestId - token request id
     * @return {Promise} response to the API call
     */
    async retrieveTokenRequest(requestId) {
        const request = {
            method: 'get',
            url: `/token-requests/${requestId}`,
        };
        return this._instance(request);
    }

    /**
     * Returns the Token member.
     *
     * @return {Promise} response to the API call
     */
    async getTokenMember() {
        const resolveAliasRes = await this.resolveAlias(Util.tokenAlias().toJSON());
        const tokenMemberId = resolveAliasRes.data.member.id;
        const getMemberRes = await this.getMember(tokenMemberId);
        return getMemberRes.data.member;
    }

    /**
     * Get the token request result based on its token request ID.
     *
     * @param {string} tokenRequestId - token request id
     * @return {Object} response to the API call
     */
    async getTokenRequestResult(tokenRequestId) {
        const request = {
            method: 'get',
            url: `/token-requests/${tokenRequestId}/token_request_result`,
        };
        return this._instance(request);
    }
}

export default HttpClient;
