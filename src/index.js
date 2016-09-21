import TokenIO from "./TokenIO";


const Token = {
  createMember: (alias) => {
    return TokenIO.createMember(alias);
  }

}

module.exports = Token;
