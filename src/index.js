import TokenIO from "./TokenIO";

const Token = {
  createMember: (alias) => {
    return TokenIO.createMember(alias);
  },
  login: (memberId, key) => {
  }
}

module.exports = Token;
