// @flow
import TokenRequestBuilder from './TokenRequestBuilder';
import type {TransferDestination} from '@token-io/core';

export default class RecurringTransferTokenRequestBuilder extends TokenRequestBuilder {
    /**
     * Use TokenClient::createTransferTokenRequest.
     */
    constructor(payload: Object) {
        super(payload);
    }

    /**
     * Adds a transfer destination to a transfer token request.
     *
     * @param destination
     * @return TransferTokenRequestBuilder
     */
    addTransferDestination(destination: TransferDestination): RecurringTransferTokenRequestBuilder {
        if (!this.requestPayload.recurringTransferBody.instructions) {
            this.requestPayload.recurringTransferBody.instructions = {
                transferDestinations: [],
            };
        }
        this.requestPayload.recurringTransferBody.instructions.transferDestinations.push(destination);
        return this;
    }

    /**
     * Sets the destination country in order to narrow down
     * the country selection in the web-app UI.
     *
     * @param destinationCountry
     * @return RecurringTransferTokenRequestBuilder
     */
    setDestinationCountry(destinationCountry: string): RecurringTransferTokenRequestBuilder {
        this.requestPayload.destinationCountry = destinationCountry;
        return this;
    }

    /**
     * Sets the meta data for a specific provider
     *
     * @param metadata
     * @return RecurringTransferTokenRequestBuilder
     */
    setProviderRecurringTransferMetadata(metadata: Object): RecurringTransferTokenRequestBuilder {
        this.requestPayload.recurringTransferBody.metadata = metadata;
        return this;
    }

}
