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
        };
        return this._instance(config);
    }

    notify(username, body) {
        const req = {
            username,
            body
        };
        const config = {
            method: 'post',
            url: `/notify`,
            data: req
        };
        return this._instance(config);
    }

    addFirstKey(memberId, key, level = KeyLevel.PRIVILEGED) {
        const update = {
            memberId: memberId,
            addKey: {
                level: level,
                algorithm: key.algorithm,
                publicKey: Crypto.strKey(key.publicKey)
            }
        };

        const req = {
            update,
            updateSignature: {
                memberId: memberId,
                keyId: key.keyId,
                signature: Crypto.signJson(update, key)
            }
        };
        const config = {
            method: 'post',
            url: `/members/${memberId}/updates`,
            data: req
        };
        return this._instance(config);
    }
}

export default HttpClient;
