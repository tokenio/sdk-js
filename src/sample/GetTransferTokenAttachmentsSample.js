const base64js = require('base64-js');

/**
 * Fetches contents of a transfer token's attachments.
 *
 * @param {Member} payee - payee member
 * @param {string} tokenId - id of the token to redeem
 * @return {Object} transfer - created transfer
 */
export default async (payee, tokenId) => {
    // Payee gets the token to see details
    const transferToken = await payee.getToken(tokenId);

    var allContents = [];

    const transferBody = transferToken.payload.transfer;
    for (var ix = 0; ix < transferBody.attachments.length; ix++) {
        // attachments have metadata but not the "file" content
        const att = transferBody.attachments[ix];
        // download the content of the attachment[s] we want
        const blob = await payee.getTokenBlob(tokenId, att.blobId);
        const blobContents = base64js.toByteArray(blob.payload.data);
        allContents.push(blobContents);
    }
    return allContents;
};
