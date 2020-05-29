// @flow
import type {OpenBankingStandard} from '@token-io/core';

class ExternalMetadata{
    openBankingStandard: OpenBankingStandard;
    consent: string;

    /**
     * Instantiates a new external metadata instance.
     *
     * @param openBankingStandard the open banking standard
     * @param consent the consent
     */
    constructor(openBankingStandard: OpenBankingStandard, consent: string) {
        this.openBankingStandard = openBankingStandard;
        this.consent = consent;
    }

    getOpenBankingStandard(): OpenBankingStandard{
        return this.openBankingStandard;
    }

    getConsent(): string{
        return this.consent;
    }
}

export default ExternalMetadata;
