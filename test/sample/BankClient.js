import {defaultCurrency} from "../../src/constants";
import Sample from "./Sample";
const axios = require('axios');

const urls = {
    local: 'http://localhost:8100',
    dev: 'http://dev.api.token.io:81',
    stg: 'http://stg.api.token.io:81',
    prd: 'http://prd.api.token.io:81',
}
const instance = axios.create({
    baseURL: urls[TEST_ENV]
});

export default {
    requestLinkAccounts: (
        username,
        balance = 100000,
        currency = defaultCurrency,
        accountName = "123") => {
        const randLastName = Sample.string();
        const randomAccNumber = Sample.string();

        return instance(
            {
                method: 'put',
                url: `/clients`,
                data: {
                    firstName: "JS Test",
                    lastName: "JS Testoff " + randLastName,
                }
            })
            .then(res => res.data.client)
            .then(client => {
                return instance(
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
                    })
                    .then(ignored => client);
            })
            .then(client => {
                return instance({
                    method: 'put',
                    url: `/clients/${client.id}/link-accounts`,
                    data: {
                        username: username,
                        accounts: [ randomAccNumber ]
                    }
                });
             })
             .then(res => res.data.accountLinkPayloads);
    }
};
