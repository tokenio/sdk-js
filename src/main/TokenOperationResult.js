export default class TokenOperationResult {
    constructor(resultObj, newToken) {
        this._status = resultObj.status;
        this._token = newToken;
    }

    static get Status() {
        return {
            INVALID: 'INVALID',
            SUCCESS: 'SUCCESS',
            MORE_SIGNATURES_NEEDED: 'MORE_SIGNATURES_NEEDED'
        }
    }

    get status() {
        return this._status;
    }

    get token() {
        return this._token;
    }
}