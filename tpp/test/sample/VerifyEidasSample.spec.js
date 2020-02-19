import VerifyEidasSample from '../../sample/VerifyEidasSample';
import forge from 'node-forge';
const {assert} = require('chai');

describe('VerifyEidasSample test', () => {
    it('Should create and verify business member', async () => {
        // input: TPP authNumber, eIDAS certificate and private key corresponding
        // to the public key of the certificate
        const tppAuthNumber = 'testAuthNumber';
        const privateKey = forge.pki.privateKeyFromPem(
            '-----BEGIN RSA PRIVATE KEY-----\n' +
            'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDNnoOVE+kXQ8Fb\n' +
            '0W9XbwSdpWuydefP/qKxexD7s/ifX+zhfVyEPAlw87fok0Vvu+oBwaSv9xBMyHO6\n' +
            'DQWVVJKFmCr5k/RBFQLcHlwxUtuffzBI0bXSEi9yEhJNfLxh1C6JKOgNcY8RvBBo\n' +
            'QYony21kwiE1u/2f4uOgrJSpbaXcyRF93QamJZPnErLVH3Ift2srXLhTECQlQeqR\n' +
            'XfozvCXiT8CE99BX+dLnP1DPLe0ZJuJnoy+CZdVUZlXxquqThG9OnITx8ulKesuC\n' +
            'cOl3lKcOKTL5MSXjzUuwxHV6J/LnUOXA+UIkbwWnbx9n7CuUGdT5Dl8lV6hM0s/T\n' +
            'USO+uBXDAgMBAAECggEAYvQjp/Vmiisx3VG7zyye4I1Q+JgUgP0u59HtmOyCPJTq\n' +
            'B5SQlxTbiE/KFHP3iS+6jLDX5FU2s3UOeJ22r6h9QSy7ldO1yzJk53D29kfFaQtJ\n' +
            'PeoqodfdnHyE8WSTtlLqOFkG4B1j+Gl0ze+ooMEeOszQNa9sfesvl84mVyltFoSS\n' +
            'e38pCTLKk2N/CGeCbO436Pt1d6weWf9U8pPg0n1WQ8reTKQXVa91Fbqnpbydtyd+\n' +
            'ycdB+T1rOCl6dyRm9mkz0pBSQGza7TmTDoxPfiHyUtOK/omokNeg/5y8uMRycl2A\n' +
            'a/aFiBFzI+cn30kuVo+AazDRHU6UgSmjRcfjpijjrQKBgQDo1UDB5LTKzB+SD+J/\n' +
            'FDcjhxdqbsX+5j3giKKxlVViiOaLHpO1unz6adJ3ks9V8BkUMZebwvPTi6VDaJN/\n' +
            'qJBhfWTJUZc2DF7iYkEBvBxoRVYVtJC2wCRFTBb1FtRxTYQb8rZ4no8/n3UQaGHD\n' +
            'U0o0xPGwen8MdGM6rS+t9EiYrQKBgQDiFBFSHfYdMq7DzSbQ9XmXyAWyg8WhXQSf\n' +
            'wefevoSxFdyg+uON40ge6fUFa6fm35IeN1waF9m0HBmZ84Yv1UBweIc8Bi7DPobr\n' +
            'mrtPnqjbbru3DGVyzt7aVVKo2ajksC62D9ZHGOoNQuohlQTyFjUMrMyFtX5pjDW0\n' +
            'zRR1IxAGLwKBgQCYP0n2/3wQ1+UU93odqrRbcOyo1gJ2KUvw1Ke+A24v3mESO05P\n' +
            'GMC8ZhIPyln1Uei0QbFnUtVpUPkh2PIKGck/VmVfFxEPcIti8OidH8pbjGs8CjRO\n' +
            'q9mLzrN8VA9af1uRguY6fUQiUDyWHAtBU+dEFjwMMC1/kWOJbNGup/wIiQKBgQCw\n' +
            'Tb4EL+FSe8fWYhI3OneMaiwnPqPMZuHIREsyZZjNEKNx1rXGXMxNb13o0D+ryAYH\n' +
            'Elz87ESWNKOybzrh6ofKLfQoVxn4oLZO3efc+3nrRbuV0FD8617XHVrM2pDfZpXG\n' +
            '3SrZXxCHLvuvHKsyrybHr6n/S749SV5IlPWzM5i3eQKBgCikhJUZIQNC+uXQwix3\n' +
            'AUENA314gZLqgotH44GN+1nsZ0GzKoUirj/1Lz1ag/gFom/nsfs16cPn5EjF6Yxb\n' +
            'OaQWvfXF6zuxkpECeXIdcB1jVVo7NUaof4b+2YSIUhlwU9nxGHqSUhCImNXIO7dj\n' +
            'zkugF61BGMIO6QgEfJLs6QoS\n' +
            '-----END RSA PRIVATE KEY-----');
        const certificate = 'MIIC6zCCAdOgAwIBAgIGAW2OBKSAMA0GCSqGSIb3DQEBCwUAMCwxETAPBgNVBAMMCF' +
            'Rva2VuLmlvMRcwFQYDVQRhDA50ZXN0QXV0aE51bWJlcjAeFw0xOTEwMDIxOTQ4NTFaFw0yMDEwMDIxOTQ4' +
            'NTFaMCwxETAPBgNVBAMMCFRva2VuLmlvMRcwFQYDVQRhDA50ZXN0QXV0aE51bWJlcjCCASIwDQYJKoZIhv' +
            'cNAQEBBQADggEPADCCAQoCggEBAM2eg5UT6RdDwVvRb1dvBJ2la7J158/+orF7EPuz+J9f7OF9XIQ8CXDzt' +
            '+iTRW+76gHBpK/3EEzIc7oNBZVUkoWYKvmT9EEVAtweXDFS259/MEjRtdISL3ISEk18vGHULoko6A1xjxG8' +
            'EGhBiifLbWTCITW7/Z/i46CslKltpdzJEX3dBqYlk+cSstUfch+3aytcuFMQJCVB6pFd+jO8JeJPwIT30Ff' +
            '50uc/UM8t7Rkm4mejL4Jl1VRmVfGq6pOEb06chPHy6Up6y4Jw6XeUpw4pMvkxJePNS7DEdXon8udQ5cD5Qi' +
            'RvBadvH2fsK5QZ1PkOXyVXqEzSz9NRI764FcMCAwEAAaMTMBEwDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9' +
            'w0BAQsFAAOCAQEACzdex+RGLj+7YDwiYbJk40SpzDlk4ns2Bk5U/aMKPbsVsxu0q4w8/envM8TB8Z8IrMW5' +
            'axHv2rXaQ59TQvzMEx3NXSCzeS7ylOeNFokIgjbDVojVTpHwwXq74GavX1J1aMk0sopwmb1wF8WvpmbAH7z' +
            'EByNpQn6qfftZ3iM9qVFE/o+sx9CbQ1KAHJUHOPjFMkwHDcgXByyW7j5+TCAHpk281s3GfziUMeM7BoOFrK' +
            '+5F8ergolcQfOsruNfVHYWhCHvMT4ICFydSJnoMTKT7g41KA3HWEUr0hqNLHTaypahUFGEVroRxMS5HlTGb' +
            'DBl2qEf37t3zh636m0ndS5x9A==';

        const member = await VerifyEidasSample.verifyEidas(
            certificate, tppAuthNumber, 'gold', privateKey);
        const aliases = await member.aliases();
        assert.equal(aliases.length, 1);
        assert.equal(aliases[0].value, tppAuthNumber);
        assert.equal(aliases[0].type, 'EIDAS');
        // remove the alias from the member, so it can be re-used next time the test is run
        await member.removeAlias(aliases[0]);
    });
});
