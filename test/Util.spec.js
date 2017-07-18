const chai = require('chai');
const assert = chai.assert;
import Util from "../src/Util";

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
        var byte1 = Util.getByte(word, 0);
        var byte2 = Util.getByte(word, 1);
        var byte3 = Util.getByte(word, 2);
        var byte4 = Util.getByte(word, 3);
        assert.equal(byte1, 95);
        assert.equal(byte2, 112);
        assert.equal(byte3, 122);
        assert.equal(byte4, 204);
    });
});
