/**
 * Class to add customer tracking metadata.
 */
class CustomerTrackingMetadataHeader {
    /**
     * Adds the customer tracking metadata in request config.
     *
     * @param {Object} config - config of the request
     * @param {AuthContext} context - auth context for access token redemption
     */
    addCustomerTrackingMetadata(config, context) {
        // if the customer initiated request flag is set to true,
        // we add it to the header, and reset the flag.
        if (context && context.customerInitiated) {
            context.customerInitiated = false;
            config.headers['customer-initiated'] = true;
        }

        if(context && Object.keys(context.customerTrackingMetadata).length > 0){
            if(context.customerTrackingMetadata.deviceId){
                config.headers['token-customer-device-id'] = context.customerTrackingMetadata.deviceId;
            }
            if(context.customerTrackingMetadata.geoLocation){
                config.headers['token-customer-geo-location'] = context.customerTrackingMetadata.geoLocation;
            }
            if(context.customerTrackingMetadata.ipAddress){
                config.headers['token-customer-ip-address'] = context.customerTrackingMetadata.ipAddress;
            }
            if(context.customerTrackingMetadata.userAgent){
                config.headers['token-customer-user-agent'] = context.customerTrackingMetadata.userAgent;
            }
            if (context.customerTrackingMetadata.jsonError){
                config.headers['token-json-error'] = context.customerTrackingMetadata.jsonError;
            }
        }
    }
}

export default CustomerTrackingMetadataHeader;
