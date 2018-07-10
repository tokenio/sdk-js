import Util from "../Util";
import config from "../config.json";

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
        this._tokenRequestId = "";

        if (Util.countDecimals(lifetimeAmount) > config.decimalPrecision) {
            throw new Error('Number of decimals in lifetimeAmount should be at most ' +
                config.decimalPrecision);
        }

        this._payload = {
            version: config.transferTokenVersion,
            refId: Util.generateNonce(),
            transfer: {
                currency,
                lifetimeAmount: lifetimeAmount.toString(),
                instructions: {
                    destinations: [],
                    metadata: {},
                },
                redeemer: {},
                attachments: [],
            },
        };
    }

    /**
     * Sets the fromId of the token
     *
     * @param {string} memberId - from memberId
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setFromId(memberId) {
        if (!this._payload.from) {
            this._payload.from = {};
        }
        this._payload.from.id = memberId;
        return this;
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
     * Sets the source custom authorization.
     *
     * @param {string} bankId - source bank id
     * @param {string} authorization - source custom authorization
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setCustomAuthorization(bankId, authorization) {
        this._payload.transfer.instructions.source = {
            account: {
                custom: {
                    bankId: bankId,
                    payload: authorization,
                }
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
     * Sets the endorse token timeout.
     *
     * @param {number} endorseUntilMs - time at which no more endorsements can be made
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setEndorseUntilMs(endorseUntilMs) {
        this._payload.endorseUntilMs = endorseUntilMs;
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
        if (Util.countDecimals(chargeAmount) > config.decimalPrecision) {
            throw new Error('Number of decimals in amount should be at most ' +
                            config.decimalPrecision);
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
     * Sets the alias of the redeemer.
     *
     * @param {Object} redeemerAlias - alias of the redeemer
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setRedeemerAlias(redeemerAlias) {
        this._payload.transfer.redeemer.alias = redeemerAlias;
        return this;
    }

    /**
     * Sets the realm of the redeemer.
     *
     * @param {string} redeemerRealm - realm of the redeemer
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setRedeemerRealm(redeemerRealm) {
        this._payload.transfer.redeemer.realm = redeemerRealm;
        return this;
    }

    /**
     * Sets the memberId of the redeemer.
     *
     * @param {Object} redeemerMemberId - memberId of the redeemer
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setRedeemerMemberId(redeemerMemberId) {
        this._payload.transfer.redeemer.id = redeemerMemberId;
        return this;
    }

    /**
     * Sets the alias of the payee.
     *
     * @param {Object} toAlias - alias of the payee
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setToAlias(toAlias) {
        if (!this._payload.to) {
            this._payload.to = {};
        }
        this._payload.to.alias = toAlias;
        return this;
    }

    /**
     * Sets the realm of the payee.
     *
     * @param {string} toRealm - realm of the payee
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setToRealm(toRealm) {
        if (!this._payload.to) {
            this._payload.to = {};
        }
        this._payload.to.realm = toRealm;
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
        this._payload.transfer.instructions.metadata.transferPurpose = purposeOfPayment;
        return this;
    }

    /**
     * Sets the refId on the token.
     *
     * @param {string} refId - client generated reference id
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setRefId(refId) {
        if (refId.length > 18) {
            throw new Error('The length of the refId is at most 18,' +
                    'actual length is: ' + refId.length);
        }
        this._payload.refId = refId;
        return this;
    }

    /**
     * Sets acting as on the token.
     *
     * @param {Object} actingAs - entity the redeemer is acting on behalf of
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setActingAs(actingAs) {
        this._payload.actingAs = actingAs;
        return this;
    }

    /**
     * Sets the token request ID.
     *
     * @param {string} tokenRequestId - token request id
     * @return {TransferTokenBuilder} builder - returns back the builder object
     */
    setTokenRequestId(tokenRequestId) {
        this._tokenRequestId = tokenRequestId;
        return this;
    }

    /**
     *  Sets the flag indicating whether a receipt is requested.
     *
     * @param {boolean} receiptRequested receipt requested flag
     * @return {TransferTokenBuilder} builder
     */
    setReceiptRequested(receiptRequested) {
        this._payload.receiptRequested = receiptRequested;
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
     * @return {Promise} token - the created and filled transfer token
     */
    async execute() {
        return Util.callAsync(this.execute, async () => {
            if (!this._payload.transfer.instructions.source || (
                !this._payload.transfer.instructions.source.account.token &&
                !this._payload.transfer.instructions.source.account.tokenAuthorization &&
                !this._payload.transfer.instructions.source.account.bank &&
                !this._payload.transfer.instructions.source.account.custom)) {
                throw new Error('No source on token');
            }
            if (!this._payload.transfer.redeemer.alias &&
                !this._payload.transfer.redeemer.id) {
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
            const res = await this._client.createTransferToken(this._payload, this._tokenRequestId);
            if (res.data.status === "FAILURE_EXTERNAL_AUTHORIZATION_REQUIRED") {
                let error = new Error("FAILURE_EXTERNAL_AUTHORIZATION_REQUIRED");
                error.authorizationDetails = res.data.authorizationDetails;
                throw error;
            }
            if (res.data.status !== "SUCCESS") {
                throw new Error(res.data.status);
            }
            return res.data.token;
        });
    }
}
