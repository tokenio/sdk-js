import TokenIO from './main/TokenIO';

// Promise polyfill for IE and older browsers
require('es6-promise').polyfill();

const Token = {
  createMember: alias => TokenIO.createMember(alias),
  loginMember: (memberId, keys) => TokenIO.loginMember(memberId, keys),
  loginMemberFromLocalStorage: () => TokenIO.loginMemberFromLocalStorage()
};

module.exports = Token;
