import {Key, Alias, Address, Profile} from '..';
import TestUtil from '../../test/TestUtil';
import Util from '../Util';
const {assert} = require('chai');

/**
 * Sample code for some misc Member methods.
 */

const base64js = require('base64-js');

/**
 * Returns byte array of a small black square JPEG.
 * Ignores its parameter. This lets our sample code call
 *    loadPicture('tycho.jpg')
 * ...and get valid JPEG data back.
 *
 * @return {Object} ByteArray with JPEG data.
 */
function loadPicture() {
    return base64js.toByteArray(
        '/9j/4AAQSkZJRgABAQEASABIAAD//gATQ3JlYXRlZCB3aXRoIEdJTVD/2wBDA' +
            'BALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRT' +
            'c4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2N' +
            'jY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Nj' +
            'Y2NjY2P/wgARCAAIAAgDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAA' +
            'AAABv/EABQBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAAT5//8' +
            'QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABBQJ//8QAFBEBAAAAAAA' +
            'AAAAAAAAAAAAAAP/aAAgBAwEBPwF//8QAFBEBAAAAAAAAAAAAAAAAAAAA' +
            'AP/aAAgBAgEBPwF//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAGP' +
            'wJ//8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPyF//9oADAMBAA' +
            'IAAwAAABAf/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEBPxB//8Q' +
            'AFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAgEBPxB//8QAFBABAAAAAAAA' +
            'AAAAAAAAAAAAAP/aAAgBAQABPxB//9k='
    );
}

class MemberMethodsSample {
    static async aliases(Token, member) {
        const alias1 = (await member.aliases())[0]; // or member.firstAlias();
        const alias2 = Alias.create({
            type: 'EMAIL',
            value: 'alias2-' + Token.Util.generateNonce() + '+noverify@token.io',
        });
        await member.addAlias(alias2);

        /* only needed when adding +noverify aliases */
        await TestUtil.waitUntil(async () => {
            assert.isOk((await member.aliases())[1]);
        });

        const alias3 = Alias.create({
            type: 'EMAIL',
            value: 'alias3-' + Token.Util.generateNonce() + '+noverify@token.io',
        });
        const alias4 = Alias.create({
            type: 'EMAIL',
            value: 'alias4-' + Token.Util.generateNonce() + '+noverify@token.io',
        });
        await member.addAliases([alias3, alias4]);

        /* only needed when adding +noverify aliases */
        await TestUtil.waitUntil(async () => {
            assert.isOk((await member.aliases())[2]);
            assert.isOk((await member.aliases())[3]);
        });

        await member.removeAlias(alias1);
        await member.removeAliases([alias2, alias3]);

        const resolved = await Token.resolveAlias(alias4);
        return resolved;
    }

    static async keys(Token, member) {
        const keypair4 = await Token.Crypto.generateKeys('LOW');
        keypair4.publicKey = Util.strKey(keypair4.publicKey);
        await member.approveKey(Key.create(keypair4));
        const keypair5 = await Token.Crypto.generateKeys('STANDARD');
        const keypair6 = await Token.Crypto.generateKeys('PRIVILEGED');
        keypair5.publicKey = Util.strKey(keypair5.publicKey);
        keypair6.publicKey = Util.strKey(keypair6.publicKey);
        await member.approveKeys([Key.create(keypair5), Key.create(keypair6)]);

        await member.removeKey(keypair4.id);
        await member.removeKeys([keypair5.id, keypair6.id]);
    }

    static async addresses(member) {
        // This sample code uses a few of the fields available in
        // an address; for full list (place, province, ...), see
        // https://developer.token.io/sdk/pbdoc/io_token_proto_common_address.html
        const address1 = Address.create({
            houseNumber: '221B',
            street: 'Baker St',
            city: 'London',
            postCode: 'NW1 6XE',
            country: 'UK',
        });
        const addressRecord1 = await member.addAddress('Home', address1);
        await member.deleteAddress(addressRecord1.id);
        const address2 = Address.create({
            houseNumber: '16/17',
            street: 'Osloer Strasse',
            city: 'Berlin',
            postCode: 'D-13359',
            country: 'Germany',
        });
        await member.addAddress('Office', address2);
        const addresses = await member.getAddresses();
        return addresses;
    }

    static async profiles(member) {
        const name = Profile.create({
            displayNameFirst: 'Tycho',
            displayNameLast: 'Nestoris',
        });
        await member.setProfile(name);
        const jpeg = loadPicture('tycho.jpg'); // file contents as byte array
        await member.setProfilePicture('image/jpeg', jpeg);

        const profile = await member.getProfile(member.memberId());
        return profile;
    }
}

export default MemberMethodsSample;
