// @flow
import TokenBuilder from './TokenBuilder';
import config from '../config.json';
import Util from '../Util';
import type {
    TransferEndpoint,
    TransferDestination,
    PurposeOfPayment,
} from '@token-io/core';

export default class RecurringTransferBuilder extends TokenBuilder {
    client: Object;
    memberId: string;

    /**
     * Use Member::createRecurringTransferTokenBuilder.
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
     * @return RecurringTransferTokenBuilder
     */
    setAccountId(accountId: string): RecurringTransferTokenBuilder {
        this.tokenPayload.recurringTransfer.instructions.source = {
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
     * Sets the source custom authorization.
     *
     * @param bankId - source bank ID
     * @param authorization - source custom authorization
     * @return RecurringTransferTokenBuilder
     */
    setCustomAuthorization(bankId: string, authorization: string): RecurringTransferTokenBuilder {
        this.tokenPayload.recurringTransfer.instructions.source = {
            account: {
                custom: {
                    bankId,
                    payload: authorization,
                },
            },
        };
        return this;
    }

    /**
     * Sets the source bank for guest flows.
     *
     * @param bankId - source bank ID
     * @returns RecurringTransferTokenBuilder
     */
    setSourceAccountGuest(bankId: string): RecurringTransferTokenBuilder {
        this.tokenPayload.recurringTransfer.instructions.source = {
            account: {
                guest: {
                    bankId,
                },
            },
        };
        return this;
    }

    /**
     * Sets the transfer source if the above methods do not apply.
     *
     * @param source
     * @return RecurringTransferTokenBuilder
     */
    setSource(source: TransferEndpoint): RecurringTransferTokenBuilder {
        this.tokenPayload.recurringTransfer.instructions.source = source;
        return this;
    }

    /**
     * Adds a transfer destination to the token.
     *
     * @param destination
     * @return RecurringTransferTokenBuilder
     */
    addTransferDestination(destination: TransferDestination): RecurringTransferTokenBuilder {
        this.tokenPayload.recurringTransfer.instructions.transferDestinations.push(destination);
        return this;
    }

    /**
     * Sets the provider recurring transfer meta data.
     *
     * @param metadata
     * @return RecurringTransferTokenRequestBuilder
     */
    setProviderRecurringTransferMetadata(metadata: Object): RecurringTransferTokenBuilder {
        this.tokenPayload.recurringTransferBody.instructions.metadata = metadata;
        return this;
    }

    /**
     * Sets the purpose of payment of the token.
     *
     * @param purposeOfPayment
     * @return RecurringTransferTokenBuilder
     */
    setPurposeOfPayment(purposeOfPayment: PurposeOfPayment): RecurringTransferTokenBuilder {
        this.tokenPayload.recurringTransfer.instructions.metadata.transferPurpose = purposeOfPayment;
        return this;
    }

    /**
     *  Sets the flag indicating whether a receipt is requested.
     *
     * @param receiptRequested
     * @return RecurringTransferTokenBuilder
     */
    setReceiptRequested(receiptRequested: boolean): RecurringTransferTokenBuilder {
        this.tokenPayload.receiptRequested = receiptRequested;
        return this;
    }

    /**
     * Creates the token.
     *
     * @return the created recurring transfer token
     */
    async execute(): Promise<Token> {
        return Util.callAsync(this.execute, async () => {
            if (!this.tokenPayload.recurringTransfer.instructions.source || (
                !this.tokenPayload.recurringTransfer.instructions.source.account.token &&
                !this.tokenPayload.recurringTransfer.instructions.source.account.bank &&
                !this.tokenPayload.recurringTransfer.instructions.source.account.custom)) {
                throw new Error('No source on token');
            }
            if (!this.tokenPayload.to
                || (!this.tokenPayload.to.alias && !this.tokenPayload.to.id)) {
                throw new Error('No redeemer on token');
            }
            const res = await this.client.createRecurringTransferToken(
                this.tokenPayload,
                this.tokenRequestId);
            if (res.data.status === 'FAILURE_EXTERNAL_AUTHORIZATION_REQUIRED') {
                const error: Object = new Error('FAILURE_EXTERNAL_AUTHORIZATION_REQUIRED');
                error.authorizationDetails = res.data.authorizationDetails;
                throw error;
            }
            if (res.data.status !== 'SUCCESS') {
                throw new Error(res.data.status);
            }
            return res.data.token;
        });
    }
}
