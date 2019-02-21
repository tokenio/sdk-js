// @flow
import TokenRequestBuilder from './TokenRequestBuilder';
import type {TransferEndpoint} from '@token-io/core';

export default class TransferTokenRequestBuilder extends TokenRequestBuilder {
    /**
     * Use TokenClient::createTransferTokenRequest.
     */
    constructor(payload: Object) {
        super(payload);
        this.requestPayload.transferBody.destinations = [];
    }

    /**
     * Sets the maximum amount per charge on a transfer token request.
     *
     * @param amount
     * @return TransferTokenRequestBuilder
     */
    setChargeAmount(amount: number | string): TransferTokenRequestBuilder {
        this.requestPayload.transferBody.amount = amount.toString();
        return this;
    }

    /**
     * Adds a transfer destination to a transfer token request.
     *
     * @param destination
     * @return TransferTokenRequestBuilder
     */
    addDestination(destination: TransferEndpoint): TransferTokenRequestBuilder {
        this.requestPayload.transferBody.destinations.push(destination);
        return this;
    }

    /**
     * Adds multiple transfer destinations to a transfer token request.
     *
     * @param destinations
     * @return TransferTokenRequestBuilder
     */
    addDestinations(destinations: Array<TransferEndpoint>): TransferTokenRequestBuilder {
        this.requestPayload.transferBody.destinations.push(...destinations);
        return this;
    }

    /**
     * Sets the destination country in order to narrow down
     * the country selection in the web-app UI.
     *
     * @param destinationCountry
     * @return TransferTokenRequestBuilder
     */
    setDestinationCountry(destinationCountry: string): TransferTokenRequestBuilder {
        this.requestPayload.destinationCountry = destinationCountry;
        return this;
    }
}
