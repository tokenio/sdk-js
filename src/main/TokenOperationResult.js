export default class TokenOperationResult {
    constructor(resultObj, newToken) {
        this._status = resultObj.status;
        this._token = newToken;
    }

    get status() {
        return this._status;
    }

    get token() {
        return this._token;
    }
}