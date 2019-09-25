// @flow
import Util from '../Util';
import type {ActingAs, Alias} from '@token-io/core';

export default class TokenBuilder {
    tokenPayload: Object;
    tokenRequestId: string;

    /**
     * Use Member::createAccessTokenBuilder or Member::createTransferTokenBuilder or Member::createStandingOrderTokenBuilder.
     */
    constructor(payload: Object, fromMemberId: string) {
        this.tokenPayload = {
            version: '1.0',
            refId: Util.generateNonce(),
            from: {id: fromMemberId},
            to: {},
            ...payload,
        };
    }

    /**
     * Sets a custom reference ID on the token.
     * @param refId
     * @return TokenBuilder
     */
    setRefId(refId: string): TokenBuilder {
        if (refId.length > 18) throw new Error('refId can be at most 18 characters');
        this.tokenPayload.refId = refId;
        return this;
    }

    /**
     * Sets the member ID of the payee/grantee.
     *
     * @param toMemberId - member ID of the payee/grantee
     * @return TokenBuilder
     */
    setToMemberId(toMemberId: string): TokenBuilder {
        this.tokenPayload.to.id = toMemberId;
        return this;
    }

    /**
     * Sets the alias of the payee/grantee.
     *
     * @param alias - alias of the payee/grantee
     * @param value - optional value of the alias if first param is type
     * @return TokenBuilder
     */
    setToAlias(alias: Alias | string, value: string): TokenBuilder {
        if (typeof alias === 'string') this.tokenPayload.to.alias = {type: alias, value};
        else this.tokenPayload.to.alias = alias;
        return this;
    }

    /**
     * Sets acting as on the token.
     *
     * @param actingAs - entity the TPP is acting on behalf of
     * @return TokenBuilder
     */
    setActingAs(actingAs: ActingAs): TokenBuilder {
        this.tokenPayload.actingAs = actingAs;
        return this;
    }

    /**
     * Sets the effective date of the token.
     *
     * @param effectiveAtMs - effective date in milliseconds
     * @return TokenBuilder
     */
    setEffectiveAtMs(effectiveAtMs: number | string): TokenBuilder {
        this.tokenPayload.effectiveAtMs = effectiveAtMs.toString();
        return this;
    }

    /**
     * Sets the expiration date of the token in ms.
     *
     * @param expiresAtMs - expiration time in milliseconds
     * @return BulkTransferTokenBuilder
     */
    setExpiresAtMs(expiresAtMs: number | string): TokenBuilder {
        this.tokenPayload.expiresAtMs = expiresAtMs.toString();
        return this;
    }

    /**
     * Sets the endorse token timeout.
     *
     * @param endorseUntilMs - time at which no more endorsements can be made
     * @return TokenBuilder
     */
    setEndorseUntilMs(endorseUntilMs: number | string): TokenBuilder {
        this.tokenPayload.endorseUntilMs = endorseUntilMs;
        return this;
    }

    /**
     * Sets the description of the token.
     *
     * @param description
     * @return TokenBuilder
     */
    setDescription(description: string): TokenBuilder {
        this.tokenPayload.description = description;
        return this;
    }

    /**
     * Sets the ID of the TokenRequestBuilder associated with this token.
     *
     * @param tokenRequestId
     * @return TokenBuilder
     */
    setTokenRequestId(tokenRequestId: string): TokenBuilder {
        this.tokenRequestId = tokenRequestId;
        this.tokenPayload.tokenRequestId = tokenRequestId;
        return this;
    }

    /**
     * Returns the token payload.
     *
     * @returns TokenPayload
     */
    buildPayload(): Object {
        return this.tokenPayload;
    }
}
