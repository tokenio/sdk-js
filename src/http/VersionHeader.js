import { tokenSdkVersion } from "../constants";

class VersionHeader {
    addVersionHeader(config) {
        config.headers['token-sdk'] = 'js';
        config.headers['token-sdk-version'] = tokenSdkVersion;
    }
}

export default VersionHeader;
