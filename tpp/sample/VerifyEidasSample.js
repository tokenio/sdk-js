import {TokenClient} from '../src';
import stringify from 'fast-json-stable-stringify';
import nacl from 'tweetnacl';
import forge from 'node-forge';


class VerifyEidasSample {
    /**
    *
    */
    static async verifyEidas(certificate, tppAuthNumber, bankId, privateKey) {
        // Initialize SDK:
        // 'sandbox' is a good value for TEST_ENV here.
        const devKey = require('../src/config.json').devKey[TEST_ENV];
        const Token = new TokenClient({env: TEST_ENV, developerKey: devKey});
        // resolve memberId of the bank TPP is trying to get access to
        const bankMember = await Token.resolveAlias({
            type: 'BANK',
            value: bankId,
        });
        //console.log('AN: asn ' + forge.pki.privateKeyToAsn1(privateKey));

        //        console.log('AN: der: ' + forge.asn1.toDer(forge.pki.privateKeyToAsn1(privateKey)).getBytes());
        console.log('AN: cert: ' + certificate);
        //console.log('AN: private key: ' + forge.util.encode64(privateKey));

        const realmId = bankMember.id;
        // create an eIDAS alias under realm of the target bank
        const eidasAlias = {
            type: 'EIDAS',
            value: tppAuthNumber,
            realmId: realmId,
        };

        // create a member under realm of the bank with eIDAS alias
        const tpp = await Token.createMember(
            eidasAlias,
            Token.MemoryCryptoEngine,
            realmId
        );
        console.log('AN: memberId = ' + tpp.memberId());
        const aliases = await tpp.aliases();
        // construct a payload with all the required data
        const payload = {
            memberId: tpp.memberId(),
            alias: eidasAlias,
            certificate: certificate,
            algorithm: 'RS256',
        };
        // TODO(Anna): sign payload with provided RSA key using ED25519 alg
        //
        //    //    const signature = keys.privateKey.sign(Buffer.byteLength(stringify(payload), 'utf8'));//await Token.Crypto.createSignerFromKeyPair(keys).signJson(payload);
        //    var signature = forge.pki.ed25519.sign({
        //      message: 'text',//stringify(payload),
        //      // also accepts `binary` if you want to pass a binary string
        //      encoding: 'utf8',
        //      // node.js Buffer, Uint8Array, forge ByteBuffer, binary string
        //      privateKey: keys.privateKey
        //    });
        //    var keypair = pki.ed25519.generateKeyPair();
        //    var md = forge.md.sha256.create();
        //    md.update('test', 'utf8');
        //    var signature = pki.ed25519.sign({
        //      md: md,
        //      privateKey: keypair.privateKey
        //    });
        //console.log('private key rsa: ' +Object.prototype.toString.call( keys.privateKey));
        //console.log('private key ed25519: ' +Object.prototype.toString.call( keypair.privateKey));
        //
        //    var keypair = Token.Crypto.generateKeys('LOW');
        //    console.log('private key nacl: ' +Object.prototype.toString.call( keypair.privateKey));

        const md = forge.md.sha256.create();
        md.update(stringify(payload), 'utf8');
        // console.log('AN: signature type: ' + typeof privateKey.sign(md));
        //const sign = privateKey.sign(md);
        //const uintArray = new Uint8Array(sign.split('').map(function(char) {return char.charCodeAt(0);}));
        const sign = forge.util.encode64(privateKey.sign(md));
        const signature = sign.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
        //replace(/\+/g, '-');
        // signature = signature.replace('/', '_');
        // signature = signature.replace(/=+$/, '');
        // console.log('AN: signature base64Url: ' + signature);
        // console.log('AN: signature base64: ' + sign);
        //
        //        var d = pki.ed25519.encode(md, keys.privateKey.n.bitLength());
        //        var signature =  pki.rsa.encrypt(d, key, bt);
        // verify eIDAS
        await tpp.verifyEidas(payload, signature);
        return tpp;
    }
}

export default VerifyEidasSample;
