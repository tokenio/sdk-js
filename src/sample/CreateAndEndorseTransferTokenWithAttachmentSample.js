
// Empty fake for simple example.
function getImageData(filename) {
    return new Uint8Array(0);
}

export default async (payer, payeeUsername) => {
    const accounts = await payer.getAccounts();

    // Payer creates the token with the desired terms
    const token = await payer.createTransferToken(100.00, 'EUR')
              .setAccountId(accounts[0].id)
              .setRedeemerUsername(payeeUsername)
              .addAttachmentData(
                  payer.memberId(),
                  "image/jpeg",
                  "invoice.jpg",
                  getImageData("invoice.jpg"))
              .execute();

    // Payer endorses the token, creating a digital signature on it
    const result = await payer.endorseToken(token);

    return result.token;
}
