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
}
