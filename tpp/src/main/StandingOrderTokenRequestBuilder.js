// @flow
import TokenRequestBuilder from './TokenRequestBuilder';
import type {TransferDestination, TransferEndpoint} from '@token-io/core';

export default class StandingOrderTokenRequestBuilder extends TokenRequestBuilder {
    /**
     * Use TokenClient::createStandingOrderTokenRequest.
     */
    constructor(payload: Object) {
        super(payload);
    }

    /**
     * Sets the maximum amount per charge on a standing order token request.
     *
     * @param amount
     * @return StandingOrderTokenRequestBuilder
     */
    setChargeAmount(amount: number | string): StandingOrderTokenRequestBuilder {
        this.requestPayload.standingOrderBody.amount = amount.toString();
        return this;
    }

    /**
     * Sets the currency for each charge in the standing order token request.
     *
     * @param currency
     * @return StandingOrderTokenRequestBuilder
     */
    setCurrency(currency: string): StandingOrderTokenRequestBuilder {
        this.requestPayload.standingOrderBody.currency = currency;
        return this;
    }

    /**
     * Sets the frequency of the standing order token request.
     *
     * @param frequency
     * @return StandingOrderTokenRequestBuilder
     */
    setFrequency(frequency: string): StandingOrderTokenRequestBuilder {
        this.requestPayload.standingOrderBody.frequency = frequency;
        return this;
    }

    /**
     * Sets the start date of the standing order token request. ISO 8601: YYYY-MM-DD or YYYYMMDD.
     *
     * @param startDate
     * @return StandingOrderTokenRequestBuilder
     */
    setStartDate(startDate: string): StandingOrderTokenRequestBuilder {
        this.requestPayload.standingOrderBody.startDate = startDate;
        return this;
    }

    /**
     * Sets the end date of the standing order token request. ISO 8601: YYYY-MM-DD or YYYYMMDD.
     * If not specified, the standing order will occur indefinitely.
     *
     * @param endDate
     * @return StandingOrderTokenRequestBuilder
     */
    setEndDate(endDate: string): StandingOrderTokenRequestBuilder {
        this.requestPayload.standingOrderBody.endDate = endDate;
        return this;
    }

    /**
     * Adds a transfer destination to a standing order token request.
     *
     * @param destination
     * @return StandingOrderTokenRequestBuilder
     */
    addTransferDestination(destination: TransferDestination): StandingOrderTokenRequestBuilder {
        if (!this.requestPayload.standingOrderBody.instructions) {
            this.requestPayload.standingOrderBody.instructions = {
                transferDestinations: [],
            };
        }
        else if (!this.requestPayload.standingOrderBody.instructions.transferDestinations) {
            this.requestPayload.standingOrderBody.instructions.transferDestinations = [];
        }
        this.requestPayload.standingOrderBody.instructions.transferDestinations.push(destination);
        return this;
    }

    /**
     * Sets the destination country in order to narrow down
     * the country selection in the web-app UI.
     *
     * @param destinationCountry
     * @return StandingOrderTokenRequestBuilder
     */
    setDestinationCountry(destinationCountry: string): StandingOrderTokenRequestBuilder {
        this.requestPayload.destinationCountry = destinationCountry;
        return this;
    }

    /**
     * Sets the meta data for a specific provider
     *
     * @param metadata
     * @return StandingOrderTokenRequestBuilder
     */
    setProviderTransferMetadata(metadata: Object): StandingOrderTokenRequestBuilder {
        this.requestPayload.standingOrderBody.instructions.metadata = metadata;
        return this;
    }

    /**
     * Optional. Sets the source account to bypass account selection.
     *
     * @param source
     * @return StandingOrderTokenRequestBuilder
     */
    setSource(source: TransferEndpoint): StandingOrderTokenRequestBuilder {
        this.requestPayload.standingOrderBody.instructions = { source };
        return this;
    }
}
