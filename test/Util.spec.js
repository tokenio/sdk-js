import Util from '../src/Util';

const {assert} = require('chai');

describe('Util', () => {
    it('should check the length of decimal', () => {
        assert.equal(Util.countDecimals(23.25126), 5);
        assert.equal(Util.countDecimals(1), 0);
        assert.equal(Util.countDecimals(23.2), 1);
        assert.equal(Util.countDecimals(23.25), 2);
        assert.equal(Util.countDecimals(23.253), 3);
        assert.equal(Util.countDecimals(23.2537), 4);
    });

    it('should get the bytes from a word', () => {
        const word = -864391073;
        const byte1 = Util.getByte(word, 0);
        const byte2 = Util.getByte(word, 1);
        const byte3 = Util.getByte(word, 2);
        const byte4 = Util.getByte(word, 3);
        assert.equal(byte1, 95);
        assert.equal(byte2, 112);
        assert.equal(byte3, 122);
        assert.equal(byte4, 204);
    });

    it('should hash the alias', () => {
        const alias = {
            type: 'EMAIL',
            value: 'alias@token.io',
        };
        assert.equal(Util.hashAndSerializeAlias(alias),
            '5cmRKhdQaKFrkso7E4UHyY6AB5yUN2UE6JLfAJCQDZo2');
    });
});
