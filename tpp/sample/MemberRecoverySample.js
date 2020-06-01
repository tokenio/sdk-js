// @flow
import Member from '../src/main/Member';
import type {RecoveryRule, MemberRecoveryOperation, Signature} from '@token-io/core';
import MemoryCryptoEngine from '../../core/src/security/engines/MemoryCryptoEngine';

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
     * @param {Object} alias - alias of member to recoverWithDefaultRule
     * @returns {Member} recovered member
     */
    async recoverWithDefaultRule(tokenClient, alias): Member {
        const verificationId = await tokenClient.beginRecovery(alias);
        const memberId = await tokenClient.getMemberId(alias);
        const cryptoEngine = new MemoryCryptoEngine(memberId);

        // In the real world, we'd prompt the user to enter the code emailed to them.
        // Since our test member uses an auto-verify email address, any string will work,
        // so we use "1thru6".
        const recoveredMember = await tokenClient.completeRecoveryWithDefaultRule(
            memberId, verificationId, '1thru6', cryptoEngine);
        // We can use the same verification code to re-claim this alias.
        await recoveredMember.verifyAlias(verificationId, '1thru6');
        return recoveredMember;
    }

    /**
     * Illustrate setting up a recovery rule more complex than "normal consumer"
     * mode, without the "normal consumer" shortcuts.
     *
     * @param {Member} newMember - newly-created member we are setting up
     * @param tokenClient - SDK client
     * @param {Object} agentAlias - Alias of recovery agent
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
     * @returns recovered member.
     */
    async recoverWithComplexRule(tokenClient, alias): Member {
        const memberId = await tokenClient.getMemberId(alias);
        const cryptoEngine = new MemoryCryptoEngine(memberId);
        const key = await cryptoEngine.generateKey('PRIVILEGED');
        const verificationId = await tokenClient.beginRecovery(alias);
        const authorization = await tokenClient.createRecoveryAuthorization(memberId, key);
        const signature = await this.getRecoveryAgentSignature(authorization);
        const memberRecoveryOperation: MemberRecoveryOperation = {
            authorization: authorization,
            agentSignature: signature,
        };
        const recoveredMember = await tokenClient.completeRecovery(
            memberId, Array.of(memberRecoveryOperation), key, cryptoEngine);
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
