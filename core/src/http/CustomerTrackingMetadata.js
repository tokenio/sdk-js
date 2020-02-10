import {base64Url} from '../security/Base64UrlCodec';
import stringify from 'fast-json-stable-stringify';

class CustomerTrackingMetadata {
    /**
     * Initializes with customer tracking metadata to add to the request.
     *
     * @param {string} customerTrackingData - customer tracking metadata
     */
    constructor(customerTrackingData) {
        this._customerTrackingData = customerTrackingData;
    }

    /**
     * Adds customer tracking metadata to the request.
     *
     * @param {Object} request - request
     */
    addCustomerTrackingData(request) {
        if(Object.keys(this._customerTrackingData).length > 0){
            if(this._customerTrackingData.deviceId !== undefined){
                request.headers['token-customer-device-id'] = this._customerTrackingData['deviceId'];
            }
            if(this._customerTrackingData.geoLocation !== undefined){
                request.headers['token-customer-geo-location'] = this._customerTrackingData['geoLocation'];
            }
            if(this._customerTrackingData.ipAddress !== undefined){
                request.headers['token-customer-ip-address'] = this._customerTrackingData['ipAddress'];
            }
        }
    }
}

export default CustomerTrackingMetadata;
