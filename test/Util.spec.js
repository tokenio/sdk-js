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
});