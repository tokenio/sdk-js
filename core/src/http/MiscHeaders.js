// @flow
const ALLOWED_PREFIX = 'token-trace-';

export const MISC_HEADERS = {
    TOKEN_TRACE_MEMBER_ID: 'token-trace-member-id',
};

/**
 * Class to add misc headers
 */
class MiscHeaders {
    /**
     * Adds the misc headers
     *
     * @param {Object} config - config of the request
     * @param {AuthContext} context - auth context for access token redemption
     */
    setMiscHeaders(config: Object, context: Object) {
        if(context && Object.keys(context.miscHeaders).length > 0){
            if (context.miscHeaders.jsonError){
                config.headers['token-json-error'] = context.miscHeaders.jsonError;
            }
            Object.entries(context.miscHeaders).forEach(([key, value]) => {
                if (key.startsWith(ALLOWED_PREFIX) && value !== undefined) {
                    config.headers[key] = value;
                }
            });
        }
    }
}

export default MiscHeaders;
