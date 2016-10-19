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

    usernameExists(username) {
        const config = {
            method: 'get',
            url: `/username-exists?username=${username}`
        }
        return this._instance(config);
    }

    notify(username, notification) {
        const req = {
            username,
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
