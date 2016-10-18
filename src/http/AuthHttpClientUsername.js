import AuthHeader from "./AuthHeader";
import {urls} from "../constants";
const stringify = require('json-stable-stringify');
const axios = require('axios');

/**
 * Authenticated client for making requests to the Token gateway
 */
class AuthHttpClientUsername {
    constructor(env, username, keys){
        this._instance = axios.create({
            baseURL: urls[env]
        });

        const authHeader = new AuthHeader(urls[env], keys);

        this._instance.interceptors.request.use((config) => {
            authHeader.addAuthorizationHeaderUsername(username, config, undefined);
            return config;
        });
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