import {uriHostBank, defaultCurrency} from "../../src/constants";
import Sample from "./Sample";
const axios = require('axios');
const instance = axios.create({
    baseURL: uriHostBank
});

export default {
    requestLinkAccounts: (
        alias,
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
                        alias,
                        secret: "",
                        accounts: [ randomAccNumber ]
                    }
                });
             })
             .then(res => res.data.accountsLinkPayload);
    }
};
