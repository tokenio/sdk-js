// @flow
import Util from '../Util';
import TokenBuilder from './TokenBuilder';
import type {Token} from '@token-io/core';

export default class AccessTokenBuilder extends TokenBuilder {
    client: Object;

    /**
     * Use Member::createAccessTokenBuilder.
     */
    constructor(payload: Object, fromMemberId: string, client: Object) {
        super(payload, fromMemberId);
        this.client = client;
    }

    /**
     * Grants access to an account.
     *
     * @param accountId
     * @return AccessTokenBuilder
     */
    forAccount(accountId: string): AccessTokenBuilder {
        this.tokenPayload.access.resources.push({
            account: {
                accountId,
            },
        });
        return this;
    }

    /**
     * Grants access to multiple accounts.
     *
     * @param accountIds
     * @return AccessTokenBuilder
     */
    forAccounts(accountIds: Array<string>): AccessTokenBuilder {
        accountIds.forEach(id => this.tokenPayload.access.resources.push({
            account: {
                accountId: id,
            },
        }));
        return this;
    }

    /**
     * Grants access to an account's balance.
     *
     * @param accountId
     * @return AccessTokenBuilder
     */
    forAccountBalance(accountId: string): AccessTokenBuilder {
        this.tokenPayload.access.resources.push({
            balance: {
                accountId,
            },
        });
        return this;
    }

    /**
     * Grants access to multiple accounts' balances.
     *
     * @param accountIds
     * @return AccessTokenBuilder
     */
    forAccountsBalances(accountIds: Array<string>): AccessTokenBuilder {
        accountIds.forEach(id => this.tokenPayload.access.resources.push({
            balance: {
                accountId: id,
            },
        }));
        return this;
    }

    /**
     * Grants access to an account's transactions.
     *
     * @param accountId
     * @return AccessTokenBuilder
     */
    forAccountTransactions(accountId: string): AccessTokenBuilder {
        this.tokenPayload.access.resources.push({
            transactions: {
                accountId,
            },
        });
        return this;
    }

    /**
     * Grants access to multiple accounts' transactions.
     *
     * @param accountIds
     * @return AccessTokenBuilder
     */
    forAccountsTransactions(accountIds: Array<string>): AccessTokenBuilder {
        accountIds.forEach(id => this.tokenPayload.access.resources.push({
            transactions: {
                accountId: id,
            },
        }));
        return this;
    }

    /**
     * Grants access to an account's transfer destinations.
     *
     * @param accountId
     * @return AccessTokenBuilder
     */
    forAccountTransferDestinations(accountId: string): AccessTokenBuilder {
        this.tokenPayload.access.resources.push({
            transferDestinations: {
                accountId,
            },
        });
        return this;
    }

    /**
     * Grants access to multiple accounts' transfer destinations.
     *
     * @param accountIds
     * @return AccessTokenBuilder
     */
    forAccountsTransferDestinations(accountIds: Array<string>): AccessTokenBuilder {
        accountIds.forEach(id => this.tokenPayload.access.resources.push({
            transferDestinations: {
                accountId: id,
            },
        }));
        return this;
    }

    /**
     * Grants access to confirming if an account has enough balance for a purchase.
     *
     * @param accountId
     * @return AccessTokenBuilder
     */
    forAccountFundsConfirmation(accountId: string): AccessTokenBuilder {
        this.tokenPayload.access.resources.push({
            fundsConfirmation: {
                accountId,
            },
        });
        return this;
    }

    /**
     * Grants access to confirming if various accounts have enough balance for a purchase.
     *
     * @param accountIds
     * @return AccessTokenBuilder
     */
    forAccountsFundsConfirmations(accountIds: Array<string>): AccessTokenBuilder {
        accountIds.forEach(id => this.tokenPayload.access.resources.push({
            fundsConfirmation: {
                accountId: id,
            },
        }));
        return this;
    }

    /**
     * Creates the token.
     *
     * @return the created access token
     */
    async execute(): Promise<Token> {
        return Util.callAsync(this.execute, async () => {
            if (this.tokenPayload.access.resources.length < 1) {
                throw new Error('Must have at least one resource');
            }
            if (!this.tokenPayload.to || (
                !this.tokenPayload.to.alias &&
                !this.tokenPayload.to.id)) {
                throw new Error('No recipient on token');
            }
            const res = await this.client.createAccessToken(
                this.tokenPayload,
                this.tokenRequestId);
            if (res.data.status === 'FAILURE_EXTERNAL_AUTHORIZATION_REQUIRED') {
                const error: Object = new Error('FAILURE_EXTERNAL_AUTHORIZATION_REQUIRED');
                error.authorizationDetails = res.data.authorizationDetails;
                throw error;
            }
            return res.data.token;
        });
    }
}
