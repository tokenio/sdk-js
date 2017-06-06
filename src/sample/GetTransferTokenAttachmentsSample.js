/**
 * Redeems a transfer token.
 *
 * @param {Member} payee - payee member
 * @param {string} tokenId - id of the token to redeem
 * @return {Object} transfer - created transfer
 */
export default async (payee, tokenId) => {
    // Payee gets the token to see details
    const transferToken = await payee.getToken(tokenId);

    for (ix = 0; ix < transferToken.attachments.length; ix++) {
      // attachments have metadata but not the "file" content
      if (transferToken.attachments[ix].type.startsWith("image/")) {
        // download the content of the attachment[s] we want
        attachmentData = payee.getTokenBlob(
          tokenId,
          transferToken.attachments[ix].blobId).payload.data;
      }
    }
}
