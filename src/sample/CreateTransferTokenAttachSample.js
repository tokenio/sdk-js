/* eslint-disable require-jsdoc*/

// Empty fake for simple example.
function getImageData() {
    return new Uint8Array(42);
}

export default async (payer, payeeAlias) => {
    const accounts = await payer.getAccounts();

    // Upload the data
    const attachment = await payer.createBlob(
        payer.memberId(),
        'image/jpeg',
        'invoice.jpg',
        getImageData('invoice.jpg'));

    const token = await payer.createTransferToken(100.00, 'EUR')
        .setAccountId(accounts[0].id)
        .setRedeemerAlias(payeeAlias)
    // attach reference to token:
        .addAttachment(attachment)
        .execute();

    const result = await payer.endorseToken(token);

    return result.token;
};
