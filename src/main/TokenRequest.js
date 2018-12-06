import {TokenPayload} from '../proto';

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
     * Sets the email address of the payer/grantor.
     *
     * @param {string} fromEmail - email of the payer/grantor
     * @return {TokenRequest} token request
     */
    setFromEmail(fromEmail) {
        this.requestOptions.from.alias = {};
        this.requestOptions.from.alias.type = 'EMAIL';
        this.requestOptions.from.alias.value = fromEmail;
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

    // DEPRECATED SETTERS

    /**
     * Sets a default email for the TokenRequest
     *
     * @param {string} email - default email
     * @return {TokenRequest} token request
     * @deprecated use setFromEmail instead
     */
    setEmail(email) {
        this.options.email = email;
        return this;
    }

    /**
     * Sets a redirect URL for the TokenRequest
     *
     * @param {string} redirectUrl - redirect URL
     * @return {TokenRequest} token request
     * @deprecated set this on the Token request payload instead
     */
    setRedirectUrl(redirectUrl) {
        this.options.redirectUrl = redirectUrl;
        return this;
    }

    /**
     * Sets a user ref ID for the TokenRequest
     *
     * @param {string} userRefId - user ref id
     * @return {TokenRequest} token request
     * @deprecated set this on the Token request payload instead
     */
    setUserRefId(userRefId) {
        this.userRefId = userRefId;
        return this;
    }

    /**
     * Sets a destination country for the TokenRequest
     *
     * @param {string} destinationCountry - destination country
     * @return {TokenRequest} token request
     * @deprecated set this on the Token request payload instead
     */
    setDestinationCountry(destinationCountry) {
        this.options.destinationCountry = destinationCountry;
        return this;
    }
}
