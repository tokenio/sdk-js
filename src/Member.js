class Member {
  constructor(memberId, aliases, privateKeys) {
    this._memberId = memberId;
    this._aliases = aliases;
    this._privateKeys = privateKeys;
  }

  get memberId() {
    return this._memberId;
  }

  doSomething(){
    console.log("Doing something in member");
  }
}

export default Member;
