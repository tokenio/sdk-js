import {TokenClient} from '../src';

const devKey = require('../src/config.json').devKey[TEST_ENV];
const Token = new TokenClient({env: TEST_ENV, developerKey: devKey, keyDir: './keys'});

/**
 * Sample code illustrating how to manage the webhook config/
 */
class WebhookSample {
    /**
     * Set a webhook config

     * @param {Object} tppAuthNumber authNumber of the TPP
     * @param {WebhookConfig} config - webhook config
     * @return empty
     */
    static async setWebhookConfig(tppAuthNumber, config) {
        await tppAuthNumber.setWebhookConfig(config);
    }

    /**
     * Get the webhook config

     * @param {Object} tppAuthNumber authNumber of the TPP
     * @return {Promise} promise of the webhook config
     */
    static async getWebhookConfig(tppAuthNumber) {
        return await tppAuthNumber.getWebhookConfig();
    }

    /**
     * Delete the webhook config

     * @param {Object} tppAuthNumber authNumber of the TPP
     * @return empty
     */
    static async deleteWebhookConfig(tppAuthNumber) {
        await tppAuthNumber.deleteWebhookConfig();
    }
}

export default WebhookSample;
