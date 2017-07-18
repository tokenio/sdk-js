import Util from "../Util";
import {maxDecimals, transferTokenVersion} from "../constants";

export default class TransferTokenBuilder {

    /**
     * Represents a Builder for a transfer token.
     *
     * @constructor
     * @param {Object} client - The http client to use for the API call
     * @param {Object} member - member performing the request
     * @param {number} lifetimeAmount - the lifetime amount of the token
     * @param {string} currency - currency of the token
     */
    constructor(client, member, lifetimeAmount, currency) {
        this._client = client;
        this._member = member;
        this._blobPayloads = [];

        if (Util.countDecimals(lifetimeAmount) > maxDecimals) {
            throw new Error('Number of decimals in lifetimeAmount should be at most ' +
                maxDecimals);
        }

        this._payload = {
            version: transferTokenVersion,
            refId: Util.generateNonce(),
            from: {
                id: member.memberId(),
            },
            transfer: {
                currency,
                lifetimeAmount: lifetimeAmount.toString(),
                instructions: {
                    source: null,
                    destinations: [],
                },
                redeemer: {},
                attachments: [],
            },
        };
    }

    /**
     * Sets the source accountId of the token.
     *
     * @param {string} accountId - source accountId
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setAccountId(accountId) {
        this._payload.transfer.instructions.source = {
            account: {
                token: {
                    memberId: this._member.memberId(),
                    accountId,
                },
            }
        };
        return this;
    }

    /**
     * Sets the source bank authorization.
     *
     * @param {Object} authorization - bank authorization for source account
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setBankAuthorization(authorization) {
        this._payload.transfer.instructions.source = {
            account: {
                tokenAuthorization: {
                    authorization,
                },
            }
        };
        return this;
    }

    /**
     * Sets the expiration date of the token.
     *
     * @param {number} expiresAtMs - expiration date in milliseconds
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setExpiresAtMs(expiresAtMs) {
        this._payload.expiresAtMs = expiresAtMs;
        return this;
    }

    /**
     * Sets the effective date of the token.
     *
     * @param {number} effectiveAtMs - effective date in milliseconds
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setEffectiveAtMs(effectiveAtMs) {
        this._payload.effectiveAtMs = effectiveAtMs;
        return this;
    }

    /**
     * Sets the maximum charge amount of the token.
     *
     * @param {number} chargeAmount - maximum charge amount.
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setChargeAmount(chargeAmount) {
        if (Util.countDecimals(chargeAmount) > maxDecimals) {
            throw new Error(`Number of decimals in amount should be at most ${maxDecimals}`);
        }
        this._payload.transfer.amount = chargeAmount;
        return this;
    }

    /**
     * Sets the description of the token.
     *
     * @param {string} description - description
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setDescription(description) {
        this._payload.description = description;
        return this;
    }

    /**
     * Add a transfer destination to the token.
     *
     * @param {object} endpoint - transfer endpoint
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    addDestination(endpoint) {
        this._payload.transfer.instructions.destinations.push(endpoint);
        return this;
    }

    /**
     * Sets the username of the redeemer.
     *
     * @param {string} redeemerUsername - username of the redeemer
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setRedeemerUsername(redeemerUsername) {
        this._payload.transfer.redeemer.username = redeemerUsername;
        return this;
    }

    /**
     * Sets the memberId of the redeemer.
     *
     * @param {string} redeemerMemberId - memberId of the redeemer
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setRedeemerMemberId(redeemerMemberId) {
        this._payload.transfer.redeemer.id = redeemerMemberId;
        return this;
    }

    /**
     * Sets the username of the payee.
     *
     * @param {string} toUsername - username of the payee
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setToUsername(toUsername) {
        if (!this._payload.to) {
            this._payload.to = {};
        }
        this._payload.to.username = toUsername;
        return this;
    }

    /**
     * Sets the memberId of the payee.
     *
     * @param {string} toMemberId - memberId of the payee
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setToMemberId(toMemberId) {
        if (!this._payload.to) {
            this._payload.to = {};
        }
        this._payload.to.id = toMemberId;
        return this;
    }

    /**
     * Adds an attachment to the token.
     *
     * @param {Object} attachment - attachment (metadata).
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    addAttachment(attachment) {
        this._payload.transfer.attachments.push(attachment);
        return this;
    }

    /**
     * Adds an attachment to the token, with the data.
     *
     * @param {string} ownerId - memberId of the owner of the file
     * @param {string} type - MIME type of the file
     * @param {string} name - name of the file
     * @param {Buffer} data - byte array of the data of the file
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    addAttachmentData(ownerId, type, name, data) {
        this._blobPayloads.push({
            ownerId,
            type,
            name,
            data
        });
        return this;
    }

    /**
     * Sets the pricing (fees/fx) of the token.
     *
     * @param {Object} pricing - pricing of the token
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setPricing(pricing) {
        this._payload.transfer.pricing = pricing;
        return this;
    }

    /**
     * Sets the purpose of payment of the token.
     *
     * @param {string} purposeOfPayment - purpose of payment
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setPurposeOfPayment(purposeOfPayment) {
        this._payload.transfer.instructions.transferPurpose = purposeOfPayment;
        return this;
    }

    /**
     * Sets the refId on the token.
     *
     * @param {string} refId - client generated reference id
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setRefId(refId) {
        this._payload.refId = refId;
        return this;
    }

    /**
     * Executes the createToken API call to the server, and returns a promise with the token.
     *
     * @return {Promise} token - the created and filled transfer token
     */
    async execute() {
        return Util.callAsync(this.execute, async () => {
            if (!this._payload.transfer.instructions.source || (
                !this._payload.transfer.instructions.source.account.token &&
                !this._payload.transfer.instructions.source.account.tokenAuthorization)) {
                throw new Error('No source on token');
            }
            if (!this._payload.transfer.redeemer.username &&
                !this._payload.transfer.redeemer.memberId) {
                throw new Error('No redeemer on token');
            }
            for (let i = 0; i < this._blobPayloads.length; i++) {
                const payload = this._blobPayloads[i];
                const attachment = await this._member.createBlob(
                    payload.ownerId,
                    payload.type,
                    payload.name,
                    payload.data);
                this.addAttachment(attachment);
            }
            const res = await this._client.createTransferToken(this._payload);
            if (res.data.status !== "SUCCESS") {
                throw new Error(res.data.status);
            }
            return res.data.token;
        });
    }
}
