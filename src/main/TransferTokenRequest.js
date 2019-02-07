import TokenRequest from './TokenRequest';

export default class TransferTokenRequest extends TokenRequest {
    constructor(payload) {
        super(payload);
    }

    /**
     * Sets the maximum amount per charge on a transfer token request.
     *
     * @param {number} amount
     * @return {TokenRequest} token request
     */
    setChargeAmount(amount) {
        this.requestPayload.transferBody.amount = amount;
        return this;
    }

    /**
     * Adds a transfer destination to a transfer token request.
     *
     * @param {Object} destination
     * @return {TokenRequest} token request
     */
    addDestination(destination) {
        this.requestPayload.transferBody.destinations.push(destination);
        return this;
    }

    /**
     * Sets the destination country in order to narrow down
     * the country selection in the web-app UI.
     *
     * @param {string} destinationCountry
     * @return {TokenRequest} token request
     */
    setDestinationCountry(destinationCountry) {
        this.requestPayload.destinationCountry = destinationCountry;
        return this;
    }
}
