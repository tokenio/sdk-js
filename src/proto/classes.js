import proto from './gen/proto';

const common = proto.io.token.proto.common;
const banklink = proto.io.token.proto.banklink;

export const Blob = common.blob.Blob;
export const Alias = common.alias.Alias;
export const Key = common.security.Key;
export const Signature = common.security.Signature;
export const Address = common.address.Address;
export const Account = common.account.Account;
export const TokenPayload = common.token.TokenPayload;
export const TokenMember = common.token.TokenMember;
export const Token = common.token.Token;
export const TokenOperationResult = common.token.TokenOperationResult;
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
