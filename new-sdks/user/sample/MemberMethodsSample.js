import Util from '../src/Util';

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
        const alias2 = {
            type: 'EMAIL',
            value: 'alias2-' + Token.Util.generateNonce() + '+noverify@token.io',
        };
        await member.addAlias(alias2);

        const alias3 = {
            type: 'EMAIL',
            value: 'alias3-' + Token.Util.generateNonce() + '+noverify@token.io',
        };
        const alias4 = {
            type: 'EMAIL',
            value: 'alias4-' + Token.Util.generateNonce() + '+noverify@token.io',
        };
        await member.addAliases([alias3, alias4]);

        await member.removeAlias(alias1);
        await member.removeAliases([alias2, alias3]);

        const resolved = await Token.resolveAlias(alias4);
        return resolved;
    }

    static async keys(Token, member) {
        const keypair4 = await Token.Crypto.generateKeys('LOW');
        keypair4.publicKey = Util.strKey(keypair4.publicKey);
        await member.approveKey(keypair4);
        const keypair5 = await Token.Crypto.generateKeys('STANDARD');
        const keypair6 = await Token.Crypto.generateKeys('PRIVILEGED');
        keypair5.publicKey = Util.strKey(keypair5.publicKey);
        keypair6.publicKey = Util.strKey(keypair6.publicKey);
        await member.approveKeys([keypair5, keypair6]);

        await member.removeKey(keypair4.id);
        await member.removeKeys([keypair5.id, keypair6.id]);
    }

    static async profiles(member) {
        const name = {
            displayNameFirst: 'Tycho',
            displayNameLast: 'Nestoris',
        };
        await member.setProfile(name);
        const jpeg = loadPicture('tycho.jpg'); // file contents as byte array
        await member.setProfilePicture('image/jpeg', jpeg);

        const profile = await member.getProfile(member.memberId());
        return profile;
    }
}

export default MemberMethodsSample;
