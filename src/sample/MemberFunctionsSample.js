class MemberFunctionsSample {
    static async aliases(Token, member) {
        const alias1 = (await member.aliases())[0]; // or member.firstAlias();
        const alias2 = {
            type: 'EMAIL',
            value: 'alias2-' + Token.Util.generateNonce() + '+noverify@token.io'
        };
        await member.addAlias(alias2);
        const alias3 = {
            type: 'EMAIL',
            value: 'alias3-' + Token.Util.generateNonce() + '+noverify@token.io'
        };
        const alias4 = {
            type: 'EMAIL',
            value: 'alias4-' + Token.Util.generateNonce() + '+noverify@token.io'
        };
        await member.addAliases([alias3, alias4]);

        await member.removeAlias(alias1);
        await member.removeAliases([alias2, alias3]);

        const resolved = await Token.resolveAlias(alias4);
        return resolved;
        // {
        //   "id": "m:4AaVmfKfY9DQ9tuqWJcEwq9VkXpo:5zKtXEAq",
        //   "alias": {
        //     "type":"EMAIL",
        //     "value":"alias4-v6rpfo+noverify@token.io"}
        //   }
        // }
    }

    static async keys(Token, member) {
        const keypair4 = Token.Crypto.generateKeys('LOW');
        delete keypair4.secretKey;
        await member.approveKey(keypair4);
        const keypair5 = Token.Crypto.generateKeys('STANDARD');
        const keypair6 = Token.Crypto.generateKeys('PRIVILEGED');
        delete keypair6.secretKey;
        await member.approveKeys([keypair5, keypair6]);

        await member.removeKey(keypair4.id);
        await member.removeKeys([keypair5.id, keypair6.id]);
    }

    static async addresses(member) {
        const address1 = {
            houseNumber: '221B',
            street: 'Baker St',
            city: 'London',
            postCode: 'NW1 6XE',
            country: 'UK'
        };
        const addressRecord1 = await member.addAddress("Home", address1);
        await member.deleteAddress(addressRecord1.id);
        const address2 = {
            houseNumber: '16/17',
            street: 'Osloer Strasse',
            city: 'Berlin',
            postCode: 'D-13359',
            country: 'Germany',
        };
        await member.addAddress("Office", address2);
        const addresses = await member.getAddresses();
        return addresses;
    }
}

export default MemberFunctionsSample;
