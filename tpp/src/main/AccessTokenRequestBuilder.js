// @flow
import TokenRequestBuilder from './TokenRequestBuilder';

export default class AccessTokenRequestBuilder extends TokenRequestBuilder {
    /**
     * Use TokenClient::createAccessTokenRequest.
     */
    constructor(payload: Object) {
        super(payload);
    }

    /**
     * Optional. Sets the source account to bypass account selection.
     *
     * @param source
     * @return AccessTokenRequestBuilder
     */
    setSource(source: Object): AccessTokenRequestBuilder {
        if(!this.requestPayload.accessBody.resourceTypeList)
        {
            this.requestPayload.accessBody.resourceTypeList = {};
        }
        this.requestPayload.accessBody.resourceTypeList.source = source;
        return this;
    }
}
