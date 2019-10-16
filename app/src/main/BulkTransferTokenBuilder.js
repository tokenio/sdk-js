// @flow
import TokenBuilder from './TokenBuilder';
import type {
    TransferEndpoint,
} from '@token-io/core';

export default class BulkTransferTokenBuilder extends TokenBuilder {
    client: Object;
    memberId: string;

    /**
     * Use Member::createBulkTransferTokenBuilder.
     */
    constructor(payload: Object, fromMemberId: string, client: Object) {
        super(payload, fromMemberId);
        this.client = client;
        this.memberId = fromMemberId;
    }

    /**
     * Sets the source account ID of the token.
     *
     * @param accountId
     * @return BulkTransferTokenBuilder
     */
    setAccountId(accountId: string): BulkTransferTokenBuilder {
        this.tokenPayload.bulkTransfer.source = {
            account: {
                token: {
                    memberId: this.memberId,
                    accountId,
                },
            },
        };
        return this;
    }
    /**
     * Adds a transfer source.
     *
     * @param source
     * @return BulkTransferTokenBuilder
     */
    setSource(source: TransferEndpoint): BulkTransferTokenBuilder {
        this.tokenPayload.bulkTransfer.source = source;
        return this;
    }

    /**
     * Sets the source bank for guest flows.
     *
     * @param bankId - source bank ID
     * @returns BulkTransferTokenBuilder
     */
    setSourceAccountGuest(bankId: string): BulkTransferTokenBuilder {
        this.tokenPayload.bulkTransfer.source = {
            account: {
                guest: {
                    bankId,
                },
            },
        };
        return this;
    }
    /**
     *  Sets the flag indicating whether a receipt is requested.
     *
     * @param receiptRequested
     * @return BulkTransferTokenBuilder
     */
    setReceiptRequested(receiptRequested: boolean): BulkTransferTokenBuilder {
        this.tokenPayload.receiptRequested = receiptRequested;
        return this;
    }
}
