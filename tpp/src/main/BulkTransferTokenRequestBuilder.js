// @flow
import TokenRequestBuilder from './TokenRequestBuilder';
import type {TransferEndpoint, TransferDestination} from '@token-io/core';

export default class BulkTransferTokenRequestBuilder extends TokenRequestBuilder {
    /**
     * Use TokenClient::createBulkTransferTokenRequest.
     */
    constructor(payload: Object) {
        super(payload);
    }

    /**
     * Adds a transfer source.
     *
     * @param source
     * @return BulkTransferTokenBuilder
     */
    setSource(source: TransferEndpoint): BulkTransferTokenRequestBuilder {
        this.requestPayload.bulkTransferBody.source = source;
        return this;
    }
}
