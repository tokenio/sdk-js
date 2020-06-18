import config from '../config.json';
import ErrorHandler from './ErrorHandler';
import DeveloperHeader from './DeveloperHeader';
import VersionHeader from './VersionHeader';
import Util from '../Util';
import axios from 'axios';

/**
 * Client for making unauthenticated requests to the Token gateway.
 */
export class HttpClient {
    constructor({
        env = 'prd',
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

    async normalizeAlias(alias) {
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
    async resolveAlias(alias) {
        const request = {
            method: 'get',
            url: `/resolve-alias?alias.value=${alias.value}&alias.type=${alias.type}&alias.realm=${alias.realm || ''}&alias.realmId=${alias.realmId || ''}`, // eslint-disable-line max-len
        };
        return this._instance(request);
    }

    /**
     * Gets the member's information.
     *
     * @param {string} memberId - member ID to lookup the member for
     * @return {Object} response to the API call
     */
    async getMember(memberId) {
        const request = {
            method: 'get',
            url: `/members/${memberId}`,
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
            // (Optional) Filter for banks that support or don't support certain features. See Bank for the feature keys we support.
            // Set "true" for banks that support the feature or "false" for banks that don't support the feature.
            // e.g. ["supports_linking_uri": "true"] means only banks who supports the linking uri feature.
            bankFeatures: options.bankFeatures || '',
        });
        const {
            ids,
            search,
            country,
            page,
            perPage,
            provider,
            destinationCountry,
            bankFeatures,
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
        if (bankFeatures) {
            for (const key in bankFeatures) {
                url += `${key}=${encodeURIComponent(bankFeatures[key])}&`;
            }
        }
        const request = {
            method: 'get',
            url: url,
        };
        return this._instance(request);
    }

    /**
     * Returns the Token member.
     *
     * @return {Promise} response to the API call
     */
    async getTokenMember() {
        const resolveAliasRes = await this.resolveAlias(Util.tokenAlias());
        const tokenMemberId = resolveAliasRes.data.member.id;
        const getMemberRes = await this.getMember(tokenMemberId);
        return getMemberRes.data.member;
    }

    /**
     * Creates a memberId.
     *
     * @param  {string} memberType - type of member to create. 'PERSONAL' if undefined
     * @param  {string} tokenRequestId - (optional) token request ID if the member is being claimed
     * @param  {string} realmId - (optional) member id of the Member to which this new member will belong
     * @return {Object} response to the API call
     */
    async createMemberId(memberType, tokenRequestId, realmId) {
        if (memberType === undefined) {
            memberType = 'PERSONAL';
        }
        if (tokenRequestId && memberType !== 'TRANSIENT') {
            throw new Error('Can only claim transient members');
        }
        const req = {
            memberType,
            tokenRequestId,
            realmId,
        };
        const request = {
            method: 'post',
            url: '/members',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Approve a first key for a member (self signed).
     *
     * @param {string} memberId - ID of the member
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
                            publicKey: Util.strKey(key.publicKey),
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
     * @param {string} memberId - ID of the member
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
                        publicKey: Util.strKey(key.publicKey),
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
}

export default HttpClient;
