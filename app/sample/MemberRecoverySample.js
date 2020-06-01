// @flow
import Member from '../src/main/Member';
import type {MemberRecoveryOperation, Signature, RecoveryRule} from '@token-io/core';
import MemoryCryptoEngine from '@token-io/core/src/security/engines/MemoryCryptoEngine';

class MemberRecoverySample {
    agentMember: Member;

    async setUpDefaultRecoveryRule(member) {
        await member.useDefaultRecoveryRule();
    }

    /**
     * Recover previously-created member, assuming they were
     * configured with a "normal consumer" recovery rule.
     *
     * @param tokenClient - SDK client
     * @param alias - alias of member to recoverWithDefaultRule
     * @returns recovered member
     */
    async recoverWithDefaultRule(tokenClient, alias): Member {
        const verificationId = await tokenClient.beginRecovery(alias);
        const memberId = await tokenClient.getMemberId(alias);
        const engine = new MemoryCryptoEngine(memberId);

        // In the real world, we'd prompt the user to enter the code emailed to them.
        // Since our test member uses an auto-verify email address, any string will work,
        // so we use "1thru6".
        const recoveredMember = await tokenClient.completeRecoveryWithDefaultRule(
            memberId, verificationId, '1thru6', engine);

        // We can use the same verification code to re-claim this alias.
        await recoveredMember.verifyAlias(verificationId, '1thru6');
        return recoveredMember;
    }

    /**
     * Illustrate setting up a recovery rule more complex than "normal consumer"
     * mode, without the "normal consumer" shortcuts.
     *
     * @param newMember - newly created member we are setting up
     * @param tokenClient - SDK client
     * @param agentAlias - Alias of recovery agent.
     */
    async setUpComplexRecoveryRule(newMember, tokenClient, agentAlias) {
        tellRecoveryAgentMemberId(newMember.memberId);
        const prevHash = await newMember.lastHash();
        const agentId = await tokenClient.getMemberId(agentAlias);
        const recoveryRuleValue: RecoveryRule = {
            primaryAgent: agentId,
        };
        const recoveryRule = {
            recoveryRule: recoveryRuleValue,
        };
        await newMember.addRecoveryRule(prevHash, recoveryRule);
    }

    /**
     * Illustrate recovery using a not-normal-"consumer mode" recovery agent.
     *
     * @param tokenClient - SDK client
     * @param alias - Alias of member to recover
     * @return recovered member
     */
    async recoverWithComplexRule(tokenClient, alias): Member {
        const memberId = await tokenClient.getMemberId(alias);
        const engine = new MemoryCryptoEngine(memberId);
        const key = await engine.generateKey('PRIVILEGED');
        const verificationId = await tokenClient.beginRecovery(alias);
        const authorization = await tokenClient.createRecoveryAuthorization(memberId, key);

        // ask recovery agent to verify that I really am this member
        const signature = await this.getRecoveryAgentSignature(authorization);
        const memberRecoveryOperation: MemberRecoveryOperation = {
            authorization: authorization,
            agentSignature: signature,
        };
        const recoveredMember = await tokenClient.completeRecovery(
            memberId, Array.of(memberRecoveryOperation), key, engine);

        // after recovery, aliases aren't verified

        // In the real world, we'd prompt the user to enter the code emailed to them.
        // Since our test member uses an auto-verify email address, any string will work,
        // so we use "1thru6".
        await recoveredMember.verifyAlias(verificationId, '1thru6');
        return recoveredMember;
    }

    /**
     * Illustrate how a recovery agent signs an authorization.
     *
     * @param authorization - client's claim to be some member
     * @return if authorization seems legitimate, return signature; else error
     */
    getRecoveryAgentSignature(authorization): Signature {
        const isCorrect = checkMemberId(authorization.memberId);
        if (isCorrect) {
            return this.agentMember.authorizeRecovery(authorization);
        }
        throw new Error('I don\'t authorize this');
    }

}

function tellRecoveryAgentMemberId(memberId: string) {

}

/* this simple sample approves everybody */
function checkMemberId(memberId: string): boolean {
    return true;
}

export default MemberRecoverySample;
