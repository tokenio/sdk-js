class AuthContext {
    constructor(){
        this._onBehalfOf = undefined;
    }

    set onBehalfOf(onBehalfOf) {
        this._onBehalfOf = onBehalfOf
    }

    get onBehalfOf() {
        return this._onBehalfOf;
    }
}

export default AuthContext;