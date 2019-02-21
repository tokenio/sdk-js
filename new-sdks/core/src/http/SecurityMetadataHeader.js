import {base64Url} from '../security/Base64UrlCodec';
import stringify from 'fast-json-stable-stringify';

class SecurityMetadataHeader {
    /**
     * Initializes with security metadata to add to the request.
     *
     * @param {string} securityMetadata - security metadata
     */
    constructor(securityMetadata) {
        this._securityMetadata = securityMetadata;
    }

    /**
     * Adds security metadata to the request.
     *
     * @param {Object} request - request
     */
    addSecurityMetadataHeader(request) {
        if (this._securityMetadata) {
            request.headers['token-security-metadata'] =
                base64Url(stringify(this._securityMetadata));
        }
    }
}

export default SecurityMetadataHeader;
