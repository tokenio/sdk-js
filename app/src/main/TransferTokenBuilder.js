// @flow
import TokenBuilder from './TokenBuilder';
import config from '../config.json';
import Util from '../Util';
import type {
    Token,
    TransferEndpoint,
    PurposeOfPayment,
    TransferDestination,
} from '@token-io/core';

export default class TransferTokenBuilder extends TokenBuilder{
    client: Object;
    memberId: string;

    /**
     * Use Member::createTransferTokenBuilder.
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
     * @return TransferTokenBuilder
     */
    setAccountId(accountId: string): TransferTokenBuilder {
        this.tokenPayload.transfer.instructions.source = {
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
     * Sets the source bank if account is managed by a coop bank.
     *
     * @param bankId
     * @return TransferTokenBuilder
     * @deprecated use setSourceAccountGuest instead
     */
    setSourceAccountBank(bankId: string): TransferTokenBuilder {
        this.tokenPayload.transfer.instructions.source = {
            account: {
                bank: {
                    bankId,
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
     * @return TransferTokenBuilder
     */
    setCustomAuthorization(bankId: string, authorization: string): TransferTokenBuilder {
        this.tokenPayload.transfer.instructions.source = {
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
     * @returns TransferTokenBuilder
     * @deprecated use setSource instead
     */
    setSourceAccountGuest(bankId: string): TransferTokenBuilder {
        this.tokenPayload.transfer.instructions.source = {
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
     * @return TransferTokenBuilder
     */
    setSource(source: TransferEndpoint): TransferTokenBuilder {
        this.tokenPayload.transfer.instructions.source = source;
        return this;
    }

    /**
     * Sets the expiration date of the token.
     *
     * @param expiresAtMs - expiration date in milliseconds
     * @return TransferTokenBuilder
     */
    setExpiresAtMs(expiresAtMs: number | string): TransferTokenBuilder {
        this.tokenPayload.expiresAtMs = expiresAtMs;
        return this;
    }

    /**
     * Sets the maximum charge amount of the token.
     *
     * @param chargeAmount
     * @return TransferTokenBuilder
     */
    setChargeAmount(chargeAmount: number | string): TransferTokenBuilder {
        if (Util.countDecimals(parseFloat(chargeAmount)) > config.decimalPrecision) {
            throw new Error(
                `Number of decimals in amount should be at most ${config.decimalPrecision}`);
        }
        this.tokenPayload.transfer.amount = chargeAmount.toString();
        return this;
    }

    /**
     * Adds a transfer destination to the token.
     *
     * @param destination
     * @return TransferTokenBuilder
     */
    addTransferDestination(destination: TransferDestination): TransferTokenBuilder {
        this.tokenPayload.transfer.instructions.transferDestinations.push(destination);
        return this;
    }

    /**
     * @deprecated Use addTransferDestination instead.
     *
     * Adds a transfer destination to the token.
     *
     * @param endpoint
     * @return TransferTokenBuilder
     */
    addDestination(endpoint: TransferEndpoint): TransferTokenBuilder {
        this.tokenPayload.transfer.instructions.destinations.push(endpoint);
        return this;
    }

    /**
     * Adds multiple transfer destinations to the token.
     *
     * @param destinations
     * @return TransferTokenBuilder
     */
    addTransferDestinations(destinations: Array<TransferDestination>): TransferTokenBuilder {
        this.tokenPayload.transfer.instructions.transferDestinations.push(...destinations);
        return this;
    }

    /**
     * @deprecated Use addTransferDestinations instead.
     *
     * Adds multiple transfer destinations to the token.
     *
     * @param endpoints
     * @return TransferTokenBuilder
     */
    addDestinations(endpoints: Array<TransferEndpoint>): TransferTokenBuilder {
        this.tokenPayload.transfer.instructions.destinations.push(...endpoints);
        return this;
    }

    /**
     * Sets the purpose of payment of the token.
     *
     * @param purposeOfPayment
     * @return TransferTokenBuilder
     */
    setPurposeOfPayment(purposeOfPayment: PurposeOfPayment): TransferTokenBuilder {
        this.tokenPayload.transfer.instructions.metadata.transferPurpose = purposeOfPayment;
        return this;
    }

    /**
     * Sets the execution date of the transfer. Used for future-dated payments.
     *
     * @param executionDate execution date
     * @return builder
     */
    setExecutionDate(executionDate: string): TransferTokenBuilder {
        this.tokenPayload.transfer.executionDate = executionDate;
        return this;
    }

    /**
     *  Sets the flag indicating whether a receipt is requested.
     *
     * @param receiptRequested
     * @return TransferTokenBuilder
     */
    setReceiptRequested(receiptRequested: boolean): TransferTokenBuilder {
        this.tokenPayload.receiptRequested = receiptRequested;
        return this;
    }

    /**
     * Sets whether CAF should be attempted before transfer
     *
     * @param confirmFunds - whether to attempt CAF before transfer
     * @return TransferTokenBuilder
     */
    setConfirmFunds(confirmFunds: boolean): TransferTokenBuilder {
        this.tokenPayload.transfer.confirmFunds = confirmFunds;
        return this;
    }

    /**
     * Sets provider specific transfer metadata
     *
     * @param providerTransferMetadata
     * @return builder
     */
    setProviderTransferMetadata(providerTransferMetadata: Object): TransferTokenBuilder {
        this.tokenPayload.transfer.instructions.metadata.providerTransferMetadata = providerTransferMetadata;
        return this;
    }

    /**
     * Creates the token.
     *
     * @return the created transfer token
     * @deprecated - use Member::createToken
     */
    async execute(): Promise<Token> {
        return Util.callAsync(this.execute, async () => {
            if (!this.tokenPayload.transfer.instructions.source || (
                !this.tokenPayload.transfer.instructions.source.account.token &&
                !this.tokenPayload.transfer.instructions.source.account.bank &&
                !this.tokenPayload.transfer.instructions.source.account.custom)) {
                throw new Error('No source on token');
            }
            if (!this.tokenPayload.to
                || (!this.tokenPayload.to.alias && !this.tokenPayload.to.id)) {
                throw new Error('No redeemer on token');
            }
            const res = await this.client.createTransferToken(
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
