import {uriHostBank, defaultCurrency} from "../../src/constants";
import Crypto from "../../src/Crypto";
const axios = require('axios');
const instance = axios.create({
    baseURL: uriHostBank
});

export default {
    requestLinkAccounts: (alias, balance = 100000, currency = defaultCurrency,
                          accountName = "123") => {
        const req = {
            alias,
            secret: "",
            metadata: {
                firstName: "Alice",
                lastName: "Roberts",
                balance,
                currency,
                accountName
            }
        };
        const randomAccNumber = Crypto.generateKeys().keyId;
        return instance({
            method: 'put',
            url: `/link/accounts/${randomAccNumber}`,
            data: req
        })
            .then(res => res.data);
    }
};
