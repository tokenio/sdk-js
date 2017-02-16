import { tokenSdkVersion } from "../constants";

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
        config.headers['token-sdk'] = 'js';
        config.headers['token-sdk-version'] = tokenSdkVersion;
    }
}

export default VersionHeader;
