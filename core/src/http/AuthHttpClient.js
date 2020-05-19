import axios from 'axios';
import Util from '../Util';
import AuthHeader from './AuthHeader';
import AuthContext from './AuthContext';
import config from '../config.json';
import ErrorHandler from './ErrorHandler';
import DeveloperHeader from './DeveloperHeader';
import VersionHeader from './VersionHeader';
import stringify from 'fast-json-stable-stringify';
import SecurityMetadataHeader from './SecurityMetadataHeader';

/**
 * Client for making authenticated requests to the Token gateway.
 */
export class AuthHttpClient {
    constructor({
        env,
        memberId,
        cryptoEngine,
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
        this._memberId = memberId;
        this._cryptoEngine = cryptoEngine;

        this._context = new AuthContext();
        this._authHeader = new AuthHeader(customSdkUrl || config.urls[env], this);

        this._developerKey = developerKey;

        this._resetRequestInterceptor();

        const errorHandler = new ErrorHandler(globalRpcErrorCallback);
        this._instance.interceptors.response.use(null, error => {
            throw errorHandler.handleError(error);
        });
    }

    /**
     * Creates the necessary signer objects, based on the level requested.
     * If the level is not available, attempts to fetch a lower level.
     *
     * @param {string} level - requested level of key
     * @return {Promise} object used to sign
     */
    async getSigner(level) {
        if (level === config.KeyLevel.LOW) {
            return await this._cryptoEngine.createSigner(config.KeyLevel.LOW);
        }
        if (level === config.KeyLevel.STANDARD) {
            try {
                return await this._cryptoEngine.createSigner(config.KeyLevel.STANDARD);
            } catch (err) {
                return await this._cryptoEngine.createSigner(config.KeyLevel.LOW);
            }
        }
        if (level === config.KeyLevel.PRIVILEGED) {
            try {
                return await this._cryptoEngine.createSigner(config.KeyLevel.PRIVILEGED);
            } catch (err) {
                try {
                    return await this._cryptoEngine.createSigner(config.KeyLevel.STANDARD);
                } catch (err2) {
                    return await this._cryptoEngine.createSigner(config.KeyLevel.LOW);
                }
            }
        }
    }

    /**
     * Use the given key level to sign the request.
     *
     * @param {string} keyLevel - key level
     */
    useKeyLevel(keyLevel) {
        this._context.keyLevel = keyLevel;
        this._resetRequestInterceptor();
    }

    /**
     * Sets the security metadata to be sent with each request.
     *
     * @param {object} securityMetadata - security metadata
     */
    setSecurityMetadata(securityMetadata) {
        this._securityMetadata = securityMetadata;
        this._resetRequestInterceptor();
    }

    /**
     * Clears the security metadata.
     */
    clearSecurityMetadata() {
        this._securityMetadata = undefined;
        this._resetRequestInterceptor();
    }

    /**
     * Returns the security metadata.
     *
     * @return {object} security metadata
     */
    getSecurityMetadata() {
        return this._securityMetadata;
    }

    /**
     * Gets all accounts linked to the member.
     *
     * @return {Object} response to the API call
     */
    async getAccounts() {
        const request = {
            method: 'get',
            url: '/accounts',
        };
        return this._instance(request);
    }

    /**
     * Gets an account.
     *
     * @param {string} accountId - account to get
     * @return {Object} response to the API call
     */
    async getAccount(accountId) {
        const request = {
            method: 'get',
            url: `/accounts/${accountId}`,
        };
        return this._instance(request);
    }

    /**
     * Gets the balance of an account.
     *
     * @param {string} accountId - accountId
     * @param {string} keyLevel - key level
     * @return {Object} response to the API call
     */
    async getBalance(accountId, keyLevel) {
        this.useKeyLevel(keyLevel);

        const request = {
            method: 'get',
            url: `/accounts/${accountId}/balance`,
        };
        return this._instance(request);
    }

    /**
     * Gets the balances of an array of accounts.
     *
     * @param {Array} accountIds - array of accountIds
     * @param {string} keyLevel - key level
     * @return {Object} response to the API call
     */
    async getBalances(accountIds, keyLevel) {
        this.useKeyLevel(keyLevel);
        const url = '/account-balance?' +
            accountIds.map(accountId => 'account_id=' + accountId).join('&');

        const request = {
            method: 'get',
            url: url,
        };
        return this._instance(request);
    }

    /**
     * Gets a transaction for an account, by its ID.
     *
     * @param {string} accountId - account that initiated the transaction
     * @param {string} transactionId - ID of the transaction
     * @param {string} keyLevel - key level
     * @return {Object} response to the API call
     */
    async getTransaction(accountId, transactionId, keyLevel) {
        this.useKeyLevel(keyLevel);
        const request = {
            method: 'get',
            url: `/accounts/${accountId}/transaction/${transactionId}`,
        };
        return this._instance(request);
    }

    /**
     * Gets all transactions for an account.
     *
     * @param {string} accountId - ID of the account
     * @param {string} offset - where to start
     * @param {Number} limit - how many to get
     * @param {string} keyLevel - key level
     * @return {Object} response to the API call
     */
    async getTransactions(accountId, offset, limit, keyLevel, startDate, endDate) {
        this.useKeyLevel(keyLevel);
        const request = {
            method: 'get',
            url: `/accounts/${accountId}/transactions?offset=${offset}&limit=${limit}&startDate=${startDate || ''}&endDate=${endDate || ''}`,
        };
        return this._instance(request);
    }

    /**
     * Confirms if an account has sufficient funds for a purchase.
     *
     * @param {string} accountId
     * @param {string} amount
     * @param {string} currency
     * @return {boolean} true if account has sufficient funds
     */
    async confirmFunds(accountId, amount, currency) {
        const req = {
            accountId,
            amount: {
                currency,
                value: amount.toString(),
            },
        };
        const request = {
            method: 'put',
            url: `/accounts/${accountId}/funds-confirmation`,
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Gets info about a bank.
     *
     * @param {string} bankId - ID of the bank to lookup
     * @return {Object} response to the API call
     */
    async getBankInfo(bankId) {
        const request = {
            method: 'get',
            url: `/banks/${bankId}/info`,
        };
        return this._instance(request);
    }

    /**
     * Adds a key to the member.
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {Object} key - key to add
     * @return {Object} response to the API call
     */
    async approveKey(prevHash, key) {
        const update = {
            memberId: this._memberId,
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
        return this._memberUpdate(update, prevHash);
    }

    /**
     * Adds keys to the member.
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {Array} keys - keys to add
     * @return {Object} response to the API call
     */
    async approveKeys(prevHash, keys) {
        const update = {
            memberId: this._memberId,
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
        return this._memberUpdate(update, prevHash);
    }

    /**
     * Removes a key from the member.
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {string} keyId - keyId to remove
     * @return {Object} response to the API call
     */
    async removeKey(prevHash, keyId) {
        const update = {
            memberId: this._memberId,
            operations: [
                {
                    removeKey: {
                        keyId,
                    },
                },
            ],
        };
        return this._memberUpdate(update, prevHash);
    }

    /**
     * Removes keys from the member.
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {Array} keyIds - keys to remove
     * @return {Object} response to the API call
     */
    async removeKeys(prevHash, keyIds) {
        const update = {
            memberId: this._memberId,
            operations: keyIds.map(keyId => ({
                removeKey: {
                    keyId,
                },
            })),
        };
        return this._memberUpdate(update, prevHash);
    }

    /**
     * Adds an alias to the member.
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {Object} alias - alias to add
     * @return {Object} response to the API call
     */
    async addAlias(prevHash, alias) {
        return this.addAliases(prevHash, [alias]);
    }

    /**
     * Gets logged-in member's aliases, verified or not.
     *
     * @return {Object} response object; has aliases, unverifiedAliases
     */
    async getAliases() {
        const request = {
            method: 'get',
            url: '/aliases',
        };
        return this._instance(request);
    }

    /**
     * Get default recovery agent.
     * @return {Object} GetDefaultAgentResponse proto buffer
     */
    async getDefaultRecoveryAgent() {
        const request = {
            method: 'get',
            url: '/recovery/defaults/agent',
        };
        return this._instance(request);
    }

    /**
     * Set member's recovery rule.
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {Object} rule - RecoveryRule proto buffer specifying behavior.
     * @return {Object} UpdateMemberResponse proto buffer
     */
    async addRecoveryRule(prevHash, rule) {
        const update = {
            memberId: this._memberId,
            operations: [{
                recoveryRules: rule,
            }],
        };
        return this._memberUpdate(update, prevHash);
    }

    /**
     * Adds aliases to the member.
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {Array} aliases - aliases to add
     * @return {Object} response to the API call
     */
    async addAliases(prevHash, aliases) {
        const update = {
            memberId: this._memberId,
            operations: aliases.map(alias => ({
                addAlias: {
                    aliasHash: Util.hashAndSerializeAlias(alias),
                    realm: alias.realm,
                    realmId: alias.realmId,
                },
            })),
        };

        const metadata = aliases.map(alias => ({
            addAliasMetadata: {
                aliasHash: Util.hashAndSerializeAlias(alias),
                alias: alias,
            },
        }));

        return this._memberUpdate(update, prevHash, metadata);
    }

    /**
     * Removes an alias from the member.
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {Object} alias - alias to remove
     * @return {Object} response to the API call
     */
    async removeAlias(prevHash, alias) {
        return this.removeAliases(prevHash, [alias]);
    }

    /**
     * Removes aliases from the member.
     *
     * @param {string} prevHash - hash of the previous directory entry.
     * @param {Array} aliases - aliases to remove
     * @return {Object} response to the API call
     */
    async removeAliases(prevHash, aliases) {
        const update = {
            memberId: this._memberId,
            operations: aliases.map(alias => ({
                removeAlias: {
                    aliasHash: Util.hashAndSerializeAlias(alias),
                    realm: alias.realm,
                    realmId: alias.realmId,
                },
            })),
        };
        return this._memberUpdate(update, prevHash);
    }

    /**
     * Deletes the member.
     *
     * @return {Object} response to the api call
     */
    async deleteMember() {
        this.useKeyLevel(config.KeyLevel.PRIVILEGED);
        const request = {
            method: 'delete',
            url: '/members',
        };

        return this._instance(request);
    }

    /**
     * Resolves transfer destinations for the given account ID.
     *
     * @param {string} accountId - ID of account to resolve destinations for
     * @return {Object} api response
     */
    async resolveTransferDestinations(accountId) {
        const request = {
            method: 'get',
            url: `/accounts/${accountId}/transfer-destinations`,
        };

        return this._instance(request);
    }

    /**
     * Creates a test bank account.
     *
     * @param {Number} balance - balance to put in the account
     * @param {string} currency - currency in the account
     * @return {Object} response to the API call
     */
    async createTestBankAccount(balance, currency) {
        const req = {
            balance: {
                currency,
                value: balance,
            },
        };

        const request = {
            method: 'post',
            url: '/test/create-account',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Links accounts to the member.
     *
     * @param {string} authorization - oauthBankAuthorization continaing bank_id and
     * access_token
     * @return {Object} response to the API call
     */
    async linkAccountsOauth(authorization) {
        const req = {
            authorization,
        };
        const request = {
            method: 'post',
            url: '/bank-accounts',
            data: req,
        };
        return this._instance(request);
    }

    /**
     * Gets test bank notification.
     *
     * @param {string} subscriberId - id of subscriber
     * @param {string} notificationId - id of notification
     * @return {Object} response to the API call
     */
    async getTestBankNotification(subscriberId, notificationId) {
        const request = {
            method: 'get',
            url: `/test/subscribers/${subscriberId}/notifications/${notificationId}`,
        };
        return this._instance(request);
    }

    /**
     * Gets test bank notifications.
     *
     * @param {string} subscriberId - id of subscriber
     * @return {Object} response to the API call
     */
    async getTestBankNotifications(subscriberId) {
        const request = {
            method: 'get',
            url: `/test/subscribers/${subscriberId}/notifications`,
        };
        return this._instance(request);
    }

    /**
     * Gets information about a particular standing order.
     *
     * @param {string} accountId
     * @param {string} standingOrderId
     * @param {string} keyLevel
     * @returns
     * @memberof AuthHttpClient
     */
    async getStandingOrder(accountId, standingOrderId, keyLevel) {
        this.useKeyLevel(keyLevel);
        const request = {
            method: 'get',
            url: `/accounts/${accountId}/standing-orders/${standingOrderId}`,
        };
        return this._instance(request);
    }

    /**
     * Gets information about several standing orders.
     *
     * @param {string} accountId
     * @param {string} offset
     * @param {int} limit
     * @param {string} keyLevel
     * @returns
     * @memberof AuthHttpClient
     */
    async getStandingOrders(accountId, offset, limit, keyLevel) {
        this.useKeyLevel(keyLevel);
        const request = {
            method: 'get',
            url: `/accounts/${accountId}/standing-orders?page.offset=${offset}&page.limit=${limit}`,
        };
        return this._instance(request);
    }

    /**
     * Signs a token payload with given key level and action.
     *
     * @param {Object} tokenPayload
     * @param {string} suffix
     * @param {KeyLevel} keyLevel
     * @returns {Object} token proto signature object
     */
    async tokenOperationSignature(tokenPayload, suffix, keyLevel) {
        const payload = stringify(tokenPayload) + `.${suffix}`;
        const signer = await this.getSigner(keyLevel);
        return {
            memberId: this._memberId,
            keyId: signer.getKeyId(),
            signature: await signer.sign(payload),
        };
    }

    async _memberUpdate(update, prevHash, metadata) {
        if (prevHash !== '') {
            update.prevHash = prevHash;
        }
        if (typeof metadata === 'undefined') {
            metadata = [];
        }

        const signer = await this.getSigner(config.KeyLevel.PRIVILEGED);
        const req = {
            update,
            updateSignature: {
                memberId: this._memberId,
                keyId: signer.getKeyId(),
                signature: await signer.signJson(update),
            },
            metadata,
        };
        const request = {
            method: 'post',
            url: `/members/${this._memberId}/updates`,
            data: req,
        };
        return this._instance(request);
    }

    _resetRequestInterceptor() {
        this._instance.interceptors.request.eject(this._interceptor);

        const versionHeader = new VersionHeader();
        const developerHeader = new DeveloperHeader(this._developerKey);
        const securityMetadataHeader = new SecurityMetadataHeader(this._securityMetadata);
        this._interceptor = this._instance.interceptors.request.use(async request => {
            await this._authHeader.addAuthorizationHeader(this._memberId, request, this._context);
            versionHeader.addVersionHeader(request);
            developerHeader.addDeveloperHeader(request);
            securityMetadataHeader.addSecurityMetadataHeader(request);
            return request;
        });
    }
}

export default AuthHttpClient;
