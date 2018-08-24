import proto from './gen/proto';

const common = proto.io.token.proto.common;
const banklink = proto.io.token.proto.banklink;

// classes

export const Blob = common.blob.Blob;
export const Alias = common.alias.Alias;
export const Pricing = common.pricing.Pricing;
export const Key = common.security.Key;
export const Signature = common.security.Signature;
export const Address = common.address.Address;
export const Account = common.account.Account;
export const TokenPayload = common.token.TokenPayload;
export const TokenMember = common.token.TokenMember;
export const Token = common.token.Token;
export const TokenOperationResult = common.token.TokenOperationResult;
export const TokenSignature = common.token.TokenSignature;
export const Resource = common.token.AccessBody.Resource;
export const Notification = common.notification.Notification;
export const DeviceMetadata = common.notification.DeviceMetadata;
export const Bank = common.bank.Bank;
export const BankInfo = common.bank.BankInfo;
export const Paging = common.bank.Paging;
export const AddressRecord = common.member.AddressRecord;
export const RecoveryRule = common.member.RecoveryRule;
export const ReceiptContact = common.member.ReceiptContact;
export const Profile = common.member.Profile;
export const Subscriber = common.subscriber.Subscriber;
export const TransferEndpoint = common.transferinstructions.TransferEndpoint;
export const Transfer = common.transfer.Transfer;
export const Balance = common.transaction.Balance;
export const Transaction = common.transaction.Transaction;
export const OauthBankAuthorization = banklink.OauthBankAuthorization;

// enums

export const AliasType = Object.freeze(common.alias.Alias.Type);
export const TokenOperationStatus = Object.freeze(common.token.TokenOperationResult.Status);
export const KeyLevel = Object.freeze(common.security.Key.Level);
export const NotifyStatus = Object.freeze(common.notification.NotifyStatus);
export const NotificationStatus = Object.freeze(common.notification.Notification.Status);
export const ReceiptContactType = Object.freeze(common.member.ReceiptContact.Type);
export const TokenSignatureAction = Object.freeze(common.token.TokenSignature.Action);
export const TransactionType = Object.freeze(common.transaction.TransactionType);
export const TransactionStatus = Object.freeze(common.transaction.TransactionStatus);

Blob.create = Blob.fromObject;
Alias.create = Alias.fromObject;
Pricing.create = Pricing.fromObject;
Key.create = Key.fromObject;
Signature.create = Signature.fromObject;
Address.create = Address.fromObject;
Account.create = Account.fromObject;
TokenPayload.create = TokenPayload.fromObject;
TokenMember.create = TokenMember.fromObject;
Token.create = Token.fromObject;
TokenOperationResult.create = TokenOperationResult.fromObject;
TokenSignature.create = TokenSignature.fromObject;
Resource.create = Resource.fromObject;
Notification.create = Notification.fromObject;
DeviceMetadata.create = DeviceMetadata.fromObject;
Bank.create = Bank.fromObject;
BankInfo.create = BankInfo.fromObject;
Paging.create = Paging.fromObject;
AddressRecord.create = AddressRecord.fromObject;
RecoveryRule.create = RecoveryRule.fromObject;
ReceiptContact.create = ReceiptContact.fromObject;
Profile.create = Profile.fromObject;
Subscriber.create = Subscriber.fromObject;
TransferEndpoint.create = TransferEndpoint.fromObject;
Transfer.create = Transfer.fromObject;
Balance.create = Balance.fromObject;
Transaction.create = Transaction.fromObject;
OauthBankAuthorization.create = OauthBankAuthorization.fromObject;
