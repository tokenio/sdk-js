const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const base64js = require('base64-js');
const TokenIo = require('../../src');
const Token = new TokenIo(TEST_ENV);

let member1 = {};
let alias1 = '';

let member2 = {};
let alias2 = '';

// Set up a first member
const setUp1 = async () => {
    alias1 = {type: 'USERNAME', value: Token.Util.generateNonce()};
    member1 = await Token.createMember(alias1, Token.MemoryCryptoEngine);
};

// Set up a second member
const setUp2 = async () => {
    alias2 = {type: 'USERNAME', value: Token.Util.generateNonce()};
    member2 = await Token.createMember(alias2, Token.MemoryCryptoEngine);
};

const tinyGifData = () => {
    // "The tiniest gif ever" , a 1x1 gif
    // http://probablyprogramming.com/2009/03/15/the-tiniest-gif-ever
    return base64js.toByteArray("R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");
};

describe('Profiles', async () => {
    before(() => Promise.all([setUp1(), setUp2()]));

    it('should create and get a profile', async () => {
  const inProfile = {
      displayNameFirst: 'First',
      displayNameLast: 'Last',
  };
        const outProfile = await member1.setProfile(inProfile);
  assert.equal(inProfile.displayNameFirst, outProfile.displayNameFirst);
  assert.equal(inProfile.displayNameLast, outProfile.displayNameLast);

  const gotProfile = await member2.getProfile(member1.memberId());
  assert.equal(inProfile.displayNameFirst, gotProfile.displayNameFirst);
  assert.equal(inProfile.displayNameLast, gotProfile.displayNameLast);
    });

    it('should create and get a profile picture', async () => {
        const gifData = tinyGifData();
  await member1.setProfilePicture("image/gif", gifData);

        const blob = await member2.getProfilePicture(member1.memberId(), "ORIGINAL");
        assert.equal("image/gif", blob.payload.type);
        assert.equal(base64js.fromByteArray(gifData), blob.payload.data);
    });
});
