import proto from './gen/proto';

const common = proto.io.token.proto.common;
const banklink = proto.io.token.proto.banklink;

// classes

export const Account = common.account.Account;
export const Address = common.address.Address;
export const AddressRecord = common.member.AddressRecord;
export const Alias = common.alias.Alias;
export const Balance = common.transaction.Balance;
export const Bank = common.bank.Bank;
export const BankInfo = common.bank.BankInfo;
export const Blob = common.blob.Blob;
export const DeviceMetadata = common.notification.DeviceMetadata;
export const Key = common.security.Key;
export const Notification = common.notification.Notification;
export const OauthBankAuthorization = banklink.OauthBankAuthorization;
export const Paging = common.bank.Paging;
export const Pricing = common.pricing.Pricing;
export const Profile = common.member.Profile;
export const ReceiptContact = common.member.ReceiptContact;
export const RecoveryRule = common.member.RecoveryRule;
export const Resource = common.token.AccessBody.Resource;
export const Signature = common.security.Signature;
export const Subscriber = common.subscriber.Subscriber;
export const Token = common.token.Token;
export const TokenMember = common.token.TokenMember;
export const TokenOperationResult = common.token.TokenOperationResult;
export const TokenPayload = common.token.TokenPayload;
export const TokenSignature = common.token.TokenSignature;
export const Transaction = common.transaction.Transaction;
export const Transfer = common.transfer.Transfer;
export const TransferEndpoint = common.transferinstructions.TransferEndpoint;

// enums

export const AliasType = Object.freeze(common.alias.Alias.Type);
export const KeyAlgorithm = Object.freeze(common.security.Key.Algorithm);
export const KeyLevel = Object.freeze(common.security.Key.Level);
export const NotificationStatus = Object.freeze(common.notification.Notification.Status);
export const NotifyStatus = Object.freeze(common.notification.NotifyStatus);
export const ReceiptContactType = Object.freeze(common.member.ReceiptContact.Type);
export const RequestStatus = Object.freeze(common.transaction.RequestStatus);
export const TokenOperationStatus = Object.freeze(common.token.TokenOperationResult.Status);
export const TokenSignatureAction = Object.freeze(common.token.TokenSignature.Action);
export const TransactionStatus = Object.freeze(common.transaction.TransactionStatus);
export const TransactionType = Object.freeze(common.transaction.TransactionType);

Account.create = Account.fromObject;
Address.create = Address.fromObject;
AddressRecord.create = AddressRecord.fromObject;
Alias.create = Alias.fromObject;
Balance.create = Balance.fromObject;
Bank.create = Bank.fromObject;
BankInfo.create = BankInfo.fromObject;
Blob.create = Blob.fromObject;
DeviceMetadata.create = DeviceMetadata.fromObject;
Key.create = Key.fromObject;
Notification.create = Notification.fromObject;
OauthBankAuthorization.create = OauthBankAuthorization.fromObject;
Paging.create = Paging.fromObject;
Pricing.create = Pricing.fromObject;
Profile.create = Profile.fromObject;
ReceiptContact.create = ReceiptContact.fromObject;
RecoveryRule.create = RecoveryRule.fromObject;
Resource.create = Resource.fromObject;
Signature.create = Signature.fromObject;
Subscriber.create = Subscriber.fromObject;
Token.create = Token.fromObject;
TokenMember.create = TokenMember.fromObject;
TokenOperationResult.create = TokenOperationResult.fromObject;
TokenPayload.create = TokenPayload.fromObject;
TokenSignature.create = TokenSignature.fromObject;
Transaction.create = Transaction.fromObject;
Transfer.create = Transfer.fromObject;
TransferEndpoint.create = TransferEndpoint.fromObject;
