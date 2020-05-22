import CreateMemberSample from '../../sample/CreateMemberSample';
import WebhookSample from '../../sample/WebhookSample';
const {assert} = require('chai');

describe('WebhookSample test', () => {
    it('Should manage the webhook', async () => {
        const config = {
            url: 'http://example.token.io/webhook',
            type: ['TRANSFER_STATUS_CHANGED'],
        };
        const member = await CreateMemberSample();

        await WebhookSample.setWebhookConfig(member, config);

        const res = await WebhookSample.getWebhookConfig(member);
        assert.isOk(res.url);
        assert.isOk(res.type);

        await WebhookSample.deleteWebhookConfig(member);
    });
});
