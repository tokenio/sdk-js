/**
 * Converts an input buffer or input string to UTF8 encoded Base64Url.
 *
 * @param {String|Buffer} input input string or buffer
 * @return {String} encoded output
 */
export const base64Url = input => {
    if (Buffer.isBuffer(input)) {
        return base64ToBase64Url(input.toString('base64'));
    }
    return base64ToBase64Url(Buffer.from(input, 'utf8').toString('base64'));
};

/**
 * Converts a UTF8 encoded base64url string to a Buffer.
 *
 * @param {String} input input string
 * @return {Buffer} buffer output
 */
export const base64UrlToBuffer = input => {
    return Buffer.from(base64UrlToBase64(input), 'base64');
};

export default base64Url;

function base64ToBase64Url(input) {
    return input
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function base64UrlToBase64(input) {
    return pad(input.toString())
        .replace(/-/g, '+')
        .replace(/_/g, '/');
}

function pad(input) {
    const segmentLength = 4;
    const stringLength = input.length;
    const diff = stringLength % segmentLength;
    if (!diff) {
        return input;
    }
    let position = stringLength;
    let padLength = segmentLength - diff;
    const paddedStringLength = stringLength + padLength;
    const buffer = Buffer.alloc(paddedStringLength);
    buffer.write(input);
    while (padLength--) {
        buffer.write('=', position++);
    }
    return buffer.toString();
}
