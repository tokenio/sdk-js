/* eslint-disable require-jsdoc*/

// Empty fake for simple example.
function getImageData(filename) {
    return new Uint8Array(42);
}

export default async (payer, payeeAlias) => {
    const accounts = await payer.getAccounts();

    // Payer creates the token with the desired terms
    const token = await payer.createTransferTokenBuilder(100.00, 'EUR')
              .setFromId(payer.memberId())
              .setAccountId(accounts[0].id)
              .setRedeemerAlias(payeeAlias)
              .addAttachmentData(
                  payer.memberId(),
                  "image/jpeg",
                  "invoice.jpg",
                  getImageData("invoice.jpg"))
              .execute();

    // Payer endorses the token, creating a digital signature on it
    const result = await payer.endorseToken(token);

    return result.token;
};
