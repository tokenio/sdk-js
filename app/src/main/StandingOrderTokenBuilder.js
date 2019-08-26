// @flow
import TokenBuilder from './TokenBuilder';
import config from '../config.json';
import Util from '../Util';
import type {
    TransferEndpoint,
    TransferDestination,
    PurposeOfPayment,
    Token,
} from '@token-io/core';

export default class StandingOrderTokenBuilder extends TokenBuilder {
    client: Object;
    memberId: string;

    /**
     * Use Member::createStandingOrderTokenBuilder.
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
     * @return StandingOrderTokenBuilder
     */
    setAccountId(accountId: string): StandingOrderTokenBuilder {
        this.tokenPayload.standingOrder.instructions.source = {
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
     * @return StandingOrderTokenBuilder
     */
    setCustomAuthorization(bankId: string, authorization: string): StandingOrderTokenBuilder {
        this.tokenPayload.standingOrder.instructions.source = {
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
     * @returns StandingOrderTokenBuilder
     */
    setSourceAccountGuest(bankId: string): StandingOrderTokenBuilder {
        this.tokenPayload.standingOrder.instructions.source = {
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
     * @return StandingOrderTokenBuilder
     */
    setSource(source: TransferEndpoint): StandingOrderTokenBuilder {
        this.tokenPayload.standingOrder.instructions.source = source;
        return this;
    }

    /**
     * Adds a transfer destination to the token.
     *
     * @param destination
     * @return StandingOrderTokenBuilder
     */
    addTransferDestination(destination: TransferDestination): StandingOrderTokenBuilder {
        this.tokenPayload.standingOrder.instructions.transferDestinations.push(destination);
        return this;
    }

    /**
     * Adds multiple transfer destinations to the token.
     *
     * @param destinations
     * @return StandingOrderTokenBuilder
     */
    addTransferDestinations(destinations: Array<TransferDestination>): StandingOrderTokenBuilder {
        this.tokenPayload.standingOrder.instructions.transferDestinations.push(...destinations);
        return this;
    }

    /**
     * Sets the provider transfer meta data.
     *
     * @param metadata
     * @return StandingOrderTokenBuilder
     */
    setProviderTransferMetadata(metadata: Object): StandingOrderTokenBuilder {
        this.tokenPayload.standingOrder.instructions.metadata = metadata;
        return this;
    }

    /**
     * Sets the purpose of payment of the token.
     *
     * @param purposeOfPayment
     * @return StandingOrderTokenBuilder
     */
    setPurposeOfPayment(purposeOfPayment: PurposeOfPayment): StandingOrderTokenBuilder {
        this.tokenPayload.standingOrder.instructions.metadata.transferPurpose = purposeOfPayment;
        return this;
    }

    /**
     *  Sets the flag indicating whether a receipt is requested.
     *
     * @param receiptRequested
     * @return StandingOrderTokenBuilder
     */
    setReceiptRequested(receiptRequested: boolean): StandingOrderTokenBuilder {
        this.tokenPayload.receiptRequested = receiptRequested;
        return this;
    }

    /**
     * Creates the token.
     *
     * @return the created standing order submission transfer token
     * @deprecated - use Member::createToken
     */
    async execute(): Promise<Token> {
        return Util.callAsync(this.execute, async () => {
            if (!this.tokenPayload.standingOrder.instructions.source || (
                !this.tokenPayload.standingOrder.instructions.source.account.token &&
                !this.tokenPayload.standingOrder.instructions.source.account.bank &&
                !this.tokenPayload.standingOrder.instructions.source.account.custom)) {
                throw new Error('No source on token');
            }
            if (!this.tokenPayload.to
                || (!this.tokenPayload.to.alias && !this.tokenPayload.to.id)) {
                throw new Error('No redeemer on token');
            }
            const res = await this.client.createStandingOrderToken(
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
