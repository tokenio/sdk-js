const chai = require('chai');
const assert = chai.assert;
import 'babel-regenerator-runtime';

const base64js = require('base64-js');
const tokenIo = require('../../src');
const Token = new tokenIo(TEST_ENV);

import Crypto from "../../src/security/Crypto";

let member1 = {};
let username1 = '';
let account1 = {};

let member2 = {};
let username2 = '';
let account2 = {};

let token1 = {};

let destination1 = {
    account: {
        token: {
            accountId: Token.Util.generateNonce(),
            memberId: Token.Util.generateNonce(),
        }
    }
};

// Set up a first member
const setUp1 = async () => {
    username1 = Token.Util.generateNonce();
    member1 = await Token.createMember(username1, Token.MemoryCryptoEngine);
};

// Set up a second member
const setUp2 = async () => {
    username2 = Token.Util.generateNonce();
    member2 = await Token.createMember(username2, Token.MemoryCryptoEngine);
};

const tinyGifData = () => {
    // "The tiniest gif ever" , a 1x1 gif
    // http://probablyprogramming.com/2009/03/15/the-tiniest-gif-ever
    return base64js.toByteArray("R0lGODlhAQABAIABAP///wAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==");
}

describe('Profiles', async () => {
    before(() => Promise.all([setUp1(), setUp2()]));

    it('should create and get a profile', async () => {
	const inProfile = {
	    displayNameFirst: 'First',
	    displayNameLast: 'Last',
	}
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
