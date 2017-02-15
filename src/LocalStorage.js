import Member from "./main/Member";
import Crypto from "./security/Crypto";

class LocalStorage {
    static saveMember(member) {
        if (!BROWSER) {
            throw new Error("Browser Only");
        }
        const payload = {
            memberId: member.id,
            keys: {
                publicKey: Crypto.strKey(member.keys.publicKey),
                secretKey: Crypto.strKey(member.keys.secretKey),
                id: member.keys.id
            }
        };
        window.localStorage.member = JSON.stringify(payload);
    }

    static loadMember(env) {
        if (!BROWSER) {
            throw new Error("Browser Only");
        }
        const loaded = JSON.parse(window.localStorage.member);
        const correctKeys = {
            publicKey: Crypto.bufferKey(loaded.keys.publicKey),
            secretKey: Crypto.bufferKey(loaded.keys.secretKey),
            id: loaded.keys.id
        };
        return new Member(env, loaded.memberId, correctKeys);
    }
}
export default LocalStorage;
