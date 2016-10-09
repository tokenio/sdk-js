import Util from "../Util";

export default class AccessToken {
    /**
     * Creates an Address AccessToken
     *
     * @param {Member} member - the member granting resource access
     * @param {string} granteeAlias - the alias of the grantee
     * @param {string} addressId - an optional address id
     * @returns {AccessToken} - the access token created
     */
    static addressAccessToken(member, granteeAlias, addressId) {
        const grantor = {id: member.id};
        const grantee = {alias: granteeAlias};
        const resource = {
            address: {
                addressId: addressId
            }
        };

        return new AccessToken(
            undefined,
            grantor,
            grantee,
            [resource]);
    }

    /**
     * Creates an Account AccessToken
     *
     * @param {Member} member - the member granting resource access
     * @param {string} granteeAlias - the alias of the grantee
     * @param {string} accountId - an optional account id
     * @returns {AccessToken} - the access token created
     */
    static accountAccessToken(member, granteeAlias, accountId) {
        const grantor = {id: member.id};
        const grantee = {alias: granteeAlias};
        const resource = {
            account: {
                accountId: accountId
            }
        };

        return new AccessToken(
            undefined,
            grantor,
            grantee,
            [resource]);
    }

    /**
     * Creates a Transaction AccessToken
     *
     * @param {Member} member - the member granting resource access
     * @param {string} granteeAlias - the alias of the grantee
     * @param {string} accountId - an optional account id
     * @returns {AccessToken} - the access token created
     */
    static transactionAccessToken(member, granteeAlias, accountId) {
        const grantor = {id: member.id};
        const grantee = {alias: granteeAlias};
        const resource = {
            transaction: {
                accountId: accountId
            }
        };

        return new AccessToken(
            undefined,
            grantor,
            grantee,
            [resource]);
    }

    static createFromToken(token) {
        const id = token.id;
        const version = token.version;
        const nonce = token.payload.nonce;
        const grantor = token.payload.grantor;
        const grantee = token.payload.grantee;
        const resources = token.payload.resources;
        const payloadSignatures = token.payloadSignatures;

        return new AccessToken(
            id, version, nonce, grantor, grantee,
            resources, payloadSignatures);
    }

    constructor(
        id,
        grantor,
        grantee,
        resources,
        version = accessTokenVersion,
        nonce = undefined,
        payloadSignatures = []) {
        this._id = id;
        this._version = version;
        this._nonce = nonce;
        this._grantor = grantor;
        this._grantee = grantee;
        this._resources = resources;
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

    get grantor() {
        return this._grantor;
    }

    get grantee() {
        return this._grantee;
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
            grantor: this._grantor,
            grantee: this._grantee,
            resources: this._resources,
        };
    }
}
