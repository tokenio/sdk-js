// @flow
import type {TransferDestination} from '@token-io/core';
import TokenRequestBuilder from './TokenRequestBuilder';

export default class AccessTokenRequestBuilder extends TokenRequestBuilder {
    /**
     * Use TokenClient::createAccessTokenRequest.
     */
    constructor(payload: Object) {
        super(payload);
    }

    /**
     * Optional. Sets the source account to bypass account selection.
     *
     * @param source
     * @return AccessTokenRequestBuilder
     */
    setSource(source: Object): AccessTokenRequestBuilder {
        if(!this.requestPayload.accessBody.resourceTypeList)
        {
            this.requestPayload.accessBody.resourceTypeList = {};
        }
        this.requestPayload.accessBody.resourceTypeList.source = source;
        return this;
    }

    /**
     * Adds a transfer destination to a access token request.
     *
     * @param destination
     * @return AccessTokenRequestBuilder
     */
    addTransferDestination(destination: TransferDestination): AccessTokenRequestBuilder {
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
}
