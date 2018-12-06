import proto from './gen/proto';

const common = proto.io.token.proto.common;
const banklink = proto.io.token.proto.banklink;

// Proto classes must be manually processed + exposed here.

// classes
export const Account = prepareClass(common.account.Account);
export const Address = prepareClass(common.address.Address);
export const AddressRecord = prepareClass(common.member.AddressRecord);
export const Alias = prepareClass(common.alias.Alias);
export const Balance = prepareClass(common.transaction.Balance);
export const Bank = prepareClass(common.bank.Bank);
export const BankInfo = prepareClass(common.bank.BankInfo);
export const Blob = prepareClass(common.blob.Blob);
export const DeviceMetadata = prepareClass(common.notification.DeviceMetadata);
export const Key = prepareClass(common.security.Key);
export const Notification = prepareClass(common.notification.Notification);
export const OauthBankAuthorization = prepareClass(banklink.OauthBankAuthorization);
export const Paging = prepareClass(common.bank.Paging);
export const Pricing = prepareClass(common.pricing.Pricing);
export const Profile = prepareClass(common.member.Profile);
export const ReceiptContact = prepareClass(common.member.ReceiptContact);
export const RecoveryRule = prepareClass(common.member.RecoveryRule);
export const Resource = prepareClass(common.token.AccessBody.Resource);
export const Signature = prepareClass(common.security.Signature);
export const Subscriber = prepareClass(common.subscriber.Subscriber);
export const Token = prepareClass(common.token.Token);
export const TokenMember = prepareClass(common.token.TokenMember);
export const TokenOperationResult = prepareClass(common.token.TokenOperationResult);
export const TokenPayload = prepareClass(common.token.TokenPayload);
export const TokenSignature = prepareClass(common.token.TokenSignature);
export const Transaction = prepareClass(common.transaction.Transaction);
export const Transfer = prepareClass(common.transfer.Transfer);
export const TransferEndpoint = prepareClass(common.transferinstructions.TransferEndpoint);
export const TrustedBeneficiary = prepareClass(common.member.TrustedBeneficiary);
export const Customization = prepareClass(common.member.Customization);

// enums

export const AliasType = prepareEnum(common.alias.Alias.Type);
export const KeyAlgorithm = prepareEnum(common.security.Key.Algorithm);
export const KeyLevel = prepareEnum(common.security.Key.Level);
export const NotificationStatus = prepareEnum(common.notification.Notification.Status);
export const NotifyStatus = prepareEnum(common.notification.NotifyStatus);
export const ReceiptContactType = prepareEnum(common.member.ReceiptContact.Type);
export const RequestStatus = prepareEnum(common.transaction.RequestStatus);
export const TokenOperationStatus = prepareEnum(common.token.TokenOperationResult.Status);
export const TokenSignatureAction = prepareEnum(common.token.TokenSignature.Action);
export const TransactionStatus = prepareEnum(common.transaction.TransactionStatus);
export const TransactionType = prepareEnum(common.transaction.TransactionType);

function prepareClass(obj) {
    obj.create = obj.fromObject;
    return obj;
}

function prepareEnum(obj) {
    obj = Object.freeze(obj);
    return obj;
}
