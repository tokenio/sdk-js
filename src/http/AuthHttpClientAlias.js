import AuthHeader from "./AuthHeader";
import {urls} from "../constants";
const stringify = require('json-stable-stringify');
const axios = require('axios');

/**
 * Authenticated client for making requests to the Token gateway
 */
class AuthHttpClientAlias {
    constructor(env, alias, keys){
        this._instance = axios.create({
            baseURL: urls[env]
        });

        const authHeader = new AuthHeader(urls[env], keys);

        this._instance.interceptors.request.use((config) => {
            authHeader.addAuthorizationHeaderAlias(alias, config, undefined);
            return config;
        });
    }

    getMemberByAlias() {
        const config = {
            method: 'get',
            url: `/members`
        };
        return this._instance(config);
    }
}

export default AuthHttpClientAlias;