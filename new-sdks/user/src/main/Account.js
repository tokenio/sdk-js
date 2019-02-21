// @flow
import {Account as CoreAccount} from '@token-io/core';
import Util from '../Util';
import type Member from './Member';

export default class Account extends CoreAccount {
    /**
     * User Member::getAccount(s).
     */
    constructor(account: Object, member: Member) {
        super(account, member);
    }

    /**
     * Looks up if this account is default.
     * @return whether this account is default
     */
    isDefault(): Promise<boolean> {
        return Util.callAsync(this.isDefault, async () => {
            const defaultAcc = await this.accountMember.getDefaultAccount();
            return defaultAcc && defaultAcc.id === this.account.id;
        });
    }

    /**
     * Sets this account as the member's default account.
     * @return empty promise
     */
    setAsDefault(): Promise<void> {
        return Util.callAsync(this.setAsDefault, async () => {
            await this.accountMember._client
                .setDefaultAccount(this.account.id, this.accountMember.memberId());
        });
    }
}
