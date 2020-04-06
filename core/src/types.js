// @flow
export type AliasType = 'EMAIL' | 'DOMAIN' | 'PHONE' | 'EIDAS';
export type KeyAlgorithm = 'ED25519' | 'ECDSA_SHA256' | 'RSA';
export type KeyLevel = 'LOW' | 'STANDARD' | 'PRIVILEGED';
export type VerificationStatus = 'INVALID'
    | 'SUCCESS'
    | 'FAILURE_EIDAS_INVALID' // the request has succeeded, but certificate is invalid
    | 'FAILURE_ERROR_RESPONSE' // verification service returned an error response
    | 'FAILURE_ERROR' // an error happened during the verification process
    | 'IN_PROGRESS'; // certificate validation has not finished yet, use getEidasVerificationStatus call to get the result later
export type NotificationStatus = 'PENDING' | 'DELIVERED' | 'COMPLETED' | 'INVALIDATED';
export type NotifyStatus = 'ACCEPTED' | 'NO_SUBSCRIBERS';
export type TokenOperationStatus = 'SUCCESS' | 'MORE_SIGNATURES_NEEDED';
export type TokenSignatureAction = 'ENDORSED' | 'CANCELLED';
export type TransactionType = 'DEBIT' | 'CREDIT';
export type ProfilePictureSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'ORIGINAL';
export type ResourceType = 'ACCOUNTS'
    | 'BALANCES'
    | 'TRANSACTIONS'
    | 'TRANSFER_DESTINATIONS'
    | 'FUNDS_CONFIRMATIONS'
    | 'STANDING_ORDERS';
export type AccountResourceType = 'ACCOUNT_INFO'
    | 'ACCOUNT_BALANCE'
    | 'ACCOUNT_TRANSACTIONS'
    | 'ACCOUNT_TRANSFER_DESTINATIONS'
    | 'ACCOUNT_FUNDS_CONFIRMATION'
    | 'ACCOUNT_STANDING_ORDERS';
export type AccountResources = [{
    type: AccountResourceType,
    bankAccount: Object,
    customerData: Object,
}];
export type PurposeOfPayment = 'PERSONAL_EXPENSES'
    | 'PURCHASE_OF_SHARES'
    | 'TRANSFER_TO_YOUR_OWN_ACCOUNT'
    | 'PURCHASE_OF_PROPERTY'
    | 'FAMILY_MAINTENANCE'
    | 'SAVINGS'
    | 'OTHER';
export type Method = 'DEFAULT' | 'INSTANT';
export type SubmissionStatus = 'INVALID'
    | 'PENDING'
    | 'PROCESSING'
    | 'SUCCESS'
    | 'FAILED'
    | 'INITIATED';

export type Alias = {
    type: AliasType,
    value: string,
    // optional
    realm?: string,
    realmId?: string,
};

export type Blob = {
    id: string,
    payload: BlobPayload,
};

export type BlobPayload = {
    ownerId: string,
    type: string,
    name: string,
    // base64-encoded byte array
    data: string,
    accessMode: 'DEFAULT' | 'PUBLIC',
};

export type TokenRequest = {
    id: string,
    requestPayload: Object,
    requestOptions: TokenRequestOptions,
};

export type TokenRequestOptions = {
    bankId?: string,
    from?: TokenMember,
    sourceAccountId?: string,
    receiptRequested?: boolean,
};

export type Key = {
    id: string,
    // base64-encoded byte array
    publicKey: string | ArrayBuffer,
    level: KeyLevel,
    algorithm: KeyAlgorithm,
    expiresAtMs: string,
};

export type Signature = {
    memberId: string,
    keyId: string,
    signature: string,
};

export type TokenMember = {
    id: string,
    username: string,
    alias: Alias,
};

export type Token = {
    id: string,
    payload: Object,
    payloadSignatures: Array<TokenSignature>,
    replaceByTokenId: string,
    tokenRequestId: string,
};

export type ActingAs = {
    // shown to user
    displayName: string,
    logoUrl: string,
    refId?: string,
    secondaryName?: string,
};

export type TokenOperationResult = {
    token: Token,
    status: TokenOperationStatus,
};

export type TokenSignature = {
    action: TokenSignatureAction,
    signature: Signature,
};

export type Resource = {
    resource: $Values<{
        account: {account: {account: string}},
        balance: {balance: {account: string}},
        transactions: {transactions: {account: string}},
        transferDestinations: {transferDestinations: {account: string}},
    }>,
};

export type Notification = {
    id: string,
    subscriberId: string,
    content: {
        type: string,
        title: string,
        body: string,
        payload: string,
        createAtMs: string,
        locKey: string,
        locArgs: Array<string>,
    },
    status: NotificationStatus,
};

export type DeviceMetadata = {
    application: string,
    applicationVersion: string,
    device: string,
    longitude: number,
    latitude: number,
};

export type Bank = {
    id: string,
    name: string,
    logoUri: string,
    fullLogoUri: string,
    supportsAppless: boolean,
    supportsInformation: boolean,
    requiresExternalAuth: boolean,
    supportsSendPayment: boolean,
    supportsReceivePayment: boolean,
    provider: string,
    country: string,
    identifier: string,
    supportedTransferDestinationTypes: Array<string>, // A list of Transfer Destination Types, like SEPA, ELIXIR, supported by the bank.
};

export type BankInfo = {
    linkingUri: string,
    redirectUriRegex: string,
    bankLinkingUri: string,
    aliasTypes: Array<string>,
    // optional
    realm?: Array<string>,
};

export type Paging = {
    page: number,
    perPage: number,
    pageCount: number,
    totalCount: number,
};

export type RecoveryRule = {
    primaryAgent: string,
    secondaryAgents: Array<string>,
};

export type ReceiptContact = {
    value: string,
    type: 'EMAIL',
};

export type Profile = {
    displayNameFirst: string,
    displayNameLast: string,
    // following are not needed for setProfile
    originalPictureId?: string,
    smallPictureId?: string,
    mediumPictureId?: string,
    largePictureId?: string,
};

export type Subscriber = {
    id: string,
    handler: string,
    handlerInstructions: Object,
};

// eslint-disable-next-line
// https://developer.token.io/sdk/pbdoc/io_token_proto_common_transferinstructions.html#TransferDestination
export type TransferDestination = Object;

export type TransferEndpoint = {
    // consult developer docs
    account: Object,
    // optional
    customerData?: Object,
    // optional
    bankId?: string,
};

export type Balance = {
    accountId: string,
    current: Money,
    available: Money,
    updatedAtMs: string,
    typedBalances: Array<Object>,
};

export type Transaction = {
    id: string,
    type: TransactionType,
    status: string,
    amount: Money,
    description: string,
    tokenId: string,
    tokenTransferId: string,
    createdAtMs: string,
    metadata: Object,
};

export type Transfer = {
    id: string,
    transactionId: string,
    createdAtMs: string,
    payload: Object,
    payloadSignatures: Array<Signature>,
    status: string,
    orderId: string,
    method: Method,
};

export type OauthBankAuthorization = {
    bankId: string,
    accessToken: string,
};

export type BankAuthorization = {
    bankId: string,
    accounts: Array<Object>,
};

export type Money = {
    currency: string,
    value: string,
};

export type SecurityMetadata = {
    ipAddress: string,
    geoLocation: string,
    deviceFingerprint: string,
};

export type StandingOrder = {
    id: string,
    status: string,
    tokenId: string,
    standingOrderSubmissionId: string,
    createdAtMs: string,
};

export type StandingOrderSubmission = {
    id: string,
    standingOrderId: string,
    tokenId: string,
    createdAtMs: string,
    standingOrderBody: Object,
    status: SubmissionStatus,
};

export type TokenRequestTransferDestinationsCallbackParameters = {
    supportedTransferDestinationTypes: Array<string>,
    bankName: string,
    country: string,
};

export type BulkTransferBody = {
    transfers: Array<BulkTransferBodyTransfers>, // Array of type Transfer, consult proto
    totalAmount: string,    // Total amount irrespective of currency. Used for redundancy check.
    source: TransferEndpoint,
};

export type BulkTransfer = {
    id: string,                           // Token ID computed as the hash of the token payload
    tokenid: string,
    createdAtMs: string,
    transactions: Array<Object>,  // Transactions for which the bank provides IDs and/or statuses.
                                  // Might not be populated right away.
    totalAmount: string,          // Total amount irrespective of currency. Used for redundancy check.
    source: TransferEndpoint,
};

export type BulkTransferBodyTransfers = {
    amount: string,
    currency: string,
    refId: string,
    description: string,
    destination: TransferDestination,
    metadata: Object,
};

export type VerifyEidasPayload = {
    memberId: string,
    alias: Alias,
    certificate: string,
    algorithm: KeyAlgorithm,
};

export type VerifyEidasResponse = {
    status: VerificationStatus,
    statusDetails: string,
    verificationId: string,
};

export type GetEidasVerificationStatusResponse = {
    aliasValue: string,
    certificate: string,
    status: VerificationStatus,
    statusDetails: string,
};
