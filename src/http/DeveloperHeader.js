/**
 * Class to add sdk developer key.
 */
class DeveloperHeader {
    /**
     * Initializes the developer header with the developer key.
     *
     * @param {string} developerKey - the developer key, by default empty
     */
    constructor(developerKey = '') {
        this._developerKey = developerKey;
    }

    /**
     * Adds the developer key to the request config if not empty.
     *
     * @param {Object} config - config of the request
     */
    addDeveloperHeader(config) {
        if (this._developerKey === '') {
            throw new ReferenceError('Please provide a developer key.' +
            ' Contact Token for more details.');
        } else {
            config.headers['token-dev-key'] = this._developerKey;
        }
    }
}

export default DeveloperHeader;
