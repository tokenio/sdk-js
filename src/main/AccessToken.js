import Util from "../Util";
import {accessTokenVersion} from "../constants";

var protobuf = require("protobufjs");

export default class AccessToken {
    /**
     * Creates an instance of AccessToken and sets the "to" field on the payload.
     *
     * @param {string} redeemerUsername - redeemer username
     * @returns {AccessToken} - the access token created
     */
    static grantTo(redeemerUsername) {
        return new AccessToken({username: redeemerUsername});
    }

    /**
     * Creates an instance of AccessToken from a given token.
     *
     * @param {Token} token - token to populate from
     * @returns {AccessToken} - the access token created
     */
    static createFromToken(token) {
        return new AccessToken(
            token.payload.to,
            token.payload.from,
            token.payload.access.resources,
            token.id,
            token.payload.version,
            token.payload.nonce,
            token.payload.issuer,
            token.payloadSignatures);
    }

    /**
     * Creates a new AccessToken from existing AccessToken by copying fields
     * only relevant to the new token.
     *
     * @param {AccessToken} accessToken - existing access token to copy some fields from.
     * @returns {AccessToken} - new access token initialized from the old one.
     */
    static createFromAccessToken(accessToken) {
        return new AccessToken(
            accessToken.toMember,
            accessToken.fromMember,
            [],
            undefined,
            accessTokenVersion,
            undefined,
            accessToken.issuer,
            []);
    }

    constructor(
        to,
        from = undefined,
        resources = [],
        id = undefined,
        version = accessTokenVersion,
        nonce = undefined,
        issuer,
        payloadSignatures = []) {
        this._to = to;
        this._from = from;
        this._resources = resources;
        this._id = id;
        this._version = version;
        this._nonce = nonce;
        this._issuer = issuer;
        this._payloadSignatures = payloadSignatures;

        if (nonce === undefined) {
            this._nonce = Util.generateNonce();
        }
    }

    /**
     * Grants access to all addresses.
     *
     * @returns {AccessToken} - the access token
     */
    forAllAddresses() {
        const resource = {
            allAddresses: {}
        };

        this._resources.push(resource);
        return this;
    }

    /**
     * Grants access to a given address.
     *
     * @param {string} addressId - address to grant access to
     * @returns {AccessToken} - the access token
     */
    forAddress(addressId) {
        const resource = {
            address: {
                addressId: addressId
            }
        };

        this._resources.push(resource);
        return this;
    }

    /**
     * Grants access to all accounts.
     *
     * @returns {AccessToken} - the access token
     */
    forAllAccounts() {
        const resource = {
            allAccounts: {}
        };

        this._resources.push(resource);
        return this;
    }

    /**
     * Grants access to a given account.
     *
     * @param {string} accountId - account to grant access to
     * @returns {AccessToken} - the access token
     */
    forAccount(accountId) {
        const resource = {
            account: {
                accountId: accountId
            }
        };

        this._resources.push(resource);
        return this;
    }

    /**
     * Grants access to all transactions.
     *
     * @returns {AccessToken} - the access token
     */
    forAllTransactions() {
        const resource = {
            allTransactions: {}
        };

        this._resources.push(resource);
        return this;
    }

    /**
     * Grants access to a given account transactions.
     *
     * @param {string} accountId - account to grant access to transactions
     * @returns {AccessToken} - the access token
     */
    forAccountTransactions(accountId) {
        const resource = {
            transactions: {
                accountId: accountId
            }
        };

        this._resources.push(resource);
        return this;
    }

    /**
     * Grants access to all balances.
     *
     * @returns {AccessToken} - the access token
     */
    forAllBalances() {
        const resource = {
            allBalances: {}
        };

        this._resources.push(resource);
        return this;
    }

    /**
     * Grants access to a given account balances.
     *
     * @param {string} accountId - account to grant access to balances
     * @returns {AccessToken} - the access token
     */
    forAccountBalances(accountId) {
        const resource = {
            balance: {
                accountId: accountId
            }
        };

        this._resources.push(resource);
        return this;
    }

    /**
     * Grants access to ALL resources (aka wildcard permissions).
     *
     * @returns {AccessToken} - the access token
     */
    forAll() {
        return this.forAllAddresses().forAllAccounts().forAllBalances().forAllTransactions();
    }

    /**
     * Sets "from" field on a payload.
     *
     * @param {Member} member - member granting access
     * @returns {AccessToken} - the access token
     */
    from(member) {
        this._from = {id: member.id};
        return this;
    }

    set payloadSignatures(sigs) {
        this._payloadSignatures = [];
        for (let sig of sigs) {
            this._payloadSignatures.push(sig);
        }
    }

    /**
     * Creates a standardized json object for the AccessToken payload, to be used for signing
     *
     * @returns json representation of the TokenPayload
     */
    get json() {
        return {
            version: this._version,
            nonce: this._nonce,
            from: this._from,
            to: this._to,
            issuer: this._issuer,
            access: {
                resources: this._resources
            }
        };
    }

    get id() {
        return this._id;
    }

    get version() {
        return this._version;
    }

    get nonce() {
        return this._nonce;
    }

    get fromMember() {
        return this._from;
    }

    get toMember() {
        return this._to;
    }

    get issuer() {
        return this._issuer;
    }

    get resources() {
        return this._resources;
    }

    get payloadSignatures() {
        return this._payloadSignatures;
    }
}
