// @flow
import TokenRequestBuilder from './TokenRequestBuilder';
import type {TransferEndpoint, TransferDestination} from '@token-io/core';

export default class TransferTokenRequestBuilder extends TokenRequestBuilder {
    /**
     * Use TokenClient::createTransferTokenRequest.
     */
    constructor(payload: Object) {
        super(payload);
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
    addTransferDestination(destination: TransferDestination): TransferTokenRequestBuilder {
        if (!this.requestPayload.transferBody.instructions) {
            this.requestPayload.transferBody.instructions = {
                transferDestinations: [],
            };
        }
        this.requestPayload.transferBody.instructions.transferDestinations.push(destination);
        return this;
    }

    /**
     * Adds multiple transfer destinations to a transfer token request.
     *
     * @param destinations
     * @return TransferTokenRequestBuilder
     */
    addTransferDestinations(destinations: Array<TransferDestination>): TransferTokenRequestBuilder {
        if (!this.requestPayload.transferBody.instructions) {
            this.requestPayload.transferBody.instructions = {
                transferDestinations: [],
            };
        }
        this.requestPayload.transferBody.instructions.transferDestinations.push(...destinations);
        return this;
    }

    /**
     * @deprecated Use addTransferDestination instead.
     *
     * Adds a transfer destination to a transfer token request.
     *
     * @param destination
     * @return TransferTokenRequestBuilder
     */
    addDestination(destination: TransferEndpoint): TransferTokenRequestBuilder {
        if (!this.requestPayload.transferBody.destinations) {
            this.requestPayload.transferBody.destinations = [];
        }
        this.requestPayload.transferBody.destinations.push(destination);
        return this;
    }

    /**
     * @deprecated Use addTransferDestinations instead.
     *
     * Adds multiple transfer destinations to a transfer token request.
     *
     * @param destinations
     * @return TransferTokenRequestBuilder
     */
    addDestinations(destinations: Array<TransferEndpoint>): TransferTokenRequestBuilder {
        if (!this.requestPayload.transferBody.destinations) {
            this.requestPayload.transferBody.destinations = [];
        }
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

    setExecutionDate(executionDate: string): TransferTokenRequestBuilder {
        this.requestPayload.executionDate = executionDate;
        return this;
    }

    setProviderTransferMetadata(metadata: Object): TransferTokenRequestBuilder {
        this.requestPayload.transferBody.instructions.metadata = metadata;
        return this;
    }
}
