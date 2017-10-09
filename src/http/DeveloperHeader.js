import config from "../config.json";
/**
 * Class to add sdk developer key.
 */
class DeveloperHeader {
    /**
     * Adds the developer key the request config.
     *
     * @param {Object} conf - config of the request
     */
    addDeveloperHeader(conf) {
        conf.headers['token-dev-key'] = config.developerKey;
    }
}

export default DeveloperHeader;
