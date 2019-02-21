// @flow
import TokenRequestBuilder from './TokenRequestBuilder';

export default class AccessTokenRequestBuilder extends TokenRequestBuilder {
    /**
     * Use TokenClient::createAccessTokenRequest.
     */
    constructor(payload: Object) {
        super(payload);
    }
}
