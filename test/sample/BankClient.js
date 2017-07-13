import {defaultCurrency} from "../../src/constants";
const axios = require('axios');
import 'babel-regenerator-runtime';
const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);
const TEST_BIC = 'IRONUSCA000'

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
    getNotifications: async(subscriberId) => {
        const res = await instance({
            method: 'get',
            url: `/subscribers/${subscriberId}/notifications`,
        });
        return res.data.notifications;
    },

    getNotification: async(subscriberId, notificationId) => {
        const res = await instance({
            method: 'get',
            url: `/subscribers/${subscriberId}/notifications/${notificationId}`,
        });
        return res.data.notification;
    }
};
