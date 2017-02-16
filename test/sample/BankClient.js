import {defaultCurrency} from "../../src/constants";
const axios = require('axios');
import 'babel-regenerator-runtime';
const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

const urls = {
    local: 'http://localhost:8100',
    dev: 'https://fank.dev.token.io',
    stg: 'https://fank.stg.token.io',
    prd: 'https://fank.token.io',
}
const instance = axios.create({
    baseURL: urls[TEST_ENV]
});

export default {
    requestLinkAccounts: async (
            username,
            balance = 100000,
            currency = defaultCurrency,
            accountName = "123") => {

        const randLastName = Token.Util.generateNonce();
        const randomAccNumber = Token.Util.generateNonce();

        const res = await instance(
            {
                method: 'put',
                url: `/clients`,
                data: {
                    firstName: "JS Test",
                    lastName: "JS Testoff " + randLastName,
                }
            });
        const client = res.data.client;
        await instance(
            {
                method: 'put',
                url: `/clients/${client.id}/accounts`,
                data: {
                    name: accountName,
                    account_number: randomAccNumber,
                    balance: {
                        value: balance,
                        currency: currency
                    }
                }
            });
        const res2 = await instance({
                    method: 'put',
                    url: `/clients/${client.id}/link-accounts`,
                    data: {
                        username: username,
                        accounts: [ randomAccNumber ]
                    }
                });
        return res2.data.payloads;
    }
};
