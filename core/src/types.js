// @flow
export type AliasType = 'EMAIL' | 'DOMAIN' | 'PHONE';
export type KeyAlgorithm = 'ED25519' | 'ECDSA_SHA256' | 'RSA';
export type KeyLevel = 'LOW' | 'STANDARD' | 'PRIVILEGED';
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
    | 'FUNDS_CONFIRMATIONS';
export type PurposeOfPayment = 'PERSONAL_EXPENSES'
    | 'PURCHASE_OF_SHARES'
    | 'TRANSFER_TO_YOUR_OWN_ACCOUNT'
    | 'PURCHASE_OF_PROPERTY'
    | 'FAMILY_MAINTENANCE'
    | 'SAVINGS'
    | 'OTHER';

export type Alias = {
    type: AliasType,
    value: string,
    // optional
    realm?: string,
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
};

export type BankInfo = {
    linkingUri: string,
    redirectUriRegex: string,
    bankLinkingUri: string,
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
    executionDate: string,
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
    recurringTransferId: string,
    createdAtMs: string,
};

export type RecurringTransfer = {
    id: string,
    standingOrderId: string,
    tokenId: string,
    createdAtMs: string,
    recurringTransferBody: Object,
    status: string,
};