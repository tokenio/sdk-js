import Crypto from "../security/Crypto";
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

    getMemberId(username) {
        const config = {
            method: 'get',
            url: `/memberid?username=${username}`
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

    approveFirstKey(memberId, key, cryptoEngine) {
        const signer = cryptoEngine.createSigner(KeyLevel.PRIVILEGED);
        const update = {
            memberId: memberId,
            operations: [
                {
                    addKey: {
                        key: {
                            id: key.id,
                            publicKey: Crypto.strKey(key.publicKey),
                            level: key.level,
                            algorithm: key.algorithm
                        }
                    }
                }
            ]
        };
        const req = {
            update,
            updateSignature: {
                memberId: memberId,
                keyId: signer.getKeyId(),
                signature: signer.signJson(update)
            }
        };
        const config = {
            method: 'post',
            url: `/members/${memberId}/updates`,
            data: req
        };
        return this._instance(config);
    }

    approveFirstKeys(memberId, keys, cryptoEngine) {
        const signer = cryptoEngine.createSigner(KeyLevel.PRIVILEGED);
        const update = {
            memberId: memberId,
            operations: keys.map((key) => ({
                addKey: {
                    key: {
                        id: key.id,
                        publicKey: Crypto.strKey(key.publicKey),
                        level: key.level,
                        algorithm: key.algorithm
                    }
                }
            })),
        };
        const req = {
            update,
            updateSignature: {
                memberId: memberId,
                keyId: signer.getKeyId(),
                signature: signer.signJson(update)
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
