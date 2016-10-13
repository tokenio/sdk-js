import Crypto from "../Crypto";
import KeyLevel from "../main/KeyLevel";
import {uriHost} from "../constants";

const axios = require('axios');
const instance = axios.create({
    baseURL: uriHost
});

class UnauthenticatedClient {
    static createMemberId() {
        return instance({
            method: 'post',
            url: '/members'
        });
    }

    static notifyLinkAccounts(alias, bankId, accountsLinkPayload) {
        const req = {
            alias,
            bankId,
            accountsLinkPayload
        };
        const config = {
            method: 'put',
            url: `/devices/notifyLinkAccounts`,
            data: req
        };
        return instance(config);
    }

    static notifyAddKey(alias, publicKey, name) {
        const req = {
            alias,
            publicKey: Crypto.strKey(publicKey),
            name
        };
        const config = {
            method: 'put',
            url: `/devices/notifyAddKey`,
            data: req
        };
        return instance(config);
    }

    static aliasExists(alias) {
        const config = {
            method: 'get',
            url: `/alias-exists?alias=${alias}`
        }
        return instance(config);
     }

    static notifyLinkAccountsAndAddKey(alias, bankId, accountsLinkPayload,
                                       publicKey, name) {
        const req = {
            alias,
            bankId,
            accountsLinkPayload,
            publicKey: Crypto.strKey(publicKey),
            name
        };
        const config = {
            method: 'put',
            url: `/devices/notifyLinkAccountsAndAddKey`,
            data: req
        };
        return instance(config);
    }

    static notify(alias, notification) {
        const req = {
            alias,
            notification
        };
        const config = {
            method: 'post',
            url: `/notify`,
            data: req
        };
        return instance(config);
    }

    static addFirstKey(keys, memberId, keyLevel = KeyLevel.PRIVILEGED) {
        const update = {
            memberId: memberId,
            addKey: {
                publicKey: Crypto.strKey(keys.publicKey)
            }
        };

        if (keyLevel !== KeyLevel.PRIVILEGED) {
            update.addKey.level = keyLevel;
        }

        const req = {
            update,
            updateSignature: {
                keyId: keys.keyId,
                signature: Crypto.signJson(update, keys),
                timestampMs: new Date().getTime()
            }
        };
        const config = {
            method: 'post',
            url: `/members/${memberId}`,
            data: req
        };
        return instance(config);
    }
}

export default UnauthenticatedClient;
