class TestUtil {
    /**
     * Retries the supplied function until it either runs successfully or the timeout has passed.
     *
     * @param {function} fn - function to run until success or timeout
     * @param {number} timeoutMs - milliseconds to wait before timing out
     * @param {number} waitTimeMs - milliseconds to wait after failed invocation of the supplied
     *                              function before retrying
     */
    static async waitUntil(fn, timeoutMs = 10000, waitTimeMs = 500) {
        const start = Date.now();
        // eslint-disable-next-line no-constant-condition
        while (true) {
            try {
                await fn();
                return;
            } catch (e) {
                if (Date.now() - start > timeoutMs) {
                    throw e;
                }
                await new Promise((resolve, reject) => setTimeout(resolve, waitTimeMs));
            }
        }
    }
}
export default TestUtil;
