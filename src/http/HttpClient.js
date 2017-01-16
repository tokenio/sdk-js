import Crypto from "../Crypto";
import {urls, KeyLevel} from "../constants";
import VersionHeader from "./VersionHeader";

const axios = require('axios');

class HttpClient {
    constructor(env){
        this._instance = axios.create({
            baseURL: urls[env]
        });

        this._versionHeader = new VersionHeader();
        this._instance.interceptors.request.use((config) => {
            this._versionHeader.addVersionHeader(config);
            return config;
        })
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

    addFirstKey(keys, memberId, keyLevel = KeyLevel.PRIVILEGED) {
        const update = {
            memberId: memberId,
            addKey: {
                level: keyLevel,
                publicKey: Crypto.strKey(keys.publicKey),
                algorithm: Crypto.algorithm()
            }
        };

        const req = {
            update,
            updateSignature: {
                memberId: memberId,
                keyId: keys.keyId,
                signature: Crypto.signJson(update, keys)
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
