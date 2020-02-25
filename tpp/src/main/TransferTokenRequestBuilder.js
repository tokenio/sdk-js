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
        else if (!this.requestPayload.transferBody.instructions.transferDestinations) {
            this.requestPayload.transferBody.instructions.transferDestinations = [];
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

    /**
     * Sets the execution date of the transfer. Used for future-dated payments.
     *
     * @param executionDate execution date
     * @return TransferTokenRequestBuilder
     */
    setExecutionDate(executionDate: string): TransferTokenRequestBuilder {
        this.requestPayload.transferBody.executionDate = executionDate;
        return this;
    }

    /**
     * Adds metadata for a specific provider.
     *
     * @param providerTransferMetadata provider-specific metadata
     * @return TransferTokenRequestBuilder
     */
    setProviderTransferMetadata(providerTransferMetadata: Object): TransferTokenRequestBuilder {
        if(!this.requestPayload.transferBody.instructions)
        {
            this.requestPayload.transferBody.instructions = {};
        }
        if(!this.requestPayload.transferBody.instructions.metadata)
        {
            this.requestPayload.transferBody.instructions.metadata = {};
        }
        this.requestPayload.transferBody.instructions.metadata.providerTransferMetadata = providerTransferMetadata;
        return this;
    }

    /**
     * Sets whether CAF should be attempted before transfer
     *
     * @param confirmFunds - whether to attempt CAF before transfer
     * @return TransferTokenRequestBuilder
     */
    setConfirmFunds(confirmFunds: boolean): TransferTokenRequestBuilder {
        this.requestPayload.transferBody.confirmFunds = confirmFunds;
        return this;
    }

    /**
     * Optional. In the scenario where TPP wishes to know the user's selection of country and
     * bank, TPP should provide this url so that Token can make a call with relevant
     * information as parameters. TPP can use that information to set transfer destination.
     *
     * @param url - URL
     * @return TransferTokenRequestBuilder
     */
    setSetTransferDestinationsUrl(url: string): TransferTokenRequestBuilder {
        this.requestPayload.transferBody.setTransferDestinationsUrl = url;
        return this;
    }

    /**
     * Optional. Sets the source account to bypass account selection.
     *
     * @param source
     * @return TransferTokenRequestBuilder
     */
    setSource(source: TransferEndpoint): TransferTokenRequestBuilder {
        if(!this.requestPayload.transferBody.instructions)
        {
            this.requestPayload.transferBody.instructions = {};
        }
        this.requestPayload.transferBody.instructions.source = source;
        return this;
    }
}
