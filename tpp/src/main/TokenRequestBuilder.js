// @flow
import Util from '../Util';
import type {
    Alias,
    ActingAs,
} from '@token-io/core';

export default class TokenRequestBuilder {
    requestPayload: Object;
    requestOptions: Object;

    /**
     * Use TokenClient::createTransferTokenRequest or TokenClient::createAccessTokenRequest.
     */
    constructor(payload: Object) {
        this.requestPayload = {
            refId: Util.generateNonce(),
            to: {},
            callbackState: {},
            ...payload,
        };
        this.requestOptions = {from: {}};
    }

    /**
     * Sets a custom reference ID on the TokenRequestBuilder.
     * @param refId
     * @return TokenRequestBuilder
     */
    setRefId(refId: string): TokenRequestBuilder {
        this.requestPayload.refId = refId;
        return this;
    }

    /**
     * Sets a default bank ID for the TokenRequestBuilder.
     *
     * @param bankId - the default bank ID
     * @return TokenRequestBuilder
     */
    setBankId(bankId: string): TokenRequestBuilder {
        this.requestOptions.bankId = bankId;
        return this;
    }

    /**
     * Sets the member ID of the payer/grantor.
     *
     * @param fromMemberId - member ID of the payer/grantor
     * @return TokenRequestBuilder
     */
    setFromMemberId(fromMemberId: string): TokenRequestBuilder {
        this.requestOptions.from.id = fromMemberId;
        return this;
    }

    /**
     * Sets the alias of the payer/grantor.
     *
     * @param alias - alias object, or type of alias as a string
     * @param value - optional value of the alias if first param is type
     * @return TokenRequestBuilder
     */
    setFromAlias(alias: Alias | string, value: string): TokenRequestBuilder {
        if (typeof alias === 'string') this.requestOptions.from.alias = {type: alias, value};
        else this.requestOptions.from.alias = alias;
        return this;
    }

    /**
     * Sets the member ID of the payee/grantee.
     *
     * @param toMemberId - member ID of the payee/grantee
     * @return TokenRequestBuilder
     */
    setToMemberId(toMemberId: string): TokenRequestBuilder {
        this.requestPayload.to.id = toMemberId;
        return this;
    }

    /**
     * Sets the alias of the payee/grantee.
     *
     * @param alias - alias of the payee/grantee
     * @param value - optional value of the alias if first param is type
     * @return TokenRequestBuilder
     */
    setToAlias(alias: Alias | string, value: string): TokenRequestBuilder {
        if (typeof alias === 'string') this.requestPayload.to.alias = {type: alias, value};
        else this.requestPayload.to.alias = alias;
        return this;
    }

    /**
     * Sets the source account ID.
     *
     * @param accountId - source account ID
     * @return TokenRequestBuilder
     */
    setSourceAccount(accountId: string): TokenRequestBuilder {
        this.requestOptions.sourceAccountId = accountId;
        return this;
    }

    /**
     * Sets if a receipt should be sent to the payee/grantee's default receipt email/SMS/etc.
     *
     * @param receiptRequested - true if a receipt is requested
     * @return TokenRequestBuilder
     */
    setReceiptRequested(receiptRequested: boolean): TokenRequestBuilder {
        this.requestOptions.receiptRequested = receiptRequested;
        return this;
    }

    /**
     * Sets customization ID for the TokenRequestBuilder.
     *
     * @param customizationId - result of Member::createCustomization
     * @return TokenRequestBuilder
     */
    setCustomizationId(customizationId: string): TokenRequestBuilder {
        this.requestPayload.customizationId = customizationId;
        return this;
    }

    /**
     * Sets acting as on the token.
     *
     * @param actingAs - entity the TPP is acting on behalf of
     * @return TokenRequestBuilder
     */
    setActingAs(actingAs: ActingAs): TokenRequestBuilder {
        this.requestPayload.actingAs = actingAs;
        return this;
    }

    /**
     * Sets the description of the token.
     *
     * @param description
     * @return TokenRequestBuilder
     */
    setDescription(description: string): TokenRequestBuilder {
        this.requestPayload.description = description;
        return this;
    }

    /**
     * Sets the callback state.
     *
     * @param state - arbitrary JS object or string
     * @return TokenRequestBuilder
     */
    setCallbackState(state: Object | string): TokenRequestBuilder {
        this.requestPayload.callbackState.innerState = state;
        return this;
    }

    /**
     * Sets the CSRF token.
     *
     * @param csrf - CSRF token
     * @return TokenRequestBuilder
     */
    setCSRFToken(csrf: string): TokenRequestBuilder {
        this.requestPayload.callbackState.csrfTokenHash = Util.hashString(csrf);
        return this;
    }

    /**
     * Sets the ID used to track a member claimed by a TPP.
     *
     * @param userRefId
     * @return TokenRequestBuilder
     */
    setUserRefId(userRefId: string): TokenRequestBuilder {
        this.requestPayload.userRefId = userRefId;
        return this;
    }

    /**
     * Sets the callback URL to the server that will initiate redemption of the token.
     *
     * @param redirectUrl
     * @return TokenRequestBuilder
     */
    setRedirectUrl(redirectUrl: string): TokenRequestBuilder {
        this.requestPayload.redirectUrl = redirectUrl;
        return this;
    }
}
