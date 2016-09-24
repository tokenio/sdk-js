import TokenIO from './main/TokenIO';

const Token = {
  createMember: (alias) => TokenIO.createMember(alias),

  login: (memberId, key) => TokenIO.loginMember(memberId, keys),
};

module.exports = Token;
