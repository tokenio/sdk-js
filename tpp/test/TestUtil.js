import {TokenClient} from '@token-io/app';
import forge from 'node-forge';

const Token = new TokenClient({env: TEST_ENV});

export default class TestUtil {
    /**
     * Retries the supplied function until it either runs successfully or the timeout has passed.
     *
     * @param {function} fn - function to run until success or timeout
     * @param {number} timeoutMs - milliseconds to wait before timing out
     * @param {number} waitTimeMs - milliseconds to wait after failed invocation of the supplied
     *                              function before retrying
     */
    static async waitUntil(fn, timeoutMs = 10000, waitTimeMs = 500) {
        const start = Date.now();
        // eslint-disable-next-line no-constant-condition
        while (true) {
            try {
                await fn();
                return;
            } catch (e) {
                if (Date.now() - start > timeoutMs) {
                    throw e;
                }
                await new Promise(resolve => setTimeout(resolve, waitTimeMs));
            }
        }
    }

    static async createUserMember(providedAlias) {
        const alias = {
            type: 'EMAIL',
            value: `${Token.Util.generateNonce()}+nv@example.com`,
        };
        const member = await Token.createMember(providedAlias || alias, Token.MemoryCryptoEngine);
        await member.createAndLinkTestBankAccount(200, 'EUR');
        return member;
    }

    static async createAccessToken(grantor, granteeAlias) {
        const accountId = (await grantor.getAccounts())[0].id();
        const accessToken = await grantor.createAccessTokenBuilder()
            .forAccount(accountId)
            .forAccountBalance(accountId)
            .setToAlias(granteeAlias)
            .execute();
        const endorsed = await grantor.endorseToken(accessToken);
        return endorsed.token;
    }

    static async createTransferToken(payer, payeeAlias) {
        const accountId = (await payer.getAccounts())[0].id();
        const transferToken = await payer.createTransferTokenBuilder(100, 'EUR')
            .setAccountId(accountId)
            .setToAlias(payeeAlias)
            .setDescription('Book Purchase')
            .execute();
        const endorsed = await payer.endorseToken(transferToken);
        return endorsed.token;
    }

    static async createStandingOrderToken(payer, payeeAlias) {
        const accountId = (await payer.getAccounts())[0].id();
        const destination = {
            sepa: {
                iban: '123',
            },
        };
        const standingOrderTokenBuilder = await payer.createStandingOrderTokenBuilder(100, 'EUR', 'MNTH', '2018-02-15', '2019-02-15')
            .setAccountId(accountId)
            .setToAlias(payeeAlias)
            .addTransferDestination(destination)
            .buildPayload();
        const {resolvedPayload, policy} = await payer.prepareToken(standingOrderTokenBuilder);
        const signature = [await payer.signTokenPayload(resolvedPayload, policy.singleSignature.signer.keyLevel)];
        const standingOrderToken = await payer.createToken(resolvedPayload, signature);
        const endorsed = await payer.endorseToken(standingOrderToken);
        return endorsed.token;
    }

    static async generateEidasCertificate(keyPair, tppAuthNumber) {
        const pki = forge.pki;
        const cert = pki.createCertificate();
        cert.publicKey = keyPair.publicKey;
        //        const attrs = [{x
        //            name: 'commonName',
        //            value: 'example.org',
        //        }
        //        , {
        //            name: '2.5.4.97',
        //            value: tppAuthNumber,
        //            type: 'organizationIdentifier',
        //        },
        //        ];

        // cert.setSubject(attrs);

        ///////////////
        cert.serialNumber = '01';
        cert.validity.notBefore = new Date();
        cert.validity.notAfter = new Date();
        cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
        const attrs = [{
            name: 'commonName',
            value: 'Token.io',
        },
        {
            name: '2.5.4.97',
            value: tppAuthNumber,
            type: 'organizationIdentifier',
        },
        //        {
        //            name: 'countryName',
        //            value: 'US',
        //        }, {
        //            shortName: 'ST',
        //            value: 'Virginia',
        //        }, {
        //            name: 'localityName',
        //            value: 'Blacksburg',
        //        }, {
        //            name: 'organizationName',
        //            value: 'Test',
        //        }, {
        //            shortName: 'OU',
        //            value: 'Test',
        //        }
        ];
        cert.setSubject(attrs);
        cert.setIssuer(attrs);
        cert.setExtensions([{
            name: 'basicConstraints',
            cA: true,
        },
        //         {
        //            name: 'keyUsage',
        //            keyCertSign: true,
        //            digitalSignature: true,
        //            nonRepudiation: true,
        //            keyEncipherment: true,
        //            dataEncipherment: true,
        //        }, {
        //            name: 'extKeyUsage',
        //            serverAuth: true,
        //            clientAuth: true,
        //            codeSigning: true,
        //            emailProtection: true,
        //            timeStamping: true,
        //        }, {
        //            name: 'nsCertType',
        //            client: true,
        //            server: true,
        //            email: true,
        //            objsign: true,
        //            sslCA: true,
        //            emailCA: true,
        //            objCA: true,
        //        }, {
        //            name: 'subjectAltName',
        //            altNames: [{
        //                type: 6, // URI
        //                value: 'http://example.org/webid#me',
        //            }, {
        //                type: 7, // IP
        //                ip: '127.0.0.1',
        //            }],
        //        }, {
        //            name: 'subjectKeyIdentifier',
        //        }
        ]);

        // self-sign certificate
        cert.sign(keyPair.privateKey, forge.md.sha256.create());
        // convert a Forge certificate to PEM
        const certificate = forge.util.encode64(forge.asn1.toDer(pki.certificateToAsn1(cert)).getBytes());

        return certificate;
    }
}
