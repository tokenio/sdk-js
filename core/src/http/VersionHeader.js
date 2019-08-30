/**
 * Class to add sdk version and type.
 */
class VersionHeader {
    /**
     * Adds the sdk type and version to the request config.
     *
     * @param {Object} config - config of the request
     */
    addVersionHeader(config) {
        config.headers['token-sdk'] = TOKEN_MEMBER;
        config.headers['token-sdk-version'] = TOKEN_VERSION;
    }
}

export default VersionHeader;
