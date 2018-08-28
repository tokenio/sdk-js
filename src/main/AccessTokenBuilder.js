import Util from '../Util';
import config from '../config.json';
import {Token} from '../proto';

export default class AccessTokenBuilder {
    /**
     * Represents a Builder for a transfer token.
     *
     * @constructor
     * @param {Object} client - The http client to use for the API call
     * @param {Object} member - member performing the request
     * @param {Array} resources - the resources to give access to
     */
    constructor(client, member, resources) {
        this._client = client;
        this._member = member;
        this._tokenRequestId = '';

        this._payload = {
            version: config.accessTokenVersion,
            refId: Util.generateNonce(),
            access: {
                resources,
            },
        };
    }

    /**
     * Adds a from id.
     *
     * @param {String} memberId - fromId
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    setFromId(memberId) {
        if (!this._payload.from) {
            this._payload.from = {};
        }
        this._payload.from.id = memberId;
        return this;
    }

    /**
     * Adds a resource for all addresses.
     *
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    forAllAddresses() {
        this._payload.access.resources.push({
            allAddresses: {},
        });
        return this;
    }

    /**
     * Adds a resource for one adress.
     * @param {String} addressId - id of the address
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    forAddress(addressId) {
        this._payload.access.resources.push({
            address: {
                addressId,
            },
        });
        return this;
    }

    /**
     * Adds a resource for metadata of all accounts.
     *
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    forAllAccounts() {
        this._payload.access.resources.push({
            allAccounts: {},
        });
        return this;
    }

    /**
     * Adds a resource for metadata of all accounts at a given bank.
     *
     * @param {String} bankId - id of the bank
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    forAllAccountsAtBank(bankId) {
        this._payload.access.resources.push({
            allAccountsAtBank: {
                bankId,
            },
        });
        return this;
    }

    /**
     * Adds a resource for metadata of one account.
     *
     * @param {String} accountId - id of the account
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    forAccount(accountId) {
        this._payload.access.resources.push({
            account: {
                accountId,
            },
        });
        return this;
    }

    /**
     * Adds a resource for transactions of all accounts.
     *
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    forAllTransactions() {
        this._payload.access.resources.push({
            allTransactions: {},
        });
        return this;
    }

    /**
     * Adds a resource for transactions of all accounts at a given bank.
     *
     * @param {String} bankId - id of the bank
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    forAllTransactionsAtbank(bankId) {
        this._payload.access.resources.push({
            allTransactionsAtBank: {
                bankId,
            },
        });
        return this;
    }

    /**
     * Adds a resource for transactions of one account.
     *
     * @param {String} accountId - id of the account
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    forAccountTransactions(accountId) {
        this._payload.access.resources.push({
            transactions: {
                accountId,
            },
        });
        return this;
    }

    /**
     * Adds a resource for balances of all accounts.
     *
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    forAllBalances() {
        this._payload.access.resources.push({
            allBalances: {},
        });
        return this;
    }

    /**
     * Adds a resource for balances of all accounts at a given bank.
     *
     * @param {String} bankId - id of the bank
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    forAllBalancesAtBank(bankId) {
        this._payload.access.resources.push({
            allBalancesAtBank: {
                bankId,
            },
        });
        return this;
    }

    /**
     * Adds a resource for balance of one account.
     *
     * @param {String} accountId - id of the account
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    forAccountBalances(accountId) {
        this._payload.access.resources.push({
            balance: {
                accountId,
            },
        });
        return this;
    }

    /**
     * Adds a resource for full access.
     *
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    forAll() {
        return this.forAllAccounts()
            .forAllAddresses()
            .forAllTransactions()
            .forAllBalances();
    }

    /**
     * Sets the expiration date of the token.
     *
     * @param {number} expiresAtMs - expiration date in milliseconds
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    setExpiresAtMs(expiresAtMs) {
        this._payload.expiresAtMs = expiresAtMs;
        return this;
    }

    /**
     * Sets the endorse token timeout.
     *
     * @param {number} endorseUntilMs - time at which no more endorsements can be made
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    setEndorseUntilMs(endorseUntilMs) {
        this._payload.endorseUntilMs = endorseUntilMs;
        return this;
    }

    /**
     * Sets the effective date of the token.
     *
     * @param {number} effectiveAtMs - effective date in milliseconds
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    setEffectiveAtMs(effectiveAtMs) {
        this._payload.effectiveAtMs = effectiveAtMs;
        return this;
    }

    /**
     * Sets the description of the token.
     *
     * @param {string} description - description
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    setDescription(description) {
        this._payload.description = description;
        return this;
    }

    /**
     * Sets the alias of the grantee.
     *
     * @param {Object} toAlias - alias of the grantee
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    setToAlias(toAlias) {
        if (!this._payload.to) {
            this._payload.to = {};
        }
        this._payload.to.alias = toAlias;
        return this;
    }

    /**
     * Sets the memberId of the grantee.
     *
     * @param {string} toMemberId - memberId of the grantee
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    setToMemberId(toMemberId) {
        if (!this._payload.to) {
            this._payload.to = {};
        }
        this._payload.to.id = toMemberId;
        return this;
    }

    /**
     * Sets the refId on the token.
     *
     * @param {string} refId - client generated reference id
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    setRefId(refId) {
        this._payload.refId = refId;
        return this;
    }

    /**
     * Sets acting as on the token.
     *
     * @param {Object} actingAs - entity the redeemer is acting on behalf of
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    setActingAs(actingAs) {
        this._payload.actingAs = actingAs;
        return this;
    }

    /**
     * Sets the token request ID.
     *
     * @param {string} tokenRequestId - token request id
     * @return {AccessTokenBuilder} builder - returns back the builder object
     */
    setTokenRequestId(tokenRequestId) {
        this._tokenRequestId = tokenRequestId;
        return this;
    }

    /**
     * Builds the token payload.
     *
     * @return {Object} tokenPayload - token payload
     */
    build() {
        return this._payload;
    }

    /**
     * Executes the createToken API call to the server, and returns a promise with the token.
     *
     * @return {Promise} token - the created and filled access token
     */
    async execute() {
        return Util.callAsync(this.execute, async () => {
            if (this._payload.access.resources.length < 1) {
                throw new Error('Must have at least one resource');
            }
            if (!(this._payload.to) || (
                !this._payload.to.alias &&
                !this._payload.to.id)) {
                throw new Error('No recipient on token');
            }

            const res = await this._client.createAccessToken(this._payload, this._tokenRequestId);

            if (res.data.status === 'FAILURE_EXTERNAL_AUTHORIZATION_REQUIRED') {
                const error = new Error('FAILURE_EXTERNAL_AUTHORIZATION_REQUIRED');
                error.authorizationDetails = res.data.authorizationDetails;
                throw error;
            }
            return Token.create(res.data.token);
        });
    }
}
