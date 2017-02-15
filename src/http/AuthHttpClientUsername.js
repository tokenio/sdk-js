import AuthHeader from "./AuthHeader";
import VersionHeader from "./VersionHeader";
import {urls, KeyLevel} from "../constants";
const stringify = require('json-stable-stringify');
const axios = require('axios');

/**
 * Authenticated client for making requests to the Token gateway
 */
class AuthHttpClientUsername {
    constructor(env, username, cryptoEngine){
        this._instance = axios.create({
            baseURL: urls[env]
        });

        this._signerLow = cryptoEngine.createSigner(KeyLevel.LOW);

        const authHeader = new AuthHeader(urls[env], this._signerLow);
        this._instance.interceptors.request.use((config) => {
            authHeader.addAuthorizationHeaderUsername(username, config, undefined);
            return config;
        });

        const versionHeader = new VersionHeader();
        this._instance.interceptors.request.use((config) => {
            versionHeader.addVersionHeader(config);
            return config;
        })
    }

    getMemberByUsername() {
        const config = {
            method: 'get',
            url: `/members`
        };
        return this._instance(config);
    }
}

export default AuthHttpClientUsername;
