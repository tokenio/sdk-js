import AuthHttpClient from "../http/AuthHttpClient";
import Util from "../Util";
import {maxDecimals, KeyLevel, transferTokenVersion} from "../constants";

/**
 * Member object. Allows member-wide actions. Some calls return a promise, and some return
 * objects
 *
 */
export default class TransferTokenBuilder {

    /**
     * Represents a Builder for a transfer token.
     *
     * @constructor
     * @param {Object} client - The http client to use for the API call
     * @param {Object} member - member performing the request
     * @param {number} lifetimeAmount - the lifetime amount of the token
     * @param {string} currency - currency of the token
     * @return {Object} builder - returns the initialized builder
     */
    constructor(client, member, lifetimeAmount, currency) {
        this._client = client;
        this._member = member;

        if (Util.countDecimals(lifetimeAmount) > maxDecimals) {
            throw new Error('Number of decimals in lifetimeAmount should be at most ' +
                maxDecimals);
        }

        this._payload = {
            version: transferTokenVersion,
            nonce: Util.generateNonce(),
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

    setExpiresAtMs(expiresAtMs) {
        this._payload.expiresAtMs = expiresAtMs;
        return this;
    }

    setEffectiveAtMs(effectiveAtMs) {
        this._payload.effectiveAtMs = effectiveAtMs;
        return this;
    }

    setChargeAmount(chargeAmount) {
        if (Util.countDecimals(chargeAmount) > maxDecimals) {
            throw new Error(`Number of decimals in amount should be at most ${maxDecimals}`);
        }
        this._payload.transfer.amount = chargeAmount;
        return this;
    }

    setDescription(description) {
        this._payload.description = description;
        return this;
    }

    addDestination(endpoint) {
        this._payload.transfer.instructions.destinations.push(endpoint);
        return this;
    }

    setRedeemerUsername(redeemerUsername) {
        this._payload.transfer.redeemer.username = redeemerUsername;
        return this;
    }

    setRedeemerMemberId(redeemerMemberId) {
        this._payload.transfer.redeemer.id = redeemerMemberId;
        return this;
    }

    setToUsername(toUsername) {
        if (!this._payload.to) {
            this._payload.to = {};
        }
        this._payload.to.username = toUsername;
        return this;
    }

    setToMemberId(toMemberId) {
        if (!this._payload.to) {
            this._payload.to = {};
        }
        this._payload.to.id = toMemberId;
        return this;
    }

    addAttachment(attachment) {
        this._payload.transfer.attachments.push(attachment);
        return this;
    }

    async execute() {
        return Util.callAsync(this.execute, async () => {
            if (!this._payload.transfer.instructions.source || (
                !this._payload.transfer.instructions.source.account.token
                && !this._payload.transfer.instructions.source.account.tokenAuthorization)) {
                throw new Error('No source on token');
            }
            if (!this._payload.transfer.redeemer.username
                && !this._payload.transfer.redeemer.memberId) {
                throw new Error('No redeemer on token');
            }

            const res = await this._client.createTransferToken(this._payload);
            return res.data.token;
        });
    }
}
