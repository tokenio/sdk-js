import Crypto from "../Crypto";
import KeyLevel from "../main/KeyLevel";
import {urls} from "../constants";

const axios = require('axios');

class HttpClient {
    constructor(env){
        this._instance = axios.create({
            baseURL: urls[env]
        });
    }

    createMemberId() {
        const config = {
            method: 'post',
            url: '/members'
        };
        return this._instance(config);
    }

    notifyLinkAccounts(alias, bankId, accountsLinkPayload) {
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
        return this._instance(config);
    }

    notifyAddKey(alias, publicKey, name) {
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
        return this._instance(config);
    }

    aliasExists(alias) {
        const config = {
            method: 'get',
            url: `/alias-exists?alias=${alias}`
        }
        return this._instance(config);
     }

    notifyLinkAccountsAndAddKey(alias, bankId, accountsLinkPayload,
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
        return this._instance(config);
    }

    notify(alias, notification) {
        const req = {
            alias,
            notification
        };
        const config = {
            method: 'post',
            url: `/notify`,
            data: req
        };
        return this._instance(config);
    }

    addFirstKey(keys, memberId, keyLevel = KeyLevel.PRIVILEGED) {
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
        return this._instance(config);
    }
}

export default HttpClient;
