/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

const $util = $protobuf.util;

const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const io = $root.io = (() => {

    const io = {};

    io.token = (function() {

        const token = {};

        token.proto = (function() {

            const proto = {};

            proto.common = (function() {

                const common = {};

                common.account = (function() {

                    const account = {};

                    account.PlaintextBankAuthorization = (function() {

                        function PlaintextBankAuthorization(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        PlaintextBankAuthorization.prototype.memberId = "";
                        PlaintextBankAuthorization.prototype.accountName = "";
                        PlaintextBankAuthorization.prototype.account = null;
                        PlaintextBankAuthorization.prototype.expirationMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        PlaintextBankAuthorization.create = function create(properties) {
                            return new PlaintextBankAuthorization(properties);
                        };

                        return PlaintextBankAuthorization;
                    })();

                    account.AccountTag = (function() {

                        function AccountTag(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        AccountTag.prototype.key = "";
                        AccountTag.prototype.value = "";

                        AccountTag.create = function create(properties) {
                            return new AccountTag(properties);
                        };

                        return AccountTag;
                    })();

                    account.AccountFeatures = (function() {

                        function AccountFeatures(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        AccountFeatures.prototype.supportsPayment = false;
                        AccountFeatures.prototype.supportsInformation = false;
                        AccountFeatures.prototype.requiresExternalAuth = false;
                        AccountFeatures.prototype.supportsSendPayment = false;
                        AccountFeatures.prototype.supportsReceivePayment = false;

                        AccountFeatures.create = function create(properties) {
                            return new AccountFeatures(properties);
                        };

                        return AccountFeatures;
                    })();

                    account.Account = (function() {

                        function Account(p) {
                            this.tags = [];
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Account.prototype.id = "";
                        Account.prototype.name = "";
                        Account.prototype.bankId = "";
                        Account.prototype.tags = $util.emptyArray;
                        Account.prototype.isLocked = false;
                        Account.prototype.accountFeatures = null;
                        Account.prototype.lastCacheUpdateMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                        Account.prototype.nextCacheUpdateMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        Account.create = function create(properties) {
                            return new Account(properties);
                        };

                        return Account;
                    })();

                    account.BankAccount = (function() {

                        function BankAccount(p) {
                            this.metadata = {};
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        BankAccount.prototype.token = null;
                        BankAccount.prototype.tokenAuthorization = null;
                        BankAccount.prototype.swift = null;
                        BankAccount.prototype.sepa = null;
                        BankAccount.prototype.ach = null;
                        BankAccount.prototype.bank = null;
                        BankAccount.prototype.fasterPayments = null;
                        BankAccount.prototype.custom = null;
                        BankAccount.prototype.metadata = $util.emptyObject;
                        BankAccount.prototype.accountFeatures = null;

                        let $oneOfFields;

                        Object.defineProperty(BankAccount.prototype, "account", {
                            get: $util.oneOfGetter($oneOfFields = ["token", "tokenAuthorization", "swift", "sepa", "ach", "bank", "fasterPayments", "custom"]),
                            set: $util.oneOfSetter($oneOfFields)
                        });

                        BankAccount.create = function create(properties) {
                            return new BankAccount(properties);
                        };

                        BankAccount.Token = (function() {

                            function Token(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            Token.prototype.memberId = "";
                            Token.prototype.accountId = "";

                            Token.create = function create(properties) {
                                return new Token(properties);
                            };

                            return Token;
                        })();

                        BankAccount.TokenAuthorization = (function() {

                            function TokenAuthorization(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            TokenAuthorization.prototype.authorization = null;

                            TokenAuthorization.create = function create(properties) {
                                return new TokenAuthorization(properties);
                            };

                            return TokenAuthorization;
                        })();

                        BankAccount.Bank = (function() {

                            function Bank(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            Bank.prototype.bankId = "";

                            Bank.create = function create(properties) {
                                return new Bank(properties);
                            };

                            return Bank;
                        })();

                        BankAccount.Swift = (function() {

                            function Swift(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            Swift.prototype.bic = "";
                            Swift.prototype.account = "";

                            Swift.create = function create(properties) {
                                return new Swift(properties);
                            };

                            return Swift;
                        })();

                        BankAccount.Sepa = (function() {

                            function Sepa(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            Sepa.prototype.iban = "";
                            Sepa.prototype.bic = "";

                            Sepa.create = function create(properties) {
                                return new Sepa(properties);
                            };

                            return Sepa;
                        })();

                        BankAccount.Ach = (function() {

                            function Ach(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            Ach.prototype.routing = "";
                            Ach.prototype.account = "";

                            Ach.create = function create(properties) {
                                return new Ach(properties);
                            };

                            return Ach;
                        })();

                        BankAccount.FasterPayments = (function() {

                            function FasterPayments(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            FasterPayments.prototype.sortCode = "";
                            FasterPayments.prototype.accountNumber = "";

                            FasterPayments.create = function create(properties) {
                                return new FasterPayments(properties);
                            };

                            return FasterPayments;
                        })();

                        BankAccount.Custom = (function() {

                            function Custom(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            Custom.prototype.bankId = "";
                            Custom.prototype.payload = "";

                            Custom.create = function create(properties) {
                                return new Custom(properties);
                            };

                            return Custom;
                        })();

                        return BankAccount;
                    })();

                    return account;
                })();

                common.address = (function() {

                    const address = {};

                    address.Address = (function() {

                        function Address(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Address.prototype.houseNumber = "";
                        Address.prototype.houseName = "";
                        Address.prototype.flats = "";
                        Address.prototype.conscriptionNumber = "";
                        Address.prototype.street = "";
                        Address.prototype.place = "";
                        Address.prototype.postCode = "";
                        Address.prototype.city = "";
                        Address.prototype.country = "";
                        Address.prototype.full = "";
                        Address.prototype.hamlet = "";
                        Address.prototype.suburb = "";
                        Address.prototype.subdistrict = "";
                        Address.prototype.district = "";
                        Address.prototype.province = "";
                        Address.prototype.state = "";

                        Address.create = function create(properties) {
                            return new Address(properties);
                        };

                        return Address;
                    })();

                    return address;
                })();

                common.alias = (function() {

                    const alias = {};

                    alias.Alias = (function() {

                        function Alias(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Alias.prototype.type = 0;
                        Alias.prototype.value = "";
                        Alias.prototype.realm = "";

                        Alias.create = function create(properties) {
                            return new Alias(properties);
                        };

                        Alias.Type = (function() {
                            const valuesById = {}, values = Object.create(valuesById);
                            values[valuesById[0] = "INVALID"] = 0;
                            values[valuesById[1] = "UNKNOWN"] = 1;
                            values[valuesById[2] = "EMAIL"] = 2;
                            values[valuesById[3] = "PHONE"] = 3;
                            values[valuesById[4] = "DOMAIN"] = 4;
                            values[valuesById[5] = "USERNAME"] = 5;
                            values[valuesById[6] = "BANK"] = 6;
                            return values;
                        })();

                        return Alias;
                    })();

                    alias.VerificationStatus = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "INVALID"] = 0;
                        values[valuesById[1] = "UNKNOWN"] = 1;
                        values[valuesById[2] = "SUCCESS"] = 2;
                        values[valuesById[3] = "INCORRECT_CODE"] = 3;
                        values[valuesById[4] = "EXPIRED_CODE"] = 4;
                        values[valuesById[5] = "TOO_MANY_CODE_ATTEMPTS"] = 5;
                        return values;
                    })();

                    alias.VerifyAliasPayload = (function() {

                        function VerifyAliasPayload(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        VerifyAliasPayload.prototype.memberId = "";
                        VerifyAliasPayload.prototype.alias = null;

                        VerifyAliasPayload.create = function create(properties) {
                            return new VerifyAliasPayload(properties);
                        };

                        return VerifyAliasPayload;
                    })();

                    return alias;
                })();

                common.bank = (function() {

                    const bank = {};

                    bank.Bank = (function() {

                        function Bank(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Bank.prototype.id = "";
                        Bank.prototype.name = "";
                        Bank.prototype.logoUri = "";
                        Bank.prototype.fullLogoUri = "";
                        Bank.prototype.supportsAppless = false;
                        Bank.prototype.supportsInformation = false;
                        Bank.prototype.requiresExternalAuth = false;
                        Bank.prototype.supportsSendPayment = false;
                        Bank.prototype.supportsReceivePayment = false;
                        Bank.prototype.provider = "";
                        Bank.prototype.country = "";
                        Bank.prototype.identifier = "";

                        Bank.create = function create(properties) {
                            return new Bank(properties);
                        };

                        return Bank;
                    })();

                    bank.BankInfo = (function() {

                        function BankInfo(p) {
                            this.realm = [];
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        BankInfo.prototype.linkingUri = "";
                        BankInfo.prototype.redirectUriRegex = "";
                        BankInfo.prototype.bankLinkingUri = "";
                        BankInfo.prototype.realm = $util.emptyArray;

                        BankInfo.create = function create(properties) {
                            return new BankInfo(properties);
                        };

                        return BankInfo;
                    })();

                    bank.Paging = (function() {

                        function Paging(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Paging.prototype.page = 0;
                        Paging.prototype.perPage = 0;
                        Paging.prototype.pageCount = 0;
                        Paging.prototype.totalCount = 0;

                        Paging.create = function create(properties) {
                            return new Paging(properties);
                        };

                        return Paging;
                    })();

                    return bank;
                })();

                common.blob = (function() {

                    const blob = {};

                    blob.Blob = (function() {

                        function Blob(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Blob.prototype.id = "";
                        Blob.prototype.payload = null;

                        Blob.create = function create(properties) {
                            return new Blob(properties);
                        };

                        Blob.AccessMode = (function() {
                            const valuesById = {}, values = Object.create(valuesById);
                            values[valuesById[0] = "DEFAULT"] = 0;
                            values[valuesById[1] = "PUBLIC"] = 1;
                            return values;
                        })();

                        Blob.Payload = (function() {

                            function Payload(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            Payload.prototype.ownerId = "";
                            Payload.prototype.type = "";
                            Payload.prototype.name = "";
                            Payload.prototype.data = $util.newBuffer([]);
                            Payload.prototype.accessMode = 0;

                            Payload.create = function create(properties) {
                                return new Payload(properties);
                            };

                            return Payload;
                        })();

                        return Blob;
                    })();

                    blob.Attachment = (function() {

                        function Attachment(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Attachment.prototype.blobId = "";
                        Attachment.prototype.type = "";
                        Attachment.prototype.name = "";

                        Attachment.create = function create(properties) {
                            return new Attachment(properties);
                        };

                        return Attachment;
                    })();

                    return blob;
                })();

                common.member = (function() {

                    const member = {};

                    member.MemberAddKeyOperation = (function() {

                        function MemberAddKeyOperation(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        MemberAddKeyOperation.prototype.key = null;

                        MemberAddKeyOperation.create = function create(properties) {
                            return new MemberAddKeyOperation(properties);
                        };

                        return MemberAddKeyOperation;
                    })();

                    member.MemberRemoveKeyOperation = (function() {

                        function MemberRemoveKeyOperation(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        MemberRemoveKeyOperation.prototype.keyId = "";

                        MemberRemoveKeyOperation.create = function create(properties) {
                            return new MemberRemoveKeyOperation(properties);
                        };

                        return MemberRemoveKeyOperation;
                    })();

                    member.MemberAliasOperation = (function() {

                        function MemberAliasOperation(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        MemberAliasOperation.prototype.aliasHash = "";
                        MemberAliasOperation.prototype.realm = "";

                        MemberAliasOperation.create = function create(properties) {
                            return new MemberAliasOperation(properties);
                        };

                        return MemberAliasOperation;
                    })();

                    member.MemberRecoveryRulesOperation = (function() {

                        function MemberRecoveryRulesOperation(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        MemberRecoveryRulesOperation.prototype.recoveryRule = null;

                        MemberRecoveryRulesOperation.create = function create(properties) {
                            return new MemberRecoveryRulesOperation(properties);
                        };

                        return MemberRecoveryRulesOperation;
                    })();

                    member.MemberRecoveryOperation = (function() {

                        function MemberRecoveryOperation(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        MemberRecoveryOperation.prototype.authorization = null;
                        MemberRecoveryOperation.prototype.agentSignature = null;

                        MemberRecoveryOperation.create = function create(properties) {
                            return new MemberRecoveryOperation(properties);
                        };

                        MemberRecoveryOperation.Authorization = (function() {

                            function Authorization(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            Authorization.prototype.memberId = "";
                            Authorization.prototype.prevHash = "";
                            Authorization.prototype.memberKey = null;

                            Authorization.create = function create(properties) {
                                return new Authorization(properties);
                            };

                            return Authorization;
                        })();

                        return MemberRecoveryOperation;
                    })();

                    member.MemberDeleteOperation = (function() {

                        function MemberDeleteOperation(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        MemberDeleteOperation.create = function create(properties) {
                            return new MemberDeleteOperation(properties);
                        };

                        return MemberDeleteOperation;
                    })();

                    member.MemberOperation = (function() {

                        function MemberOperation(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        MemberOperation.prototype.addKey = null;
                        MemberOperation.prototype.removeKey = null;
                        MemberOperation.prototype.removeAlias = null;
                        MemberOperation.prototype.addAlias = null;
                        MemberOperation.prototype.verifyAlias = null;
                        MemberOperation.prototype.recoveryRules = null;
                        MemberOperation.prototype.recover = null;
                        MemberOperation.prototype["delete"] = null;

                        let $oneOfFields;

                        Object.defineProperty(MemberOperation.prototype, "operation", {
                            get: $util.oneOfGetter($oneOfFields = ["addKey", "removeKey", "removeAlias", "addAlias", "verifyAlias", "recoveryRules", "recover", "delete"]),
                            set: $util.oneOfSetter($oneOfFields)
                        });

                        MemberOperation.create = function create(properties) {
                            return new MemberOperation(properties);
                        };

                        return MemberOperation;
                    })();

                    member.MemberUpdate = (function() {

                        function MemberUpdate(p) {
                            this.operations = [];
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        MemberUpdate.prototype.prevHash = "";
                        MemberUpdate.prototype.memberId = "";
                        MemberUpdate.prototype.operations = $util.emptyArray;

                        MemberUpdate.create = function create(properties) {
                            return new MemberUpdate(properties);
                        };

                        return MemberUpdate;
                    })();

                    member.MemberOperationMetadata = (function() {

                        function MemberOperationMetadata(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        MemberOperationMetadata.prototype.addAliasMetadata = null;

                        let $oneOfFields;

                        Object.defineProperty(MemberOperationMetadata.prototype, "type", {
                            get: $util.oneOfGetter($oneOfFields = ["addAliasMetadata"]),
                            set: $util.oneOfSetter($oneOfFields)
                        });

                        MemberOperationMetadata.create = function create(properties) {
                            return new MemberOperationMetadata(properties);
                        };

                        MemberOperationMetadata.AddAliasMetadata = (function() {

                            function AddAliasMetadata(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            AddAliasMetadata.prototype.aliasHash = "";
                            AddAliasMetadata.prototype.alias = null;

                            AddAliasMetadata.create = function create(properties) {
                                return new AddAliasMetadata(properties);
                            };

                            return AddAliasMetadata;
                        })();

                        return MemberOperationMetadata;
                    })();

                    member.MemberOperationResponseMetadata = (function() {

                        function MemberOperationResponseMetadata(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        MemberOperationResponseMetadata.prototype.addAliasResponseMetadata = null;

                        let $oneOfFields;

                        Object.defineProperty(MemberOperationResponseMetadata.prototype, "type", {
                            get: $util.oneOfGetter($oneOfFields = ["addAliasResponseMetadata"]),
                            set: $util.oneOfSetter($oneOfFields)
                        });

                        MemberOperationResponseMetadata.create = function create(properties) {
                            return new MemberOperationResponseMetadata(properties);
                        };

                        MemberOperationResponseMetadata.AddAliasResponseMetadata = (function() {

                            function AddAliasResponseMetadata(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            AddAliasResponseMetadata.prototype.aliasHash = "";
                            AddAliasResponseMetadata.prototype.verificationId = "";

                            AddAliasResponseMetadata.create = function create(properties) {
                                return new AddAliasResponseMetadata(properties);
                            };

                            return AddAliasResponseMetadata;
                        })();

                        return MemberOperationResponseMetadata;
                    })();

                    member.RecoveryRule = (function() {

                        function RecoveryRule(p) {
                            this.secondaryAgents = [];
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        RecoveryRule.prototype.primaryAgent = "";
                        RecoveryRule.prototype.secondaryAgents = $util.emptyArray;

                        RecoveryRule.create = function create(properties) {
                            return new RecoveryRule(properties);
                        };

                        return RecoveryRule;
                    })();

                    member.Member = (function() {

                        function Member(p) {
                            this.aliasHashes = [];
                            this.keys = [];
                            this.unverifiedAliasHashes = [];
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Member.prototype.id = "";
                        Member.prototype.lastHash = "";
                        Member.prototype.aliasHashes = $util.emptyArray;
                        Member.prototype.keys = $util.emptyArray;
                        Member.prototype.unverifiedAliasHashes = $util.emptyArray;
                        Member.prototype.recoveryRule = null;
                        Member.prototype.lastRecoverySequence = 0;
                        Member.prototype.lastOperationSequence = 0;
                        Member.prototype.type = 0;
                        Member.prototype.tppId = "";

                        Member.create = function create(properties) {
                            return new Member(properties);
                        };

                        Member.MemberType = (function() {
                            const valuesById = {}, values = Object.create(valuesById);
                            values[valuesById[0] = "INVALID_MEMBER_TYPE"] = 0;
                            values[valuesById[1] = "PERSONAL"] = 1;
                            values[valuesById[2] = "BUSINESS_UNVERIFIED"] = 2;
                            values[valuesById[3] = "BUSINESS_VERIFIED"] = 3;
                            values[valuesById[4] = "TRANSIENT"] = 4;
                            return values;
                        })();

                        return Member;
                    })();

                    member.AddressRecord = (function() {

                        function AddressRecord(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        AddressRecord.prototype.id = "";
                        AddressRecord.prototype.name = "";
                        AddressRecord.prototype.address = null;
                        AddressRecord.prototype.addressSignature = null;

                        AddressRecord.create = function create(properties) {
                            return new AddressRecord(properties);
                        };

                        return AddressRecord;
                    })();

                    member.Profile = (function() {

                        function Profile(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Profile.prototype.displayNameFirst = "";
                        Profile.prototype.displayNameLast = "";
                        Profile.prototype.originalPictureId = "";
                        Profile.prototype.smallPictureId = "";
                        Profile.prototype.mediumPictureId = "";
                        Profile.prototype.largePictureId = "";

                        Profile.create = function create(properties) {
                            return new Profile(properties);
                        };

                        return Profile;
                    })();

                    member.ProfilePictureSize = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "INVALID"] = 0;
                        values[valuesById[1] = "ORIGINAL"] = 1;
                        values[valuesById[2] = "SMALL"] = 2;
                        values[valuesById[3] = "MEDIUM"] = 3;
                        values[valuesById[4] = "LARGE"] = 4;
                        return values;
                    })();

                    member.ReceiptContact = (function() {

                        function ReceiptContact(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        ReceiptContact.prototype.value = "";
                        ReceiptContact.prototype.type = 0;

                        ReceiptContact.create = function create(properties) {
                            return new ReceiptContact(properties);
                        };

                        ReceiptContact.Type = (function() {
                            const valuesById = {}, values = Object.create(valuesById);
                            values[valuesById[0] = "INVALID"] = 0;
                            values[valuesById[1] = "EMAIL"] = 1;
                            return values;
                        })();

                        return ReceiptContact;
                    })();

                    member.Device = (function() {

                        function Device(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Device.prototype.name = "";
                        Device.prototype.key = null;

                        Device.create = function create(properties) {
                            return new Device(properties);
                        };

                        return Device;
                    })();

                    member.CreateMemberType = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "INVALID_MEMBER_TYPE"] = 0;
                        values[valuesById[1] = "PERSONAL"] = 1;
                        values[valuesById[2] = "BUSINESS"] = 2;
                        values[valuesById[3] = "TRANSIENT"] = 3;
                        return values;
                    })();

                    return member;
                })();

                common.money = (function() {

                    const money = {};

                    money.Money = (function() {

                        function Money(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Money.prototype.currency = "";
                        Money.prototype.value = "";

                        Money.create = function create(properties) {
                            return new Money(properties);
                        };

                        return Money;
                    })();

                    return money;
                })();

                common.notification = (function() {

                    const notification = {};

                    notification.DeviceMetadata = (function() {

                        function DeviceMetadata(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        DeviceMetadata.prototype.application = "";
                        DeviceMetadata.prototype.applicationVersion = "";
                        DeviceMetadata.prototype.device = "";
                        DeviceMetadata.prototype.longitude = 0;
                        DeviceMetadata.prototype.latitude = 0;

                        DeviceMetadata.create = function create(properties) {
                            return new DeviceMetadata(properties);
                        };

                        return DeviceMetadata;
                    })();

                    notification.PayerTransferProcessed = (function() {

                        function PayerTransferProcessed(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        PayerTransferProcessed.prototype.transferId = "";

                        PayerTransferProcessed.create = function create(properties) {
                            return new PayerTransferProcessed(properties);
                        };

                        return PayerTransferProcessed;
                    })();

                    notification.PayeeTransferProcessed = (function() {

                        function PayeeTransferProcessed(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        PayeeTransferProcessed.prototype.transferId = "";

                        PayeeTransferProcessed.create = function create(properties) {
                            return new PayeeTransferProcessed(properties);
                        };

                        return PayeeTransferProcessed;
                    })();

                    notification.PayerTransferFailed = (function() {

                        function PayerTransferFailed(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        PayerTransferFailed.prototype.transferId = "";

                        PayerTransferFailed.create = function create(properties) {
                            return new PayerTransferFailed(properties);
                        };

                        return PayerTransferFailed;
                    })();

                    notification.TransferProcessed = (function() {

                        function TransferProcessed(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        TransferProcessed.prototype.transferId = "";

                        TransferProcessed.create = function create(properties) {
                            return new TransferProcessed(properties);
                        };

                        return TransferProcessed;
                    })();

                    notification.TransferFailed = (function() {

                        function TransferFailed(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        TransferFailed.prototype.transferId = "";

                        TransferFailed.create = function create(properties) {
                            return new TransferFailed(properties);
                        };

                        return TransferFailed;
                    })();

                    notification.LinkAccounts = (function() {

                        function LinkAccounts(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        LinkAccounts.prototype.bankAuthorization = null;

                        LinkAccounts.create = function create(properties) {
                            return new LinkAccounts(properties);
                        };

                        return LinkAccounts;
                    })();

                    notification.StepUp = (function() {

                        function StepUp(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        StepUp.prototype.tokenId = "";

                        StepUp.create = function create(properties) {
                            return new StepUp(properties);
                        };

                        return StepUp;
                    })();

                    notification.BalanceStepUp = (function() {

                        function BalanceStepUp(p) {
                            this.accountId = [];
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        BalanceStepUp.prototype.accountId = $util.emptyArray;

                        BalanceStepUp.create = function create(properties) {
                            return new BalanceStepUp(properties);
                        };

                        return BalanceStepUp;
                    })();

                    notification.TransactionStepUp = (function() {

                        function TransactionStepUp(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        TransactionStepUp.prototype.accountId = "";
                        TransactionStepUp.prototype.transactionId = "";

                        TransactionStepUp.create = function create(properties) {
                            return new TransactionStepUp(properties);
                        };

                        return TransactionStepUp;
                    })();

                    notification.RecoveryCompleted = (function() {

                        function RecoveryCompleted(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        RecoveryCompleted.create = function create(properties) {
                            return new RecoveryCompleted(properties);
                        };

                        return RecoveryCompleted;
                    })();

                    notification.AddKey = (function() {

                        function AddKey(p) {
                            this.keys = [];
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        AddKey.prototype.name = "";
                        AddKey.prototype.key = null;
                        AddKey.prototype.expiresMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                        AddKey.prototype.keys = $util.emptyArray;
                        AddKey.prototype.deviceMetadata = null;

                        AddKey.create = function create(properties) {
                            return new AddKey(properties);
                        };

                        return AddKey;
                    })();

                    notification.LinkAccountsAndAddKey = (function() {

                        function LinkAccountsAndAddKey(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        LinkAccountsAndAddKey.prototype.linkAccounts = null;
                        LinkAccountsAndAddKey.prototype.addKey = null;

                        LinkAccountsAndAddKey.create = function create(properties) {
                            return new LinkAccountsAndAddKey(properties);
                        };

                        return LinkAccountsAndAddKey;
                    })();

                    notification.PaymentRequest = (function() {

                        function PaymentRequest(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        PaymentRequest.prototype.payload = null;

                        PaymentRequest.create = function create(properties) {
                            return new PaymentRequest(properties);
                        };

                        return PaymentRequest;
                    })();

                    notification.TokenCancelled = (function() {

                        function TokenCancelled(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        TokenCancelled.prototype.tokenId = "";

                        TokenCancelled.create = function create(properties) {
                            return new TokenCancelled(properties);
                        };

                        return TokenCancelled;
                    })();

                    notification.RequestTokenAndAddKey = (function() {

                        function RequestTokenAndAddKey(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        RequestTokenAndAddKey.prototype.tokenRequestId = "";
                        RequestTokenAndAddKey.prototype.addKey = null;

                        RequestTokenAndAddKey.create = function create(properties) {
                            return new RequestTokenAndAddKey(properties);
                        };

                        return RequestTokenAndAddKey;
                    })();

                    notification.NotifyBody = (function() {

                        function NotifyBody(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        NotifyBody.prototype.payerTransferProcessed = null;
                        NotifyBody.prototype.linkAccounts = null;
                        NotifyBody.prototype.stepUp = null;
                        NotifyBody.prototype.addKey = null;
                        NotifyBody.prototype.linkAccountsAndAddKey = null;
                        NotifyBody.prototype.payeeTransferProcessed = null;
                        NotifyBody.prototype.paymentRequest = null;
                        NotifyBody.prototype.payerTransferFailed = null;
                        NotifyBody.prototype.transferProcessed = null;
                        NotifyBody.prototype.transferFailed = null;
                        NotifyBody.prototype.tokenCancelled = null;
                        NotifyBody.prototype.balanceStepUp = null;
                        NotifyBody.prototype.transactionStepUp = null;
                        NotifyBody.prototype.requestTokenAndAddKey = null;
                        NotifyBody.prototype.recoveryCompleted = null;

                        let $oneOfFields;

                        Object.defineProperty(NotifyBody.prototype, "body", {
                            get: $util.oneOfGetter($oneOfFields = ["payerTransferProcessed", "linkAccounts", "stepUp", "addKey", "linkAccountsAndAddKey", "payeeTransferProcessed", "paymentRequest", "payerTransferFailed", "transferProcessed", "transferFailed", "tokenCancelled", "balanceStepUp", "transactionStepUp", "requestTokenAndAddKey", "recoveryCompleted"]),
                            set: $util.oneOfSetter($oneOfFields)
                        });

                        NotifyBody.create = function create(properties) {
                            return new NotifyBody(properties);
                        };

                        return NotifyBody;
                    })();

                    notification.NotifyStatus = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "INVALID"] = 0;
                        values[valuesById[1] = "ACCEPTED"] = 1;
                        values[valuesById[2] = "NO_SUBSCRIBERS"] = 2;
                        return values;
                    })();

                    notification.Notification = (function() {

                        function Notification(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Notification.prototype.id = "";
                        Notification.prototype.subscriberId = "";
                        Notification.prototype.content = null;
                        Notification.prototype.status = 0;

                        Notification.create = function create(properties) {
                            return new Notification(properties);
                        };

                        Notification.Status = (function() {
                            const valuesById = {}, values = Object.create(valuesById);
                            values[valuesById[0] = "INVALID"] = 0;
                            values[valuesById[1] = "PENDING"] = 1;
                            values[valuesById[2] = "DELIVERED"] = 2;
                            values[valuesById[3] = "COMPLETED"] = 3;
                            values[valuesById[4] = "INVALIDATED"] = 4;
                            return values;
                        })();

                        return Notification;
                    })();

                    notification.NotificationContent = (function() {

                        function NotificationContent(p) {
                            this.locArgs = [];
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        NotificationContent.prototype.type = "";
                        NotificationContent.prototype.title = "";
                        NotificationContent.prototype.body = "";
                        NotificationContent.prototype.payload = "";
                        NotificationContent.prototype.createdAtMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                        NotificationContent.prototype.locKey = "";
                        NotificationContent.prototype.locArgs = $util.emptyArray;

                        NotificationContent.create = function create(properties) {
                            return new NotificationContent(properties);
                        };

                        return NotificationContent;
                    })();

                    return notification;
                })();

                common.pricing = (function() {

                    const pricing = {};

                    pricing.TransferQuote = (function() {

                        function TransferQuote(p) {
                            this.fees = [];
                            this.rates = [];
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        TransferQuote.prototype.id = "";
                        TransferQuote.prototype.accountCurrency = "";
                        TransferQuote.prototype.feesTotal = "";
                        TransferQuote.prototype.fees = $util.emptyArray;
                        TransferQuote.prototype.rates = $util.emptyArray;
                        TransferQuote.prototype.expiresAtMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        TransferQuote.create = function create(properties) {
                            return new TransferQuote(properties);
                        };

                        TransferQuote.Fee = (function() {

                            function Fee(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            Fee.prototype.amount = "";
                            Fee.prototype.description = "";

                            Fee.create = function create(properties) {
                                return new Fee(properties);
                            };

                            return Fee;
                        })();

                        TransferQuote.FxRate = (function() {

                            function FxRate(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            FxRate.prototype.baseCurrency = "";
                            FxRate.prototype.quoteCurrency = "";
                            FxRate.prototype.rate = "";

                            FxRate.create = function create(properties) {
                                return new FxRate(properties);
                            };

                            return FxRate;
                        })();

                        return TransferQuote;
                    })();

                    pricing.Pricing = (function() {

                        function Pricing(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Pricing.prototype.sourceQuote = null;
                        Pricing.prototype.destinationQuote = null;
                        Pricing.prototype.instructions = null;

                        Pricing.create = function create(properties) {
                            return new Pricing(properties);
                        };

                        return Pricing;
                    })();

                    pricing.FeeResponsibility = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "INVALID_FEE"] = 0;
                        values[valuesById[1] = "SOURCE_FEE"] = 1;
                        values[valuesById[2] = "DESTINATION_FEE"] = 2;
                        values[valuesById[3] = "SHARED_FEE"] = 3;
                        return values;
                    })();

                    pricing.FxResponsibility = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "INVALID_FX"] = 0;
                        values[valuesById[1] = "SOURCE_FX"] = 1;
                        values[valuesById[2] = "SHARED_FX"] = 2;
                        return values;
                    })();

                    pricing.PricingInstructions = (function() {

                        function PricingInstructions(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        PricingInstructions.prototype.feesPaidBy = 0;
                        PricingInstructions.prototype.fxPerformedBy = 0;

                        PricingInstructions.create = function create(properties) {
                            return new PricingInstructions(properties);
                        };

                        return PricingInstructions;
                    })();

                    return pricing;
                })();

                common.security = (function() {

                    const security = {};

                    security.Key = (function() {

                        function Key(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Key.prototype.id = "";
                        Key.prototype.publicKey = "";
                        Key.prototype.level = 0;
                        Key.prototype.algorithm = 0;
                        Key.prototype.expiresAtMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

                        Key.create = function create(properties) {
                            return new Key(properties);
                        };

                        Key.Algorithm = (function() {
                            const valuesById = {}, values = Object.create(valuesById);
                            values[valuesById[0] = "INVALID_ALGORITHM"] = 0;
                            values[valuesById[1] = "ED25519"] = 1;
                            values[valuesById[2] = "ECDSA_SHA256"] = 2;
                            values[valuesById[3] = "RS256"] = 3;
                            return values;
                        })();

                        Key.Level = (function() {
                            const valuesById = {}, values = Object.create(valuesById);
                            values[valuesById[0] = "INVALID_LEVEL"] = 0;
                            values[valuesById[1] = "PRIVILEGED"] = 1;
                            values[valuesById[2] = "STANDARD"] = 2;
                            values[valuesById[3] = "LOW"] = 3;
                            return values;
                        })();

                        return Key;
                    })();

                    security.PrivateKey = (function() {

                        function PrivateKey(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        PrivateKey.prototype.id = "";
                        PrivateKey.prototype.privateKey = "";
                        PrivateKey.prototype.level = 0;
                        PrivateKey.prototype.algorithm = 0;

                        PrivateKey.create = function create(properties) {
                            return new PrivateKey(properties);
                        };

                        return PrivateKey;
                    })();

                    security.Signature = (function() {

                        function Signature(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Signature.prototype.memberId = "";
                        Signature.prototype.keyId = "";
                        Signature.prototype.signature = "";

                        Signature.create = function create(properties) {
                            return new Signature(properties);
                        };

                        return Signature;
                    })();

                    security.SealedMessage = (function() {

                        function SealedMessage(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        SealedMessage.prototype.ciphertext = "";
                        SealedMessage.prototype.noop = null;
                        SealedMessage.prototype.rsa = null;
                        SealedMessage.prototype.rsaAes = null;

                        let $oneOfFields;

                        Object.defineProperty(SealedMessage.prototype, "method", {
                            get: $util.oneOfGetter($oneOfFields = ["noop", "rsa", "rsaAes"]),
                            set: $util.oneOfSetter($oneOfFields)
                        });

                        SealedMessage.create = function create(properties) {
                            return new SealedMessage(properties);
                        };

                        SealedMessage.NoopMethod = (function() {

                            function NoopMethod(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            NoopMethod.create = function create(properties) {
                                return new NoopMethod(properties);
                            };

                            return NoopMethod;
                        })();

                        SealedMessage.RsaMethod = (function() {

                            function RsaMethod(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            RsaMethod.prototype.keyId = "";
                            RsaMethod.prototype.algorithm = "";
                            RsaMethod.prototype.signature = "";
                            RsaMethod.prototype.signatureKeyId = "";

                            RsaMethod.create = function create(properties) {
                                return new RsaMethod(properties);
                            };

                            return RsaMethod;
                        })();

                        SealedMessage.RsaAesMethod = (function() {

                            function RsaAesMethod(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            RsaAesMethod.prototype.rsaKeyId = "";
                            RsaAesMethod.prototype.rsaAlgorithm = "";
                            RsaAesMethod.prototype.aesAlgorithm = "";
                            RsaAesMethod.prototype.encryptedAesKey = "";
                            RsaAesMethod.prototype.signature = "";
                            RsaAesMethod.prototype.signatureKeyId = "";

                            RsaAesMethod.create = function create(properties) {
                                return new RsaAesMethod(properties);
                            };

                            return RsaAesMethod;
                        })();

                        return SealedMessage;
                    })();

                    return security;
                })();

                common.subscriber = (function() {

                    const subscriber = {};

                    subscriber.Subscriber = (function() {

                        function Subscriber(p) {
                            this.handlerInstructions = {};
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Subscriber.prototype.id = "";
                        Subscriber.prototype.handler = "";
                        Subscriber.prototype.handlerInstructions = $util.emptyObject;

                        Subscriber.create = function create(properties) {
                            return new Subscriber(properties);
                        };

                        return Subscriber;
                    })();

                    return subscriber;
                })();

                common.token = (function() {

                    const token = {};

                    token.Token = (function() {

                        function Token(p) {
                            this.payloadSignatures = [];
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Token.prototype.id = "";
                        Token.prototype.payload = null;
                        Token.prototype.payloadSignatures = $util.emptyArray;
                        Token.prototype.replacedByTokenId = "";
                        Token.prototype.tokenRequestId = "";

                        Token.create = function create(properties) {
                            return new Token(properties);
                        };

                        return Token;
                    })();

                    token.TokenRequest = (function() {

                        function TokenRequest(p) {
                            this.options = {};
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        TokenRequest.prototype.id = "";
                        TokenRequest.prototype.payload = null;
                        TokenRequest.prototype.options = $util.emptyObject;

                        TokenRequest.create = function create(properties) {
                            return new TokenRequest(properties);
                        };

                        return TokenRequest;
                    })();

                    token.TokenSignature = (function() {

                        function TokenSignature(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        TokenSignature.prototype.action = 0;
                        TokenSignature.prototype.signature = null;

                        TokenSignature.create = function create(properties) {
                            return new TokenSignature(properties);
                        };

                        TokenSignature.Action = (function() {
                            const valuesById = {}, values = Object.create(valuesById);
                            values[valuesById[0] = "INVALID"] = 0;
                            values[valuesById[1] = "ENDORSED"] = 1;
                            values[valuesById[2] = "CANCELLED"] = 2;
                            return values;
                        })();

                        return TokenSignature;
                    })();

                    token.TokenMember = (function() {

                        function TokenMember(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        TokenMember.prototype.id = "";
                        TokenMember.prototype.username = "";
                        TokenMember.prototype.alias = null;

                        TokenMember.create = function create(properties) {
                            return new TokenMember(properties);
                        };

                        return TokenMember;
                    })();

                    token.TokenPayload = (function() {

                        function TokenPayload(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        TokenPayload.prototype.version = "";
                        TokenPayload.prototype.refId = "";
                        TokenPayload.prototype.issuer = null;
                        TokenPayload.prototype.from = null;
                        TokenPayload.prototype.to = null;
                        TokenPayload.prototype.effectiveAtMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                        TokenPayload.prototype.expiresAtMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                        TokenPayload.prototype.endorseUntilMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                        TokenPayload.prototype.description = "";
                        TokenPayload.prototype.transfer = null;
                        TokenPayload.prototype.access = null;
                        TokenPayload.prototype.actingAs = null;
                        TokenPayload.prototype.receiptRequested = false;

                        let $oneOfFields;

                        Object.defineProperty(TokenPayload.prototype, "body", {
                            get: $util.oneOfGetter($oneOfFields = ["transfer", "access"]),
                            set: $util.oneOfSetter($oneOfFields)
                        });

                        TokenPayload.create = function create(properties) {
                            return new TokenPayload(properties);
                        };

                        TokenPayload.ActingAs = (function() {

                            function ActingAs(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            ActingAs.prototype.displayName = "";
                            ActingAs.prototype.refId = "";
                            ActingAs.prototype.logoUrl = "";
                            ActingAs.prototype.secondaryName = "";

                            ActingAs.create = function create(properties) {
                                return new ActingAs(properties);
                            };

                            return ActingAs;
                        })();

                        return TokenPayload;
                    })();

                    token.TransferTokenStatus = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "INVALID"] = 0;
                        values[valuesById[1] = "SUCCESS"] = 1;
                        values[valuesById[2] = "FAILURE_REJECTED"] = 2;
                        values[valuesById[3] = "FAILURE_INSUFFICIENT_FUNDS"] = 3;
                        values[valuesById[4] = "FAILURE_INVALID_CURRENCY"] = 4;
                        values[valuesById[5] = "FAILURE_SOURCE_ACCOUNT_NOT_FOUND"] = 5;
                        values[valuesById[6] = "FAILURE_DESTINATION_ACCOUNT_NOT_FOUND"] = 6;
                        values[valuesById[10] = "FAILURE_INVALID_AMOUNT"] = 10;
                        values[valuesById[11] = "FAILURE_INVALID_QUOTE"] = 11;
                        values[valuesById[12] = "FAILURE_EXTERNAL_AUTHORIZATION_REQUIRED"] = 12;
                        values[valuesById[9] = "FAILURE_GENERIC"] = 9;
                        return values;
                    })();

                    token.ExternalAuthorizationDetails = (function() {

                        function ExternalAuthorizationDetails(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        ExternalAuthorizationDetails.prototype.url = "";
                        ExternalAuthorizationDetails.prototype.completionPattern = "";
                        ExternalAuthorizationDetails.prototype.authorizationUrl = "";

                        ExternalAuthorizationDetails.create = function create(properties) {
                            return new ExternalAuthorizationDetails(properties);
                        };

                        return ExternalAuthorizationDetails;
                    })();

                    token.TransferBody = (function() {

                        function TransferBody(p) {
                            this.attachments = [];
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        TransferBody.prototype.redeemer = null;
                        TransferBody.prototype.instructions = null;
                        TransferBody.prototype.currency = "";
                        TransferBody.prototype.lifetimeAmount = "";
                        TransferBody.prototype.amount = "";
                        TransferBody.prototype.attachments = $util.emptyArray;
                        TransferBody.prototype.pricing = null;

                        TransferBody.create = function create(properties) {
                            return new TransferBody(properties);
                        };

                        return TransferBody;
                    })();

                    token.AccessBody = (function() {

                        function AccessBody(p) {
                            this.resources = [];
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        AccessBody.prototype.resources = $util.emptyArray;

                        AccessBody.create = function create(properties) {
                            return new AccessBody(properties);
                        };

                        AccessBody.Resource = (function() {

                            function Resource(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            Resource.prototype.allAddresses = null;
                            Resource.prototype.allAccounts = null;
                            Resource.prototype.allTransactions = null;
                            Resource.prototype.allBalances = null;
                            Resource.prototype.address = null;
                            Resource.prototype.account = null;
                            Resource.prototype.transactions = null;
                            Resource.prototype.balance = null;
                            Resource.prototype.allAccountsAtBank = null;
                            Resource.prototype.allTransactionsAtBank = null;
                            Resource.prototype.allBalancesAtBank = null;

                            let $oneOfFields;

                            Object.defineProperty(Resource.prototype, "resource", {
                                get: $util.oneOfGetter($oneOfFields = ["allAddresses", "allAccounts", "allTransactions", "allBalances", "address", "account", "transactions", "balance", "allAccountsAtBank", "allTransactionsAtBank", "allBalancesAtBank"]),
                                set: $util.oneOfSetter($oneOfFields)
                            });

                            Resource.create = function create(properties) {
                                return new Resource(properties);
                            };

                            Resource.AllAddresses = (function() {

                                function AllAddresses(p) {
                                    if (p)
                                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                            if (p[ks[i]] != null)
                                                this[ks[i]] = p[ks[i]];
                                }

                                AllAddresses.create = function create(properties) {
                                    return new AllAddresses(properties);
                                };

                                return AllAddresses;
                            })();

                            Resource.Address = (function() {

                                function Address(p) {
                                    if (p)
                                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                            if (p[ks[i]] != null)
                                                this[ks[i]] = p[ks[i]];
                                }

                                Address.prototype.addressId = "";

                                Address.create = function create(properties) {
                                    return new Address(properties);
                                };

                                return Address;
                            })();

                            Resource.AllAccounts = (function() {

                                function AllAccounts(p) {
                                    if (p)
                                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                            if (p[ks[i]] != null)
                                                this[ks[i]] = p[ks[i]];
                                }

                                AllAccounts.create = function create(properties) {
                                    return new AllAccounts(properties);
                                };

                                return AllAccounts;
                            })();

                            Resource.AllAccountsAtBank = (function() {

                                function AllAccountsAtBank(p) {
                                    if (p)
                                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                            if (p[ks[i]] != null)
                                                this[ks[i]] = p[ks[i]];
                                }

                                AllAccountsAtBank.prototype.bankId = "";

                                AllAccountsAtBank.create = function create(properties) {
                                    return new AllAccountsAtBank(properties);
                                };

                                return AllAccountsAtBank;
                            })();

                            Resource.Account = (function() {

                                function Account(p) {
                                    if (p)
                                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                            if (p[ks[i]] != null)
                                                this[ks[i]] = p[ks[i]];
                                }

                                Account.prototype.accountId = "";

                                Account.create = function create(properties) {
                                    return new Account(properties);
                                };

                                return Account;
                            })();

                            Resource.AllAccountTransactions = (function() {

                                function AllAccountTransactions(p) {
                                    if (p)
                                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                            if (p[ks[i]] != null)
                                                this[ks[i]] = p[ks[i]];
                                }

                                AllAccountTransactions.create = function create(properties) {
                                    return new AllAccountTransactions(properties);
                                };

                                return AllAccountTransactions;
                            })();

                            Resource.AllTransactionsAtBank = (function() {

                                function AllTransactionsAtBank(p) {
                                    if (p)
                                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                            if (p[ks[i]] != null)
                                                this[ks[i]] = p[ks[i]];
                                }

                                AllTransactionsAtBank.prototype.bankId = "";

                                AllTransactionsAtBank.create = function create(properties) {
                                    return new AllTransactionsAtBank(properties);
                                };

                                return AllTransactionsAtBank;
                            })();

                            Resource.AccountTransactions = (function() {

                                function AccountTransactions(p) {
                                    if (p)
                                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                            if (p[ks[i]] != null)
                                                this[ks[i]] = p[ks[i]];
                                }

                                AccountTransactions.prototype.accountId = "";

                                AccountTransactions.create = function create(properties) {
                                    return new AccountTransactions(properties);
                                };

                                return AccountTransactions;
                            })();

                            Resource.AllAccountBalances = (function() {

                                function AllAccountBalances(p) {
                                    if (p)
                                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                            if (p[ks[i]] != null)
                                                this[ks[i]] = p[ks[i]];
                                }

                                AllAccountBalances.create = function create(properties) {
                                    return new AllAccountBalances(properties);
                                };

                                return AllAccountBalances;
                            })();

                            Resource.AllBalancesAtBank = (function() {

                                function AllBalancesAtBank(p) {
                                    if (p)
                                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                            if (p[ks[i]] != null)
                                                this[ks[i]] = p[ks[i]];
                                }

                                AllBalancesAtBank.prototype.bankId = "";

                                AllBalancesAtBank.create = function create(properties) {
                                    return new AllBalancesAtBank(properties);
                                };

                                return AllBalancesAtBank;
                            })();

                            Resource.AccountBalance = (function() {

                                function AccountBalance(p) {
                                    if (p)
                                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                            if (p[ks[i]] != null)
                                                this[ks[i]] = p[ks[i]];
                                }

                                AccountBalance.prototype.accountId = "";

                                AccountBalance.create = function create(properties) {
                                    return new AccountBalance(properties);
                                };

                                return AccountBalance;
                            })();

                            return Resource;
                        })();

                        return AccessBody;
                    })();

                    token.TokenOperationResult = (function() {

                        function TokenOperationResult(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        TokenOperationResult.prototype.token = null;
                        TokenOperationResult.prototype.status = 0;

                        TokenOperationResult.create = function create(properties) {
                            return new TokenOperationResult(properties);
                        };

                        TokenOperationResult.Status = (function() {
                            const valuesById = {}, values = Object.create(valuesById);
                            values[valuesById[0] = "INVALID"] = 0;
                            values[valuesById[1] = "SUCCESS"] = 1;
                            values[valuesById[2] = "MORE_SIGNATURES_NEEDED"] = 2;
                            return values;
                        })();

                        return TokenOperationResult;
                    })();

                    token.TokenRequestStatePayload = (function() {

                        function TokenRequestStatePayload(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        TokenRequestStatePayload.prototype.tokenId = "";
                        TokenRequestStatePayload.prototype.state = "";

                        TokenRequestStatePayload.create = function create(properties) {
                            return new TokenRequestStatePayload(properties);
                        };

                        return TokenRequestStatePayload;
                    })();

                    return token;
                })();

                common.transaction = (function() {

                    const transaction = {};

                    transaction.TransactionType = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "INVALID_TYPE"] = 0;
                        values[valuesById[1] = "DEBIT"] = 1;
                        values[valuesById[2] = "CREDIT"] = 2;
                        return values;
                    })();

                    transaction.TransactionStatus = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "INVALID_STATUS"] = 0;
                        values[valuesById[1] = "PENDING"] = 1;
                        values[valuesById[7] = "PROCESSING"] = 7;
                        values[valuesById[2] = "SUCCESS"] = 2;
                        values[valuesById[10] = "FAILURE_CANCELED"] = 10;
                        values[valuesById[3] = "FAILURE_INSUFFICIENT_FUNDS"] = 3;
                        values[valuesById[4] = "FAILURE_INVALID_CURRENCY"] = 4;
                        values[valuesById[6] = "FAILURE_PERMISSION_DENIED"] = 6;
                        values[valuesById[11] = "FAILURE_QUOTE_EXPIRED"] = 11;
                        values[valuesById[12] = "FAILURE_INVALID_AMOUNT"] = 12;
                        values[valuesById[13] = "FAILURE_INVALID_QUOTE"] = 13;
                        values[valuesById[14] = "FAILURE_EXPIRED"] = 14;
                        values[valuesById[5] = "FAILURE_GENERIC"] = 5;
                        return values;
                    })();

                    transaction.Transaction = (function() {

                        function Transaction(p) {
                            this.metadata = {};
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Transaction.prototype.id = "";
                        Transaction.prototype.type = 0;
                        Transaction.prototype.status = 0;
                        Transaction.prototype.amount = null;
                        Transaction.prototype.description = "";
                        Transaction.prototype.tokenId = "";
                        Transaction.prototype.tokenTransferId = "";
                        Transaction.prototype.createdAtMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                        Transaction.prototype.metadata = $util.emptyObject;

                        Transaction.create = function create(properties) {
                            return new Transaction(properties);
                        };

                        return Transaction;
                    })();

                    transaction.Balance = (function() {

                        function Balance(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Balance.prototype.accountId = "";
                        Balance.prototype.current = null;
                        Balance.prototype.available = null;

                        Balance.create = function create(properties) {
                            return new Balance(properties);
                        };

                        return Balance;
                    })();

                    transaction.RequestStatus = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "INVALID_REQUEST"] = 0;
                        values[valuesById[1] = "SUCCESSFUL_REQUEST"] = 1;
                        values[valuesById[2] = "MORE_SIGNATURES_NEEDED"] = 2;
                        return values;
                    })();

                    return transaction;
                })();

                common.transfer = (function() {

                    const transfer = {};

                    transfer.Transfer = (function() {

                        function Transfer(p) {
                            this.payloadSignatures = [];
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Transfer.prototype.id = "";
                        Transfer.prototype.transactionId = "";
                        Transfer.prototype.createdAtMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                        Transfer.prototype.payload = null;
                        Transfer.prototype.payloadSignatures = $util.emptyArray;
                        Transfer.prototype.status = 0;
                        Transfer.prototype.orderId = "";
                        Transfer.prototype.method = 0;

                        Transfer.create = function create(properties) {
                            return new Transfer(properties);
                        };

                        Transfer.Method = (function() {
                            const valuesById = {}, values = Object.create(valuesById);
                            values[valuesById[0] = "DEFAULT"] = 0;
                            values[valuesById[1] = "INSTANT"] = 1;
                            return values;
                        })();

                        return Transfer;
                    })();

                    transfer.TransferPayload = (function() {

                        function TransferPayload(p) {
                            this.destinations = [];
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        TransferPayload.prototype.refId = "";
                        TransferPayload.prototype.tokenId = "";
                        TransferPayload.prototype.amount = null;
                        TransferPayload.prototype.destinations = $util.emptyArray;
                        TransferPayload.prototype.description = "";

                        TransferPayload.create = function create(properties) {
                            return new TransferPayload(properties);
                        };

                        return TransferPayload;
                    })();

                    return transfer;
                })();

                common.transferinstructions = (function() {

                    const transferinstructions = {};

                    transferinstructions.PurposeOfPayment = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "INVALID"] = 0;
                        values[valuesById[1] = "OTHER"] = 1;
                        values[valuesById[2] = "PERSONAL_EXPENSES"] = 2;
                        values[valuesById[3] = "PURCHASE_OF_SHARES"] = 3;
                        values[valuesById[4] = "TRANSFER_TO_YOUR_OWN_ACCOUNT"] = 4;
                        values[valuesById[5] = "PURCHASE_OF_PROPERTY"] = 5;
                        values[valuesById[6] = "FAMILY_MAINTENANCE"] = 6;
                        values[valuesById[7] = "SAVINGS"] = 7;
                        return values;
                    })();

                    transferinstructions.PaymentContext = (function() {
                        const valuesById = {}, values = Object.create(valuesById);
                        values[valuesById[0] = "INVALID_CONTEXT"] = 0;
                        values[valuesById[1] = "OTHER_CONTEXT"] = 1;
                        values[valuesById[2] = "BILL_PAYMENT"] = 2;
                        values[valuesById[3] = "ECOMMERCE_GOODS"] = 3;
                        values[valuesById[4] = "ECOMMERCE_SERVICES"] = 4;
                        values[valuesById[5] = "PERSON_TO_PERSON"] = 5;
                        return values;
                    })();

                    transferinstructions.CustomerData = (function() {

                        function CustomerData(p) {
                            this.legalNames = [];
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        CustomerData.prototype.legalNames = $util.emptyArray;
                        CustomerData.prototype.address = null;

                        CustomerData.create = function create(properties) {
                            return new CustomerData(properties);
                        };

                        return CustomerData;
                    })();

                    transferinstructions.TransferEndpoint = (function() {

                        function TransferEndpoint(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        TransferEndpoint.prototype.account = null;
                        TransferEndpoint.prototype.customerData = null;

                        TransferEndpoint.create = function create(properties) {
                            return new TransferEndpoint(properties);
                        };

                        return TransferEndpoint;
                    })();

                    transferinstructions.TransferInstructions = (function() {

                        function TransferInstructions(p) {
                            this.destinations = [];
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        TransferInstructions.prototype.source = null;
                        TransferInstructions.prototype.destinations = $util.emptyArray;
                        TransferInstructions.prototype.metadata = null;

                        TransferInstructions.create = function create(properties) {
                            return new TransferInstructions(properties);
                        };

                        TransferInstructions.Metadata = (function() {

                            function Metadata(p) {
                                if (p)
                                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                        if (p[ks[i]] != null)
                                            this[ks[i]] = p[ks[i]];
                            }

                            Metadata.prototype.transferPurpose = 0;
                            Metadata.prototype.paymentContext = 0;
                            Metadata.prototype.merchantCategoryCode = "";
                            Metadata.prototype.merchantCustomerId = "";
                            Metadata.prototype.deliveryAddress = null;

                            Metadata.create = function create(properties) {
                                return new Metadata(properties);
                            };

                            return Metadata;
                        })();

                        return TransferInstructions;
                    })();

                    return transferinstructions;
                })();

                return common;
            })();

            proto.banklink = (function() {

                const banklink = {};

                banklink.BankAuthorization = (function() {

                    function BankAuthorization(p) {
                        this.accounts = [];
                        if (p)
                            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                if (p[ks[i]] != null)
                                    this[ks[i]] = p[ks[i]];
                    }

                    BankAuthorization.prototype.bankId = "";
                    BankAuthorization.prototype.accounts = $util.emptyArray;

                    BankAuthorization.create = function create(properties) {
                        return new BankAuthorization(properties);
                    };

                    return BankAuthorization;
                })();

                banklink.OauthBankAuthorization = (function() {

                    function OauthBankAuthorization(p) {
                        if (p)
                            for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                if (p[ks[i]] != null)
                                    this[ks[i]] = p[ks[i]];
                    }

                    OauthBankAuthorization.prototype.bankId = "";
                    OauthBankAuthorization.prototype.accessToken = "";

                    OauthBankAuthorization.create = function create(properties) {
                        return new OauthBankAuthorization(properties);
                    };

                    return OauthBankAuthorization;
                })();

                banklink.AccountLinkingStatus = (function() {
                    const valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "INVALID"] = 0;
                    values[valuesById[1] = "SUCCESS"] = 1;
                    values[valuesById[2] = "FAILURE_BANK_AUTHORIZATION_REQUIRED"] = 2;
                    return values;
                })();

                return banklink;
            })();

            return proto;
        })();

        return token;
    })();

    return io;
})();

export { $root as default };
