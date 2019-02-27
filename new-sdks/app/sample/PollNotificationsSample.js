/**
 * Sample code illustrating how to get a member's notifications.
 */
class PollNotificationsSample {
    /**
     * Create a member and subscribe.
     *
     * @param {Object} member - member to subscribe
     * @return {Object} subscription
     */
    static async subscribeMember(member) {
        const subscription = await member.subscribeToNotifications('iron');
        return subscription;
    }

    /**
     * Get member's notifications, perhaps trying a few times
     *
     * @param {Object} member - whose notifications to get
     */
    static async get(member) {
        let retries = 5;
        /**
         * poll for notifications
         */
        async function helper() {
            // getNotifications doc extract start:
            const pagedList = await member.getNotifications(null, 10);
            if (pagedList.notifications.length > 0) {
                const notification = pagedList.notifications[0];
                switch (notification.content.type) {
                case 'PAYEE_TRANSFER_PROCESSED':
                    // console.log('Transfer Processed: ', JSON.stringify(notification));
                    break;
                default:
                    // console.log('Got Notification: ', JSON.stringify(notification));
                    break;
                }
                return;
            }
            // getNotifications doc extract end
            if (retries >= 0) {
                retries -= 1;
                setTimeout(helper, 1000);
            }
        }
        helper();
    }
}
export default PollNotificationsSample;
