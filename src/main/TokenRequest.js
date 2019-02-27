import {TokenPayload} from '../proto';
import Util from '../Util';

// TODO(RD-1515) remove support for Token payload, options map
export default class TokenRequest {
    /**
     * Constructs a TokenRequest.
     *
     * @param {Object} payload - token request payload
     */
    constructor(payload) {
        if (payload.accessBody || payload.transferBody) {
            this.requestPayload = payload;
            this.requestOptions = {};
            this.requestOptions.from = {};
        } else {
            this.payload = TokenPayload.create(payload);
            this.options = {};
        }
    }

    /**
     * Creates a TokenRequest object
     *
     * @param {Object} payload - token request payload
     * @return {TokenRequest} TokenRequest object
     */
    static create(payload) {
        return new TokenRequest(payload);
    }

    /**
     * Sets a default bank ID for the TokenRequest
     *
     * @param {string} bankId - bank ID
     * @return {TokenRequest} token request
     */
    setBankId(bankId) {
        if (this.requestOptions) {
            this.requestOptions.bankId = bankId;
        } else {
            this.options.bankId = bankId;
        }
        return this;
    }

    /**
     * Sets the member ID of the payer/grantor.
     *
     * @param fromMemberId member ID of the payer/grantor
     * @return {TokenRequest} token request
     */
    setFromMemberId(fromMemberId) {
        this.requestOptions.from.id = fromMemberId;
        return this;
    }

    /**
     * Sets the alias of the payer/grantor
     *
     * @param {string|Object} type - type of alias or alias object
     * @param {string} value - value of alias
     * @returns {TokenRequest} token request
     */
    setFromAlias(type, value) {
        if (typeof type === 'string') this.requestOptions.from.alias = {type, value};
        else this.requestOptions.from.alias = type;
        return this;
    }

    /**
     * Sets the member ID of the payee/grantee.
     *
     * @param toMemberId member ID of the payee/grantee
     * @return {TokenRequest} token request
     */
    setToMemberId(toMemberId) {
        if (this.requestPayload) this.requestPayload.to.id = toMemberId;
        return this;
    }

    /**
     * Sets the alias of the payee/grantee.
     *
     * @param {string|Object} type - type of alias or alias object
     * @param {string} value - value of alias
     * @return {TokenRequest} token request
     */
    setToAlias(type, value) {
        if (this.requestPayload) {
            if (typeof type === 'string') this.requestPayload.to.alias = {type, value};
            else this.requestPayload.to.alias = type;
        }
        return this;
    }

    /**
     * Sets the source account ID.
     *
     * @param accountId source account ID
     * @returns {TokenRequest} token request
     */
    setSourceAccount(accountId) {
        this.requestOptions.sourceAccountId = accountId;
        return this;
    }

    /**
     * Sets the receiptRequested flag on the TokenRequest.
     *
     * @param {boolean} receiptRequested - true if a receipt is requested
     * @return {TokenRequest} token request
     */
    setReceiptRequested(receiptRequested) {
        this.requestOptions.receiptRequested = receiptRequested;
        return this;
    }

    /**
     * Sets customization id for the TokenRequest
     *
     * @param {object} customizationId - customization id
     * @return {TokenRequest} token request
     */
    setCustomizationId(customizationId) {
        if (this.requestPayload) {
            this.requestPayload.customizationId = customizationId;
        } else { // deprecated api
            this.customizationId = customizationId;
        }
        return this;
    }

    /**
     * Sets acting as on the token.
     *
     * @param {Object} actingAs - entity the redeemer is acting on behalf of
     * @return {TokenRequest} token request
     */
    setActingAs(actingAs) {
        if (this.requestPayload) this.requestPayload.actingAs = actingAs;
        return this;
    }

    /**
     * Sets the description of the token.
     *
     * @param {string} description - description
     * @return {TokenRequest} token request
     */
    setDescription(description) {
        if (this.requestPayload) this.requestPayload.description = description;
        return this;
    }

    /**
     * Sets the callback state
     *
     * @param {Object|string} state - arbitrary JS object or string
     * @return {TokenRequest} token request
     */
    setCallbackState(state) {
        if (this.requestPayload) {
            this.requestPayload.callbackState.innerState = state;
        }
        return this;
    }

    /**
     * Sets the CSRF token
     *
     * @param {string} csrf - CSRF token
     * @return {TokenRequest} token request
     */
    setCSRFToken(csrf) {
        if (this.requestPayload) {
            this.requestPayload.callbackState.csrfTokenHash = Util.hashString(csrf);
        }
        return this;
    }

    /**
     * Sets a app ref ID for the TokenRequest
     *
     * @param {string} userRefId - app ref id
     * @return {TokenRequest} token request
     */
    setUserRefId(userRefId) {
        if (this.requestPayload) {
            this.requestPayload.userRefId = userRefId;
        } else { // deprecated api
            this.userRefId = userRefId;
        }
        return this;
    }

    /**
     * Sets a redirect URL for the TokenRequest
     *
     * @param {string} redirectUrl - redirect URL
     * @return {TokenRequest} token request
     */
    setRedirectUrl(redirectUrl) {
        if (this.requestPayload) {
            this.requestPayload.redirectUrl = redirectUrl;
        } else { // deprecated api
            this.options.redirectUrl = redirectUrl;
        }
        return this;
    }

    // DEPRECATED SETTERS

    /**
     * Sets a default email for the TokenRequest
     *
     * @param {string} email - default email
     * @return {TokenRequest} token request
     * @deprecated use setFromAlias instead
     */
    setEmail(email) {
        this.options.email = email;
        return this;
    }

    /**
     * Sets a destination country for the TokenRequest
     *
     * @param {string} destinationCountry - destination country
     * @return {TokenRequest} token request
     */
    setDestinationCountry(destinationCountry) {
        this.options.destinationCountry = destinationCountry;
        return this;
    }
}
