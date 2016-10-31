import Util from "../Util";
import {accessTokenVersion} from "../constants";

export default class AccessToken {
    /**
     * Creates Addresses AccessToken.
     *
     * @param {Member} member - the member granting resource access
     * @param {string} toUsername - the username of the grantee
     * @returns {AccessToken} - the access token created
     */
    static addressesAccessToken(member, toUsername) {
        const from = {id: member.id};
        const to = {username: toUsername};
        const resource = {
            allAddresses: {}
        };

        return new AccessToken(
            undefined,
            from,
            to,
            [resource]);
    }

    /**
     * Creates Address AccessToken.
     *
     * @param {Member} member - the member granting resource access
     * @param {string} toUsername - the username of the grantee
     * @param {string} addressId - an optional address id
     * @returns {AccessToken} - the access token created
     */
    static addressAccessToken(member, toUsername, addressId) {
        const from = {id: member.id};
        const to = {username: toUsername};
        const resource = {
            address: {
                addressId: addressId
            }
        };

        return new AccessToken(
            undefined,
            from,
            to,
            [resource]);
    }

    /**
     * Creates Accounts AccessToken.
     *
     * @param {Member} member - the member granting resource access
     * @param {string} toUsername - the username of the grantee
     * @returns {AccessToken} - the access token created
     */
    static accountsAccessToken(member, toUsername) {
        const from = {id: member.id};
        const to = {username: toUsername};
        const resource = {
            allAccounts: {}
        };

        return new AccessToken(
            undefined,
            from,
            to,
            [resource]);
    }

    /**
     * Creates an Account AccessToken.
     *
     * @param {Member} member - the member granting resource access
     * @param {string} toUsername - the username of the grantee
     * @param {string} accountId - an optional account id
     * @returns {AccessToken} - the access token created
     */
    static accountAccessToken(member, toUsername, accountId) {
        const from = {id: member.id};
        const to = {username: toUsername};
        const resource = {
            account: {
                accountId: accountId
            }
        };

        return new AccessToken(
            undefined,
            from,
            to,
            [resource]);
    }

    /**
     * Creates Account Transactions AccessToken.
     *
     * @param {Member} member - the member granting resource access
     * @param {string} toUsername - the username of the grantee
     * @returns {AccessToken} - the access token created
     */
    static accountsTransactionsAccessToken(member, toUsername) {
        const from = {id: member.id};
        const to = {username: toUsername};
        const resource = {
            allTransactions: {}
        };

        return new AccessToken(
            undefined,
            from,
            to,
            [resource]);
    }

    /**
     * Creates an Account Transaction AccessToken.
     *
     * @param {Member} member - the member granting resource access
     * @param {string} toUsername - the username of the grantee
     * @param {string} accountId - an optional account id
     * @returns {AccessToken} - the access token created
     */
    static accountTransactionsAccessToken(member, toUsername, accountId) {
        const from = {id: member.id};
        const to = {username: toUsername};
        const resource = {
            transactions: {
                accountId: accountId
            }
        };

        return new AccessToken(
            undefined,
            from,
            to,
            [resource]);
    }

    /**
     * Creates Balances AccessToken.
     *
     * @param {Member} member - the member granting resource access
     * @param {string} toUsername - the username of the grantee
     * @returns {AccessToken} - the access token created
     */
    static balancesAccessToken(member, toUsername) {
        const from = {id: member.id};
        const to = {username: toUsername};
        const resource = {
            allBalances: {}
        };

        return new AccessToken(
            undefined,
            from,
            to,
            [resource]);
    }

    /**
     * Creates a Balance AccessToken.
     *
     * @param {Member} member - the member granting resource access
     * @param {string} toUsername - the username of the grantee
     * @param {string} accountId - an optional account id
     * @returns {AccessToken} - the access token created
     */
    static balanceAccessToken(member, toUsername, accountId) {
        const from = {id: member.id};
        const to = {username: toUsername};
        const resource = {
            balance: {
                accountId: accountId
            }
        };

        return new AccessToken(
            undefined,
            from,
            to,
            [resource]);
    }

    static createFromToken(token) {
        const id = token.id;
        const from = token.payload.from;
        const to = token.payload.to;
        const resources = token.payload.access.resources;
        const version = token.payload.version;
        const nonce = token.payload.nonce;
        const issuer = token.payload.issuer;
        const payloadSignatures = token.payloadSignatures;

        return new AccessToken(
            id,
            from,
            to,
            resources,
            version,
            nonce,
            issuer,
            payloadSignatures);
    }

    constructor(
        id,
        from,
        to,
        resources,
        version = accessTokenVersion,
        nonce = undefined,
        issuer,
        payloadSignatures = []) {
        this._id = id;
        this._from = from;
        this._to = to;
        this._resources = resources;
        this._version = version;
        this._nonce = nonce;
        this._issuer = issuer;
        this._payloadSignatures = payloadSignatures;

        if (nonce === undefined) {
            this._nonce = Util.generateNonce();
        }
    }

    set payloadSignatures(sigs) {
        this._payloadSignatures = [];
        for (let sig of sigs) {
            this._payloadSignatures.push(sig);
        }
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

    get from() {
        return this._from;
    }

    get to() {
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

    // Creates a standardized json object for the AccessToken, to be used for signing
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
}
