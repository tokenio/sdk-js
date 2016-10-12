export default class Subscriber {
    constructor(subscriberObj) {
        this._id = subscriberObj.id;
        this._target = subscriberObj.target;
        this._platform = subscriberObj.platform;
    }

    get id() {
        return this._id;
    }

    get target() {
        return this._target;
    }

    get platform() {
        return this._platform;
    }
}