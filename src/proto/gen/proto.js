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

                        PlaintextBankAuthorization.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.account.PlaintextBankAuthorization)
                                return d;
                            var m = new $root.io.token.proto.common.account.PlaintextBankAuthorization();
                            if (d.memberId != null) {
                                m.memberId = String(d.memberId);
                            }
                            if (d.accountName != null) {
                                m.accountName = String(d.accountName);
                            }
                            if (d.account != null) {
                                if (typeof d.account !== "object")
                                    throw TypeError(".io.token.proto.common.account.PlaintextBankAuthorization.account: object expected");
                                m.account = $root.io.token.proto.common.account.BankAccount.fromObject(d.account);
                            }
                            if (d.expirationMs != null) {
                                if ($util.Long)
                                    (m.expirationMs = $util.Long.fromValue(d.expirationMs)).unsigned = false;
                                else if (typeof d.expirationMs === "string")
                                    m.expirationMs = parseInt(d.expirationMs, 10);
                                else if (typeof d.expirationMs === "number")
                                    m.expirationMs = d.expirationMs;
                                else if (typeof d.expirationMs === "object")
                                    m.expirationMs = new $util.LongBits(d.expirationMs.low >>> 0, d.expirationMs.high >>> 0).toNumber();
                            }
                            return m;
                        };

                        PlaintextBankAuthorization.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.memberId = "";
                                d.accountName = "";
                                d.account = null;
                                if ($util.Long) {
                                    var n = new $util.Long(0, 0, false);
                                    d.expirationMs = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                } else
                                    d.expirationMs = o.longs === String ? "0" : 0;
                            }
                            if (m.memberId != null && m.hasOwnProperty("memberId")) {
                                d.memberId = m.memberId;
                            }
                            if (m.accountName != null && m.hasOwnProperty("accountName")) {
                                d.accountName = m.accountName;
                            }
                            if (m.account != null && m.hasOwnProperty("account")) {
                                d.account = $root.io.token.proto.common.account.BankAccount.toObject(m.account, o);
                            }
                            if (m.expirationMs != null && m.hasOwnProperty("expirationMs")) {
                                if (typeof m.expirationMs === "number")
                                    d.expirationMs = o.longs === String ? String(m.expirationMs) : m.expirationMs;
                                else
                                    d.expirationMs = o.longs === String ? $util.Long.prototype.toString.call(m.expirationMs) : o.longs === Number ? new $util.LongBits(m.expirationMs.low >>> 0, m.expirationMs.high >>> 0).toNumber() : m.expirationMs;
                            }
                            return d;
                        };

                        PlaintextBankAuthorization.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return PlaintextBankAuthorization;
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

                        AccountFeatures.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.account.AccountFeatures)
                                return d;
                            var m = new $root.io.token.proto.common.account.AccountFeatures();
                            if (d.supportsPayment != null) {
                                m.supportsPayment = Boolean(d.supportsPayment);
                            }
                            if (d.supportsInformation != null) {
                                m.supportsInformation = Boolean(d.supportsInformation);
                            }
                            if (d.requiresExternalAuth != null) {
                                m.requiresExternalAuth = Boolean(d.requiresExternalAuth);
                            }
                            if (d.supportsSendPayment != null) {
                                m.supportsSendPayment = Boolean(d.supportsSendPayment);
                            }
                            if (d.supportsReceivePayment != null) {
                                m.supportsReceivePayment = Boolean(d.supportsReceivePayment);
                            }
                            return m;
                        };

                        AccountFeatures.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.supportsPayment = false;
                                d.supportsInformation = false;
                                d.requiresExternalAuth = false;
                                d.supportsSendPayment = false;
                                d.supportsReceivePayment = false;
                            }
                            if (m.supportsPayment != null && m.hasOwnProperty("supportsPayment")) {
                                d.supportsPayment = m.supportsPayment;
                            }
                            if (m.supportsInformation != null && m.hasOwnProperty("supportsInformation")) {
                                d.supportsInformation = m.supportsInformation;
                            }
                            if (m.requiresExternalAuth != null && m.hasOwnProperty("requiresExternalAuth")) {
                                d.requiresExternalAuth = m.requiresExternalAuth;
                            }
                            if (m.supportsSendPayment != null && m.hasOwnProperty("supportsSendPayment")) {
                                d.supportsSendPayment = m.supportsSendPayment;
                            }
                            if (m.supportsReceivePayment != null && m.hasOwnProperty("supportsReceivePayment")) {
                                d.supportsReceivePayment = m.supportsReceivePayment;
                            }
                            return d;
                        };

                        AccountFeatures.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return AccountFeatures;
                    })();

                    account.AccountDetails = (function() {

                        function AccountDetails(p) {
                            this.metadata = {};
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        AccountDetails.prototype.identifier = "";
                        AccountDetails.prototype.type = 0;
                        AccountDetails.prototype.status = "";
                        AccountDetails.prototype.metadata = $util.emptyObject;

                        AccountDetails.create = function create(properties) {
                            return new AccountDetails(properties);
                        };

                        AccountDetails.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.account.AccountDetails)
                                return d;
                            var m = new $root.io.token.proto.common.account.AccountDetails();
                            if (d.identifier != null) {
                                m.identifier = String(d.identifier);
                            }
                            switch (d.type) {
                            case "INVALID":
                            case 0:
                                m.type = 0;
                                break;
                            case "OTHER":
                            case 1:
                                m.type = 1;
                                break;
                            case "CHECKING":
                            case 2:
                                m.type = 2;
                                break;
                            case "SAVINGS":
                            case 3:
                                m.type = 3;
                                break;
                            case "LOAN":
                            case 4:
                                m.type = 4;
                                break;
                            }
                            if (d.status != null) {
                                m.status = String(d.status);
                            }
                            if (d.metadata) {
                                if (typeof d.metadata !== "object")
                                    throw TypeError(".io.token.proto.common.account.AccountDetails.metadata: object expected");
                                m.metadata = {};
                                for (var ks = Object.keys(d.metadata), i = 0; i < ks.length; ++i) {
                                    m.metadata[ks[i]] = String(d.metadata[ks[i]]);
                                }
                            }
                            return m;
                        };

                        AccountDetails.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.objects || o.defaults) {
                                d.metadata = {};
                            }
                            if (o.defaults) {
                                d.identifier = "";
                                d.type = o.enums === String ? "INVALID" : 0;
                                d.status = "";
                            }
                            if (m.identifier != null && m.hasOwnProperty("identifier")) {
                                d.identifier = m.identifier;
                            }
                            if (m.type != null && m.hasOwnProperty("type")) {
                                d.type = o.enums === String ? $root.io.token.proto.common.account.AccountDetails.AccountType[m.type] : m.type;
                            }
                            if (m.status != null && m.hasOwnProperty("status")) {
                                d.status = m.status;
                            }
                            var ks2;
                            if (m.metadata && (ks2 = Object.keys(m.metadata)).length) {
                                d.metadata = {};
                                for (var j = 0; j < ks2.length; ++j) {
                                    d.metadata[ks2[j]] = m.metadata[ks2[j]];
                                }
                            }
                            return d;
                        };

                        AccountDetails.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        AccountDetails.AccountType = (function() {
                            const valuesById = {}, values = Object.create(valuesById);
                            values[valuesById[0] = "INVALID"] = 0;
                            values[valuesById[1] = "OTHER"] = 1;
                            values[valuesById[2] = "CHECKING"] = 2;
                            values[valuesById[3] = "SAVINGS"] = 3;
                            values[valuesById[4] = "LOAN"] = 4;
                            return values;
                        })();

                        return AccountDetails;
                    })();

                    account.Account = (function() {

                        function Account(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        Account.prototype.id = "";
                        Account.prototype.name = "";
                        Account.prototype.bankId = "";
                        Account.prototype.isLocked = false;
                        Account.prototype.accountFeatures = null;
                        Account.prototype.lastCacheUpdateMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                        Account.prototype.nextCacheUpdateMs = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                        Account.prototype.accountDetails = null;

                        Account.create = function create(properties) {
                            return new Account(properties);
                        };

                        Account.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.account.Account)
                                return d;
                            var m = new $root.io.token.proto.common.account.Account();
                            if (d.id != null) {
                                m.id = String(d.id);
                            }
                            if (d.name != null) {
                                m.name = String(d.name);
                            }
                            if (d.bankId != null) {
                                m.bankId = String(d.bankId);
                            }
                            if (d.isLocked != null) {
                                m.isLocked = Boolean(d.isLocked);
                            }
                            if (d.accountFeatures != null) {
                                if (typeof d.accountFeatures !== "object")
                                    throw TypeError(".io.token.proto.common.account.Account.accountFeatures: object expected");
                                m.accountFeatures = $root.io.token.proto.common.account.AccountFeatures.fromObject(d.accountFeatures);
                            }
                            if (d.lastCacheUpdateMs != null) {
                                if ($util.Long)
                                    (m.lastCacheUpdateMs = $util.Long.fromValue(d.lastCacheUpdateMs)).unsigned = false;
                                else if (typeof d.lastCacheUpdateMs === "string")
                                    m.lastCacheUpdateMs = parseInt(d.lastCacheUpdateMs, 10);
                                else if (typeof d.lastCacheUpdateMs === "number")
                                    m.lastCacheUpdateMs = d.lastCacheUpdateMs;
                                else if (typeof d.lastCacheUpdateMs === "object")
                                    m.lastCacheUpdateMs = new $util.LongBits(d.lastCacheUpdateMs.low >>> 0, d.lastCacheUpdateMs.high >>> 0).toNumber();
                            }
                            if (d.nextCacheUpdateMs != null) {
                                if ($util.Long)
                                    (m.nextCacheUpdateMs = $util.Long.fromValue(d.nextCacheUpdateMs)).unsigned = false;
                                else if (typeof d.nextCacheUpdateMs === "string")
                                    m.nextCacheUpdateMs = parseInt(d.nextCacheUpdateMs, 10);
                                else if (typeof d.nextCacheUpdateMs === "number")
                                    m.nextCacheUpdateMs = d.nextCacheUpdateMs;
                                else if (typeof d.nextCacheUpdateMs === "object")
                                    m.nextCacheUpdateMs = new $util.LongBits(d.nextCacheUpdateMs.low >>> 0, d.nextCacheUpdateMs.high >>> 0).toNumber();
                            }
                            if (d.accountDetails != null) {
                                if (typeof d.accountDetails !== "object")
                                    throw TypeError(".io.token.proto.common.account.Account.accountDetails: object expected");
                                m.accountDetails = $root.io.token.proto.common.account.AccountDetails.fromObject(d.accountDetails);
                            }
                            return m;
                        };

                        Account.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.id = "";
                                d.name = "";
                                d.bankId = "";
                                d.isLocked = false;
                                d.accountFeatures = null;
                                if ($util.Long) {
                                    var n = new $util.Long(0, 0, false);
                                    d.lastCacheUpdateMs = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                } else
                                    d.lastCacheUpdateMs = o.longs === String ? "0" : 0;
                                if ($util.Long) {
                                    var n = new $util.Long(0, 0, false);
                                    d.nextCacheUpdateMs = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                } else
                                    d.nextCacheUpdateMs = o.longs === String ? "0" : 0;
                                d.accountDetails = null;
                            }
                            if (m.id != null && m.hasOwnProperty("id")) {
                                d.id = m.id;
                            }
                            if (m.name != null && m.hasOwnProperty("name")) {
                                d.name = m.name;
                            }
                            if (m.bankId != null && m.hasOwnProperty("bankId")) {
                                d.bankId = m.bankId;
                            }
                            if (m.isLocked != null && m.hasOwnProperty("isLocked")) {
                                d.isLocked = m.isLocked;
                            }
                            if (m.accountFeatures != null && m.hasOwnProperty("accountFeatures")) {
                                d.accountFeatures = $root.io.token.proto.common.account.AccountFeatures.toObject(m.accountFeatures, o);
                            }
                            if (m.lastCacheUpdateMs != null && m.hasOwnProperty("lastCacheUpdateMs")) {
                                if (typeof m.lastCacheUpdateMs === "number")
                                    d.lastCacheUpdateMs = o.longs === String ? String(m.lastCacheUpdateMs) : m.lastCacheUpdateMs;
                                else
                                    d.lastCacheUpdateMs = o.longs === String ? $util.Long.prototype.toString.call(m.lastCacheUpdateMs) : o.longs === Number ? new $util.LongBits(m.lastCacheUpdateMs.low >>> 0, m.lastCacheUpdateMs.high >>> 0).toNumber() : m.lastCacheUpdateMs;
                            }
                            if (m.nextCacheUpdateMs != null && m.hasOwnProperty("nextCacheUpdateMs")) {
                                if (typeof m.nextCacheUpdateMs === "number")
                                    d.nextCacheUpdateMs = o.longs === String ? String(m.nextCacheUpdateMs) : m.nextCacheUpdateMs;
                                else
                                    d.nextCacheUpdateMs = o.longs === String ? $util.Long.prototype.toString.call(m.nextCacheUpdateMs) : o.longs === Number ? new $util.LongBits(m.nextCacheUpdateMs.low >>> 0, m.nextCacheUpdateMs.high >>> 0).toNumber() : m.nextCacheUpdateMs;
                            }
                            if (m.accountDetails != null && m.hasOwnProperty("accountDetails")) {
                                d.accountDetails = $root.io.token.proto.common.account.AccountDetails.toObject(m.accountDetails, o);
                            }
                            return d;
                        };

                        Account.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        BankAccount.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.account.BankAccount)
                                return d;
                            var m = new $root.io.token.proto.common.account.BankAccount();
                            if (d.token != null) {
                                if (typeof d.token !== "object")
                                    throw TypeError(".io.token.proto.common.account.BankAccount.token: object expected");
                                m.token = $root.io.token.proto.common.account.BankAccount.Token.fromObject(d.token);
                            }
                            if (d.tokenAuthorization != null) {
                                if (typeof d.tokenAuthorization !== "object")
                                    throw TypeError(".io.token.proto.common.account.BankAccount.tokenAuthorization: object expected");
                                m.tokenAuthorization = $root.io.token.proto.common.account.BankAccount.TokenAuthorization.fromObject(d.tokenAuthorization);
                            }
                            if (d.swift != null) {
                                if (typeof d.swift !== "object")
                                    throw TypeError(".io.token.proto.common.account.BankAccount.swift: object expected");
                                m.swift = $root.io.token.proto.common.account.BankAccount.Swift.fromObject(d.swift);
                            }
                            if (d.sepa != null) {
                                if (typeof d.sepa !== "object")
                                    throw TypeError(".io.token.proto.common.account.BankAccount.sepa: object expected");
                                m.sepa = $root.io.token.proto.common.account.BankAccount.Sepa.fromObject(d.sepa);
                            }
                            if (d.ach != null) {
                                if (typeof d.ach !== "object")
                                    throw TypeError(".io.token.proto.common.account.BankAccount.ach: object expected");
                                m.ach = $root.io.token.proto.common.account.BankAccount.Ach.fromObject(d.ach);
                            }
                            if (d.bank != null) {
                                if (typeof d.bank !== "object")
                                    throw TypeError(".io.token.proto.common.account.BankAccount.bank: object expected");
                                m.bank = $root.io.token.proto.common.account.BankAccount.Bank.fromObject(d.bank);
                            }
                            if (d.fasterPayments != null) {
                                if (typeof d.fasterPayments !== "object")
                                    throw TypeError(".io.token.proto.common.account.BankAccount.fasterPayments: object expected");
                                m.fasterPayments = $root.io.token.proto.common.account.BankAccount.FasterPayments.fromObject(d.fasterPayments);
                            }
                            if (d.custom != null) {
                                if (typeof d.custom !== "object")
                                    throw TypeError(".io.token.proto.common.account.BankAccount.custom: object expected");
                                m.custom = $root.io.token.proto.common.account.BankAccount.Custom.fromObject(d.custom);
                            }
                            if (d.metadata) {
                                if (typeof d.metadata !== "object")
                                    throw TypeError(".io.token.proto.common.account.BankAccount.metadata: object expected");
                                m.metadata = {};
                                for (var ks = Object.keys(d.metadata), i = 0; i < ks.length; ++i) {
                                    m.metadata[ks[i]] = String(d.metadata[ks[i]]);
                                }
                            }
                            if (d.accountFeatures != null) {
                                if (typeof d.accountFeatures !== "object")
                                    throw TypeError(".io.token.proto.common.account.BankAccount.accountFeatures: object expected");
                                m.accountFeatures = $root.io.token.proto.common.account.AccountFeatures.fromObject(d.accountFeatures);
                            }
                            return m;
                        };

                        BankAccount.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.objects || o.defaults) {
                                d.metadata = {};
                            }
                            if (o.defaults) {
                                d.accountFeatures = null;
                            }
                            if (m.token != null && m.hasOwnProperty("token")) {
                                d.token = $root.io.token.proto.common.account.BankAccount.Token.toObject(m.token, o);
                                if (o.oneofs)
                                    d.account = "token";
                            }
                            if (m.tokenAuthorization != null && m.hasOwnProperty("tokenAuthorization")) {
                                d.tokenAuthorization = $root.io.token.proto.common.account.BankAccount.TokenAuthorization.toObject(m.tokenAuthorization, o);
                                if (o.oneofs)
                                    d.account = "tokenAuthorization";
                            }
                            if (m.swift != null && m.hasOwnProperty("swift")) {
                                d.swift = $root.io.token.proto.common.account.BankAccount.Swift.toObject(m.swift, o);
                                if (o.oneofs)
                                    d.account = "swift";
                            }
                            if (m.sepa != null && m.hasOwnProperty("sepa")) {
                                d.sepa = $root.io.token.proto.common.account.BankAccount.Sepa.toObject(m.sepa, o);
                                if (o.oneofs)
                                    d.account = "sepa";
                            }
                            if (m.ach != null && m.hasOwnProperty("ach")) {
                                d.ach = $root.io.token.proto.common.account.BankAccount.Ach.toObject(m.ach, o);
                                if (o.oneofs)
                                    d.account = "ach";
                            }
                            if (m.bank != null && m.hasOwnProperty("bank")) {
                                d.bank = $root.io.token.proto.common.account.BankAccount.Bank.toObject(m.bank, o);
                                if (o.oneofs)
                                    d.account = "bank";
                            }
                            var ks2;
                            if (m.metadata && (ks2 = Object.keys(m.metadata)).length) {
                                d.metadata = {};
                                for (var j = 0; j < ks2.length; ++j) {
                                    d.metadata[ks2[j]] = m.metadata[ks2[j]];
                                }
                            }
                            if (m.accountFeatures != null && m.hasOwnProperty("accountFeatures")) {
                                d.accountFeatures = $root.io.token.proto.common.account.AccountFeatures.toObject(m.accountFeatures, o);
                            }
                            if (m.fasterPayments != null && m.hasOwnProperty("fasterPayments")) {
                                d.fasterPayments = $root.io.token.proto.common.account.BankAccount.FasterPayments.toObject(m.fasterPayments, o);
                                if (o.oneofs)
                                    d.account = "fasterPayments";
                            }
                            if (m.custom != null && m.hasOwnProperty("custom")) {
                                d.custom = $root.io.token.proto.common.account.BankAccount.Custom.toObject(m.custom, o);
                                if (o.oneofs)
                                    d.account = "custom";
                            }
                            return d;
                        };

                        BankAccount.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            Token.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.account.BankAccount.Token)
                                    return d;
                                var m = new $root.io.token.proto.common.account.BankAccount.Token();
                                if (d.memberId != null) {
                                    m.memberId = String(d.memberId);
                                }
                                if (d.accountId != null) {
                                    m.accountId = String(d.accountId);
                                }
                                return m;
                            };

                            Token.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (o.defaults) {
                                    d.memberId = "";
                                    d.accountId = "";
                                }
                                if (m.memberId != null && m.hasOwnProperty("memberId")) {
                                    d.memberId = m.memberId;
                                }
                                if (m.accountId != null && m.hasOwnProperty("accountId")) {
                                    d.accountId = m.accountId;
                                }
                                return d;
                            };

                            Token.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            TokenAuthorization.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.account.BankAccount.TokenAuthorization)
                                    return d;
                                var m = new $root.io.token.proto.common.account.BankAccount.TokenAuthorization();
                                if (d.authorization != null) {
                                    if (typeof d.authorization !== "object")
                                        throw TypeError(".io.token.proto.common.account.BankAccount.TokenAuthorization.authorization: object expected");
                                    m.authorization = $root.io.token.proto.banklink.BankAuthorization.fromObject(d.authorization);
                                }
                                return m;
                            };

                            TokenAuthorization.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (o.defaults) {
                                    d.authorization = null;
                                }
                                if (m.authorization != null && m.hasOwnProperty("authorization")) {
                                    d.authorization = $root.io.token.proto.banklink.BankAuthorization.toObject(m.authorization, o);
                                }
                                return d;
                            };

                            TokenAuthorization.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            Bank.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.account.BankAccount.Bank)
                                    return d;
                                var m = new $root.io.token.proto.common.account.BankAccount.Bank();
                                if (d.bankId != null) {
                                    m.bankId = String(d.bankId);
                                }
                                return m;
                            };

                            Bank.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (o.defaults) {
                                    d.bankId = "";
                                }
                                if (m.bankId != null && m.hasOwnProperty("bankId")) {
                                    d.bankId = m.bankId;
                                }
                                return d;
                            };

                            Bank.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            Swift.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.account.BankAccount.Swift)
                                    return d;
                                var m = new $root.io.token.proto.common.account.BankAccount.Swift();
                                if (d.bic != null) {
                                    m.bic = String(d.bic);
                                }
                                if (d.account != null) {
                                    m.account = String(d.account);
                                }
                                return m;
                            };

                            Swift.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (o.defaults) {
                                    d.bic = "";
                                    d.account = "";
                                }
                                if (m.bic != null && m.hasOwnProperty("bic")) {
                                    d.bic = m.bic;
                                }
                                if (m.account != null && m.hasOwnProperty("account")) {
                                    d.account = m.account;
                                }
                                return d;
                            };

                            Swift.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            Sepa.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.account.BankAccount.Sepa)
                                    return d;
                                var m = new $root.io.token.proto.common.account.BankAccount.Sepa();
                                if (d.iban != null) {
                                    m.iban = String(d.iban);
                                }
                                if (d.bic != null) {
                                    m.bic = String(d.bic);
                                }
                                return m;
                            };

                            Sepa.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (o.defaults) {
                                    d.iban = "";
                                    d.bic = "";
                                }
                                if (m.iban != null && m.hasOwnProperty("iban")) {
                                    d.iban = m.iban;
                                }
                                if (m.bic != null && m.hasOwnProperty("bic")) {
                                    d.bic = m.bic;
                                }
                                return d;
                            };

                            Sepa.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            Ach.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.account.BankAccount.Ach)
                                    return d;
                                var m = new $root.io.token.proto.common.account.BankAccount.Ach();
                                if (d.routing != null) {
                                    m.routing = String(d.routing);
                                }
                                if (d.account != null) {
                                    m.account = String(d.account);
                                }
                                return m;
                            };

                            Ach.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (o.defaults) {
                                    d.routing = "";
                                    d.account = "";
                                }
                                if (m.routing != null && m.hasOwnProperty("routing")) {
                                    d.routing = m.routing;
                                }
                                if (m.account != null && m.hasOwnProperty("account")) {
                                    d.account = m.account;
                                }
                                return d;
                            };

                            Ach.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            FasterPayments.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.account.BankAccount.FasterPayments)
                                    return d;
                                var m = new $root.io.token.proto.common.account.BankAccount.FasterPayments();
                                if (d.sortCode != null) {
                                    m.sortCode = String(d.sortCode);
                                }
                                if (d.accountNumber != null) {
                                    m.accountNumber = String(d.accountNumber);
                                }
                                return m;
                            };

                            FasterPayments.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (o.defaults) {
                                    d.sortCode = "";
                                    d.accountNumber = "";
                                }
                                if (m.sortCode != null && m.hasOwnProperty("sortCode")) {
                                    d.sortCode = m.sortCode;
                                }
                                if (m.accountNumber != null && m.hasOwnProperty("accountNumber")) {
                                    d.accountNumber = m.accountNumber;
                                }
                                return d;
                            };

                            FasterPayments.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            Custom.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.account.BankAccount.Custom)
                                    return d;
                                var m = new $root.io.token.proto.common.account.BankAccount.Custom();
                                if (d.bankId != null) {
                                    m.bankId = String(d.bankId);
                                }
                                if (d.payload != null) {
                                    m.payload = String(d.payload);
                                }
                                return m;
                            };

                            Custom.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (o.defaults) {
                                    d.bankId = "";
                                    d.payload = "";
                                }
                                if (m.bankId != null && m.hasOwnProperty("bankId")) {
                                    d.bankId = m.bankId;
                                }
                                if (m.payload != null && m.hasOwnProperty("payload")) {
                                    d.payload = m.payload;
                                }
                                return d;
                            };

                            Custom.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                            };

                            return Custom;
                        })();

                        return BankAccount;
                    })();

                    return account;
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

                        Key.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.security.Key)
                                return d;
                            var m = new $root.io.token.proto.common.security.Key();
                            if (d.id != null) {
                                m.id = String(d.id);
                            }
                            if (d.publicKey != null) {
                                m.publicKey = String(d.publicKey);
                            }
                            switch (d.level) {
                            case "INVALID_LEVEL":
                            case 0:
                                m.level = 0;
                                break;
                            case "PRIVILEGED":
                            case 1:
                                m.level = 1;
                                break;
                            case "STANDARD":
                            case 2:
                                m.level = 2;
                                break;
                            case "LOW":
                            case 3:
                                m.level = 3;
                                break;
                            }
                            switch (d.algorithm) {
                            case "INVALID_ALGORITHM":
                            case 0:
                                m.algorithm = 0;
                                break;
                            case "ED25519":
                            case 1:
                                m.algorithm = 1;
                                break;
                            case "ECDSA_SHA256":
                            case 2:
                                m.algorithm = 2;
                                break;
                            case "RS256":
                            case 3:
                                m.algorithm = 3;
                                break;
                            }
                            if (d.expiresAtMs != null) {
                                if ($util.Long)
                                    (m.expiresAtMs = $util.Long.fromValue(d.expiresAtMs)).unsigned = false;
                                else if (typeof d.expiresAtMs === "string")
                                    m.expiresAtMs = parseInt(d.expiresAtMs, 10);
                                else if (typeof d.expiresAtMs === "number")
                                    m.expiresAtMs = d.expiresAtMs;
                                else if (typeof d.expiresAtMs === "object")
                                    m.expiresAtMs = new $util.LongBits(d.expiresAtMs.low >>> 0, d.expiresAtMs.high >>> 0).toNumber();
                            }
                            return m;
                        };

                        Key.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.id = "";
                                d.publicKey = "";
                                d.level = o.enums === String ? "INVALID_LEVEL" : 0;
                                d.algorithm = o.enums === String ? "INVALID_ALGORITHM" : 0;
                                if ($util.Long) {
                                    var n = new $util.Long(0, 0, false);
                                    d.expiresAtMs = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                } else
                                    d.expiresAtMs = o.longs === String ? "0" : 0;
                            }
                            if (m.id != null && m.hasOwnProperty("id")) {
                                d.id = m.id;
                            }
                            if (m.publicKey != null && m.hasOwnProperty("publicKey")) {
                                d.publicKey = m.publicKey;
                            }
                            if (m.level != null && m.hasOwnProperty("level")) {
                                d.level = o.enums === String ? $root.io.token.proto.common.security.Key.Level[m.level] : m.level;
                            }
                            if (m.algorithm != null && m.hasOwnProperty("algorithm")) {
                                d.algorithm = o.enums === String ? $root.io.token.proto.common.security.Key.Algorithm[m.algorithm] : m.algorithm;
                            }
                            if (m.expiresAtMs != null && m.hasOwnProperty("expiresAtMs")) {
                                if (typeof m.expiresAtMs === "number")
                                    d.expiresAtMs = o.longs === String ? String(m.expiresAtMs) : m.expiresAtMs;
                                else
                                    d.expiresAtMs = o.longs === String ? $util.Long.prototype.toString.call(m.expiresAtMs) : o.longs === Number ? new $util.LongBits(m.expiresAtMs.low >>> 0, m.expiresAtMs.high >>> 0).toNumber() : m.expiresAtMs;
                            }
                            return d;
                        };

                        Key.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        PrivateKey.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.security.PrivateKey)
                                return d;
                            var m = new $root.io.token.proto.common.security.PrivateKey();
                            if (d.id != null) {
                                m.id = String(d.id);
                            }
                            if (d.privateKey != null) {
                                m.privateKey = String(d.privateKey);
                            }
                            switch (d.level) {
                            case "INVALID_LEVEL":
                            case 0:
                                m.level = 0;
                                break;
                            case "PRIVILEGED":
                            case 1:
                                m.level = 1;
                                break;
                            case "STANDARD":
                            case 2:
                                m.level = 2;
                                break;
                            case "LOW":
                            case 3:
                                m.level = 3;
                                break;
                            }
                            switch (d.algorithm) {
                            case "INVALID_ALGORITHM":
                            case 0:
                                m.algorithm = 0;
                                break;
                            case "ED25519":
                            case 1:
                                m.algorithm = 1;
                                break;
                            case "ECDSA_SHA256":
                            case 2:
                                m.algorithm = 2;
                                break;
                            case "RS256":
                            case 3:
                                m.algorithm = 3;
                                break;
                            }
                            return m;
                        };

                        PrivateKey.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.id = "";
                                d.privateKey = "";
                                d.level = o.enums === String ? "INVALID_LEVEL" : 0;
                                d.algorithm = o.enums === String ? "INVALID_ALGORITHM" : 0;
                            }
                            if (m.id != null && m.hasOwnProperty("id")) {
                                d.id = m.id;
                            }
                            if (m.privateKey != null && m.hasOwnProperty("privateKey")) {
                                d.privateKey = m.privateKey;
                            }
                            if (m.level != null && m.hasOwnProperty("level")) {
                                d.level = o.enums === String ? $root.io.token.proto.common.security.Key.Level[m.level] : m.level;
                            }
                            if (m.algorithm != null && m.hasOwnProperty("algorithm")) {
                                d.algorithm = o.enums === String ? $root.io.token.proto.common.security.Key.Algorithm[m.algorithm] : m.algorithm;
                            }
                            return d;
                        };

                        PrivateKey.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        Signature.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.security.Signature)
                                return d;
                            var m = new $root.io.token.proto.common.security.Signature();
                            if (d.memberId != null) {
                                m.memberId = String(d.memberId);
                            }
                            if (d.keyId != null) {
                                m.keyId = String(d.keyId);
                            }
                            if (d.signature != null) {
                                m.signature = String(d.signature);
                            }
                            return m;
                        };

                        Signature.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.memberId = "";
                                d.keyId = "";
                                d.signature = "";
                            }
                            if (m.memberId != null && m.hasOwnProperty("memberId")) {
                                d.memberId = m.memberId;
                            }
                            if (m.keyId != null && m.hasOwnProperty("keyId")) {
                                d.keyId = m.keyId;
                            }
                            if (m.signature != null && m.hasOwnProperty("signature")) {
                                d.signature = m.signature;
                            }
                            return d;
                        };

                        Signature.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        SealedMessage.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.security.SealedMessage)
                                return d;
                            var m = new $root.io.token.proto.common.security.SealedMessage();
                            if (d.ciphertext != null) {
                                m.ciphertext = String(d.ciphertext);
                            }
                            if (d.noop != null) {
                                if (typeof d.noop !== "object")
                                    throw TypeError(".io.token.proto.common.security.SealedMessage.noop: object expected");
                                m.noop = $root.io.token.proto.common.security.SealedMessage.NoopMethod.fromObject(d.noop);
                            }
                            if (d.rsa != null) {
                                if (typeof d.rsa !== "object")
                                    throw TypeError(".io.token.proto.common.security.SealedMessage.rsa: object expected");
                                m.rsa = $root.io.token.proto.common.security.SealedMessage.RsaMethod.fromObject(d.rsa);
                            }
                            if (d.rsaAes != null) {
                                if (typeof d.rsaAes !== "object")
                                    throw TypeError(".io.token.proto.common.security.SealedMessage.rsaAes: object expected");
                                m.rsaAes = $root.io.token.proto.common.security.SealedMessage.RsaAesMethod.fromObject(d.rsaAes);
                            }
                            return m;
                        };

                        SealedMessage.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.ciphertext = "";
                            }
                            if (m.ciphertext != null && m.hasOwnProperty("ciphertext")) {
                                d.ciphertext = m.ciphertext;
                            }
                            if (m.noop != null && m.hasOwnProperty("noop")) {
                                d.noop = $root.io.token.proto.common.security.SealedMessage.NoopMethod.toObject(m.noop, o);
                                if (o.oneofs)
                                    d.method = "noop";
                            }
                            if (m.rsa != null && m.hasOwnProperty("rsa")) {
                                d.rsa = $root.io.token.proto.common.security.SealedMessage.RsaMethod.toObject(m.rsa, o);
                                if (o.oneofs)
                                    d.method = "rsa";
                            }
                            if (m.rsaAes != null && m.hasOwnProperty("rsaAes")) {
                                d.rsaAes = $root.io.token.proto.common.security.SealedMessage.RsaAesMethod.toObject(m.rsaAes, o);
                                if (o.oneofs)
                                    d.method = "rsaAes";
                            }
                            return d;
                        };

                        SealedMessage.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            NoopMethod.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.security.SealedMessage.NoopMethod)
                                    return d;
                                return new $root.io.token.proto.common.security.SealedMessage.NoopMethod();
                            };

                            NoopMethod.toObject = function toObject() {
                                return {};
                            };

                            NoopMethod.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            RsaMethod.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.security.SealedMessage.RsaMethod)
                                    return d;
                                var m = new $root.io.token.proto.common.security.SealedMessage.RsaMethod();
                                if (d.keyId != null) {
                                    m.keyId = String(d.keyId);
                                }
                                if (d.algorithm != null) {
                                    m.algorithm = String(d.algorithm);
                                }
                                if (d.signature != null) {
                                    m.signature = String(d.signature);
                                }
                                if (d.signatureKeyId != null) {
                                    m.signatureKeyId = String(d.signatureKeyId);
                                }
                                return m;
                            };

                            RsaMethod.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (o.defaults) {
                                    d.keyId = "";
                                    d.algorithm = "";
                                    d.signature = "";
                                    d.signatureKeyId = "";
                                }
                                if (m.keyId != null && m.hasOwnProperty("keyId")) {
                                    d.keyId = m.keyId;
                                }
                                if (m.algorithm != null && m.hasOwnProperty("algorithm")) {
                                    d.algorithm = m.algorithm;
                                }
                                if (m.signature != null && m.hasOwnProperty("signature")) {
                                    d.signature = m.signature;
                                }
                                if (m.signatureKeyId != null && m.hasOwnProperty("signatureKeyId")) {
                                    d.signatureKeyId = m.signatureKeyId;
                                }
                                return d;
                            };

                            RsaMethod.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            RsaAesMethod.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.security.SealedMessage.RsaAesMethod)
                                    return d;
                                var m = new $root.io.token.proto.common.security.SealedMessage.RsaAesMethod();
                                if (d.rsaKeyId != null) {
                                    m.rsaKeyId = String(d.rsaKeyId);
                                }
                                if (d.rsaAlgorithm != null) {
                                    m.rsaAlgorithm = String(d.rsaAlgorithm);
                                }
                                if (d.aesAlgorithm != null) {
                                    m.aesAlgorithm = String(d.aesAlgorithm);
                                }
                                if (d.encryptedAesKey != null) {
                                    m.encryptedAesKey = String(d.encryptedAesKey);
                                }
                                if (d.signature != null) {
                                    m.signature = String(d.signature);
                                }
                                if (d.signatureKeyId != null) {
                                    m.signatureKeyId = String(d.signatureKeyId);
                                }
                                return m;
                            };

                            RsaAesMethod.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (o.defaults) {
                                    d.rsaKeyId = "";
                                    d.rsaAlgorithm = "";
                                    d.aesAlgorithm = "";
                                    d.encryptedAesKey = "";
                                    d.signature = "";
                                    d.signatureKeyId = "";
                                }
                                if (m.rsaKeyId != null && m.hasOwnProperty("rsaKeyId")) {
                                    d.rsaKeyId = m.rsaKeyId;
                                }
                                if (m.rsaAlgorithm != null && m.hasOwnProperty("rsaAlgorithm")) {
                                    d.rsaAlgorithm = m.rsaAlgorithm;
                                }
                                if (m.aesAlgorithm != null && m.hasOwnProperty("aesAlgorithm")) {
                                    d.aesAlgorithm = m.aesAlgorithm;
                                }
                                if (m.encryptedAesKey != null && m.hasOwnProperty("encryptedAesKey")) {
                                    d.encryptedAesKey = m.encryptedAesKey;
                                }
                                if (m.signature != null && m.hasOwnProperty("signature")) {
                                    d.signature = m.signature;
                                }
                                if (m.signatureKeyId != null && m.hasOwnProperty("signatureKeyId")) {
                                    d.signatureKeyId = m.signatureKeyId;
                                }
                                return d;
                            };

                            RsaAesMethod.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                            };

                            return RsaAesMethod;
                        })();

                        return SealedMessage;
                    })();

                    return security;
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

                        Address.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.address.Address)
                                return d;
                            var m = new $root.io.token.proto.common.address.Address();
                            if (d.houseNumber != null) {
                                m.houseNumber = String(d.houseNumber);
                            }
                            if (d.houseName != null) {
                                m.houseName = String(d.houseName);
                            }
                            if (d.flats != null) {
                                m.flats = String(d.flats);
                            }
                            if (d.conscriptionNumber != null) {
                                m.conscriptionNumber = String(d.conscriptionNumber);
                            }
                            if (d.street != null) {
                                m.street = String(d.street);
                            }
                            if (d.place != null) {
                                m.place = String(d.place);
                            }
                            if (d.postCode != null) {
                                m.postCode = String(d.postCode);
                            }
                            if (d.city != null) {
                                m.city = String(d.city);
                            }
                            if (d.country != null) {
                                m.country = String(d.country);
                            }
                            if (d.full != null) {
                                m.full = String(d.full);
                            }
                            if (d.hamlet != null) {
                                m.hamlet = String(d.hamlet);
                            }
                            if (d.suburb != null) {
                                m.suburb = String(d.suburb);
                            }
                            if (d.subdistrict != null) {
                                m.subdistrict = String(d.subdistrict);
                            }
                            if (d.district != null) {
                                m.district = String(d.district);
                            }
                            if (d.province != null) {
                                m.province = String(d.province);
                            }
                            if (d.state != null) {
                                m.state = String(d.state);
                            }
                            return m;
                        };

                        Address.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.houseNumber = "";
                                d.houseName = "";
                                d.flats = "";
                                d.conscriptionNumber = "";
                                d.street = "";
                                d.place = "";
                                d.postCode = "";
                                d.city = "";
                                d.country = "";
                                d.full = "";
                                d.hamlet = "";
                                d.suburb = "";
                                d.subdistrict = "";
                                d.district = "";
                                d.province = "";
                                d.state = "";
                            }
                            if (m.houseNumber != null && m.hasOwnProperty("houseNumber")) {
                                d.houseNumber = m.houseNumber;
                            }
                            if (m.houseName != null && m.hasOwnProperty("houseName")) {
                                d.houseName = m.houseName;
                            }
                            if (m.flats != null && m.hasOwnProperty("flats")) {
                                d.flats = m.flats;
                            }
                            if (m.conscriptionNumber != null && m.hasOwnProperty("conscriptionNumber")) {
                                d.conscriptionNumber = m.conscriptionNumber;
                            }
                            if (m.street != null && m.hasOwnProperty("street")) {
                                d.street = m.street;
                            }
                            if (m.place != null && m.hasOwnProperty("place")) {
                                d.place = m.place;
                            }
                            if (m.postCode != null && m.hasOwnProperty("postCode")) {
                                d.postCode = m.postCode;
                            }
                            if (m.city != null && m.hasOwnProperty("city")) {
                                d.city = m.city;
                            }
                            if (m.country != null && m.hasOwnProperty("country")) {
                                d.country = m.country;
                            }
                            if (m.full != null && m.hasOwnProperty("full")) {
                                d.full = m.full;
                            }
                            if (m.hamlet != null && m.hasOwnProperty("hamlet")) {
                                d.hamlet = m.hamlet;
                            }
                            if (m.suburb != null && m.hasOwnProperty("suburb")) {
                                d.suburb = m.suburb;
                            }
                            if (m.subdistrict != null && m.hasOwnProperty("subdistrict")) {
                                d.subdistrict = m.subdistrict;
                            }
                            if (m.district != null && m.hasOwnProperty("district")) {
                                d.district = m.district;
                            }
                            if (m.province != null && m.hasOwnProperty("province")) {
                                d.province = m.province;
                            }
                            if (m.state != null && m.hasOwnProperty("state")) {
                                d.state = m.state;
                            }
                            return d;
                        };

                        Address.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        Alias.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.alias.Alias)
                                return d;
                            var m = new $root.io.token.proto.common.alias.Alias();
                            switch (d.type) {
                            case "INVALID":
                            case 0:
                                m.type = 0;
                                break;
                            case "UNKNOWN":
                            case 1:
                                m.type = 1;
                                break;
                            case "EMAIL":
                            case 2:
                                m.type = 2;
                                break;
                            case "PHONE":
                            case 3:
                                m.type = 3;
                                break;
                            case "DOMAIN":
                            case 4:
                                m.type = 4;
                                break;
                            case "USERNAME":
                            case 5:
                                m.type = 5;
                                break;
                            case "BANK":
                            case 6:
                                m.type = 6;
                                break;
                            }
                            if (d.value != null) {
                                m.value = String(d.value);
                            }
                            if (d.realm != null) {
                                m.realm = String(d.realm);
                            }
                            return m;
                        };

                        Alias.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.type = o.enums === String ? "INVALID" : 0;
                                d.value = "";
                                d.realm = "";
                            }
                            if (m.type != null && m.hasOwnProperty("type")) {
                                d.type = o.enums === String ? $root.io.token.proto.common.alias.Alias.Type[m.type] : m.type;
                            }
                            if (m.value != null && m.hasOwnProperty("value")) {
                                d.value = m.value;
                            }
                            if (m.realm != null && m.hasOwnProperty("realm")) {
                                d.realm = m.realm;
                            }
                            return d;
                        };

                        Alias.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        VerifyAliasPayload.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.alias.VerifyAliasPayload)
                                return d;
                            var m = new $root.io.token.proto.common.alias.VerifyAliasPayload();
                            if (d.memberId != null) {
                                m.memberId = String(d.memberId);
                            }
                            if (d.alias != null) {
                                if (typeof d.alias !== "object")
                                    throw TypeError(".io.token.proto.common.alias.VerifyAliasPayload.alias: object expected");
                                m.alias = $root.io.token.proto.common.alias.Alias.fromObject(d.alias);
                            }
                            return m;
                        };

                        VerifyAliasPayload.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.memberId = "";
                                d.alias = null;
                            }
                            if (m.memberId != null && m.hasOwnProperty("memberId")) {
                                d.memberId = m.memberId;
                            }
                            if (m.alias != null && m.hasOwnProperty("alias")) {
                                d.alias = $root.io.token.proto.common.alias.Alias.toObject(m.alias, o);
                            }
                            return d;
                        };

                        VerifyAliasPayload.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
                        Bank.prototype.requiresLegacyTransfer = false;
                        Bank.prototype.provider = "";
                        Bank.prototype.country = "";
                        Bank.prototype.identifier = "";

                        Bank.create = function create(properties) {
                            return new Bank(properties);
                        };

                        Bank.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.bank.Bank)
                                return d;
                            var m = new $root.io.token.proto.common.bank.Bank();
                            if (d.id != null) {
                                m.id = String(d.id);
                            }
                            if (d.name != null) {
                                m.name = String(d.name);
                            }
                            if (d.logoUri != null) {
                                m.logoUri = String(d.logoUri);
                            }
                            if (d.fullLogoUri != null) {
                                m.fullLogoUri = String(d.fullLogoUri);
                            }
                            if (d.supportsAppless != null) {
                                m.supportsAppless = Boolean(d.supportsAppless);
                            }
                            if (d.supportsInformation != null) {
                                m.supportsInformation = Boolean(d.supportsInformation);
                            }
                            if (d.requiresExternalAuth != null) {
                                m.requiresExternalAuth = Boolean(d.requiresExternalAuth);
                            }
                            if (d.supportsSendPayment != null) {
                                m.supportsSendPayment = Boolean(d.supportsSendPayment);
                            }
                            if (d.supportsReceivePayment != null) {
                                m.supportsReceivePayment = Boolean(d.supportsReceivePayment);
                            }
                            if (d.requiresLegacyTransfer != null) {
                                m.requiresLegacyTransfer = Boolean(d.requiresLegacyTransfer);
                            }
                            if (d.provider != null) {
                                m.provider = String(d.provider);
                            }
                            if (d.country != null) {
                                m.country = String(d.country);
                            }
                            if (d.identifier != null) {
                                m.identifier = String(d.identifier);
                            }
                            return m;
                        };

                        Bank.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.id = "";
                                d.name = "";
                                d.logoUri = "";
                                d.fullLogoUri = "";
                                d.supportsAppless = false;
                                d.supportsInformation = false;
                                d.requiresExternalAuth = false;
                                d.supportsSendPayment = false;
                                d.supportsReceivePayment = false;
                                d.provider = "";
                                d.country = "";
                                d.identifier = "";
                                d.requiresLegacyTransfer = false;
                            }
                            if (m.id != null && m.hasOwnProperty("id")) {
                                d.id = m.id;
                            }
                            if (m.name != null && m.hasOwnProperty("name")) {
                                d.name = m.name;
                            }
                            if (m.logoUri != null && m.hasOwnProperty("logoUri")) {
                                d.logoUri = m.logoUri;
                            }
                            if (m.fullLogoUri != null && m.hasOwnProperty("fullLogoUri")) {
                                d.fullLogoUri = m.fullLogoUri;
                            }
                            if (m.supportsAppless != null && m.hasOwnProperty("supportsAppless")) {
                                d.supportsAppless = m.supportsAppless;
                            }
                            if (m.supportsInformation != null && m.hasOwnProperty("supportsInformation")) {
                                d.supportsInformation = m.supportsInformation;
                            }
                            if (m.requiresExternalAuth != null && m.hasOwnProperty("requiresExternalAuth")) {
                                d.requiresExternalAuth = m.requiresExternalAuth;
                            }
                            if (m.supportsSendPayment != null && m.hasOwnProperty("supportsSendPayment")) {
                                d.supportsSendPayment = m.supportsSendPayment;
                            }
                            if (m.supportsReceivePayment != null && m.hasOwnProperty("supportsReceivePayment")) {
                                d.supportsReceivePayment = m.supportsReceivePayment;
                            }
                            if (m.provider != null && m.hasOwnProperty("provider")) {
                                d.provider = m.provider;
                            }
                            if (m.country != null && m.hasOwnProperty("country")) {
                                d.country = m.country;
                            }
                            if (m.identifier != null && m.hasOwnProperty("identifier")) {
                                d.identifier = m.identifier;
                            }
                            if (m.requiresLegacyTransfer != null && m.hasOwnProperty("requiresLegacyTransfer")) {
                                d.requiresLegacyTransfer = m.requiresLegacyTransfer;
                            }
                            return d;
                        };

                        Bank.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        BankInfo.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.bank.BankInfo)
                                return d;
                            var m = new $root.io.token.proto.common.bank.BankInfo();
                            if (d.linkingUri != null) {
                                m.linkingUri = String(d.linkingUri);
                            }
                            if (d.redirectUriRegex != null) {
                                m.redirectUriRegex = String(d.redirectUriRegex);
                            }
                            if (d.bankLinkingUri != null) {
                                m.bankLinkingUri = String(d.bankLinkingUri);
                            }
                            if (d.realm) {
                                if (!Array.isArray(d.realm))
                                    throw TypeError(".io.token.proto.common.bank.BankInfo.realm: array expected");
                                m.realm = [];
                                for (var i = 0; i < d.realm.length; ++i) {
                                    m.realm[i] = String(d.realm[i]);
                                }
                            }
                            return m;
                        };

                        BankInfo.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.arrays || o.defaults) {
                                d.realm = [];
                            }
                            if (o.defaults) {
                                d.linkingUri = "";
                                d.redirectUriRegex = "";
                                d.bankLinkingUri = "";
                            }
                            if (m.linkingUri != null && m.hasOwnProperty("linkingUri")) {
                                d.linkingUri = m.linkingUri;
                            }
                            if (m.redirectUriRegex != null && m.hasOwnProperty("redirectUriRegex")) {
                                d.redirectUriRegex = m.redirectUriRegex;
                            }
                            if (m.bankLinkingUri != null && m.hasOwnProperty("bankLinkingUri")) {
                                d.bankLinkingUri = m.bankLinkingUri;
                            }
                            if (m.realm && m.realm.length) {
                                d.realm = [];
                                for (var j = 0; j < m.realm.length; ++j) {
                                    d.realm[j] = m.realm[j];
                                }
                            }
                            return d;
                        };

                        BankInfo.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        Paging.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.bank.Paging)
                                return d;
                            var m = new $root.io.token.proto.common.bank.Paging();
                            if (d.page != null) {
                                m.page = d.page | 0;
                            }
                            if (d.perPage != null) {
                                m.perPage = d.perPage | 0;
                            }
                            if (d.pageCount != null) {
                                m.pageCount = d.pageCount | 0;
                            }
                            if (d.totalCount != null) {
                                m.totalCount = d.totalCount | 0;
                            }
                            return m;
                        };

                        Paging.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.page = 0;
                                d.perPage = 0;
                                d.pageCount = 0;
                                d.totalCount = 0;
                            }
                            if (m.page != null && m.hasOwnProperty("page")) {
                                d.page = m.page;
                            }
                            if (m.perPage != null && m.hasOwnProperty("perPage")) {
                                d.perPage = m.perPage;
                            }
                            if (m.pageCount != null && m.hasOwnProperty("pageCount")) {
                                d.pageCount = m.pageCount;
                            }
                            if (m.totalCount != null && m.hasOwnProperty("totalCount")) {
                                d.totalCount = m.totalCount;
                            }
                            return d;
                        };

                        Paging.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        Blob.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.blob.Blob)
                                return d;
                            var m = new $root.io.token.proto.common.blob.Blob();
                            if (d.id != null) {
                                m.id = String(d.id);
                            }
                            if (d.payload != null) {
                                if (typeof d.payload !== "object")
                                    throw TypeError(".io.token.proto.common.blob.Blob.payload: object expected");
                                m.payload = $root.io.token.proto.common.blob.Blob.Payload.fromObject(d.payload);
                            }
                            return m;
                        };

                        Blob.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.id = "";
                                d.payload = null;
                            }
                            if (m.id != null && m.hasOwnProperty("id")) {
                                d.id = m.id;
                            }
                            if (m.payload != null && m.hasOwnProperty("payload")) {
                                d.payload = $root.io.token.proto.common.blob.Blob.Payload.toObject(m.payload, o);
                            }
                            return d;
                        };

                        Blob.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            Payload.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.blob.Blob.Payload)
                                    return d;
                                var m = new $root.io.token.proto.common.blob.Blob.Payload();
                                if (d.ownerId != null) {
                                    m.ownerId = String(d.ownerId);
                                }
                                if (d.type != null) {
                                    m.type = String(d.type);
                                }
                                if (d.name != null) {
                                    m.name = String(d.name);
                                }
                                if (d.data != null) {
                                    if (typeof d.data === "string")
                                        $util.base64.decode(d.data, m.data = $util.newBuffer($util.base64.length(d.data)), 0);
                                    else if (d.data.length)
                                        m.data = d.data;
                                }
                                switch (d.accessMode) {
                                case "DEFAULT":
                                case 0:
                                    m.accessMode = 0;
                                    break;
                                case "PUBLIC":
                                case 1:
                                    m.accessMode = 1;
                                    break;
                                }
                                return m;
                            };

                            Payload.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (o.defaults) {
                                    d.ownerId = "";
                                    d.type = "";
                                    d.name = "";
                                    if (o.bytes === String)
                                        d.data = "";
                                    else {
                                        d.data = [];
                                        if (o.bytes !== Array)
                                            d.data = $util.newBuffer(d.data);
                                    }
                                    d.accessMode = o.enums === String ? "DEFAULT" : 0;
                                }
                                if (m.ownerId != null && m.hasOwnProperty("ownerId")) {
                                    d.ownerId = m.ownerId;
                                }
                                if (m.type != null && m.hasOwnProperty("type")) {
                                    d.type = m.type;
                                }
                                if (m.name != null && m.hasOwnProperty("name")) {
                                    d.name = m.name;
                                }
                                if (m.data != null && m.hasOwnProperty("data")) {
                                    d.data = o.bytes === String ? $util.base64.encode(m.data, 0, m.data.length) : o.bytes === Array ? Array.prototype.slice.call(m.data) : m.data;
                                }
                                if (m.accessMode != null && m.hasOwnProperty("accessMode")) {
                                    d.accessMode = o.enums === String ? $root.io.token.proto.common.blob.Blob.AccessMode[m.accessMode] : m.accessMode;
                                }
                                return d;
                            };

                            Payload.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        Attachment.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.blob.Attachment)
                                return d;
                            var m = new $root.io.token.proto.common.blob.Attachment();
                            if (d.blobId != null) {
                                m.blobId = String(d.blobId);
                            }
                            if (d.type != null) {
                                m.type = String(d.type);
                            }
                            if (d.name != null) {
                                m.name = String(d.name);
                            }
                            return m;
                        };

                        Attachment.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.blobId = "";
                                d.type = "";
                                d.name = "";
                            }
                            if (m.blobId != null && m.hasOwnProperty("blobId")) {
                                d.blobId = m.blobId;
                            }
                            if (m.type != null && m.hasOwnProperty("type")) {
                                d.type = m.type;
                            }
                            if (m.name != null && m.hasOwnProperty("name")) {
                                d.name = m.name;
                            }
                            return d;
                        };

                        Attachment.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        MemberAddKeyOperation.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.member.MemberAddKeyOperation)
                                return d;
                            var m = new $root.io.token.proto.common.member.MemberAddKeyOperation();
                            if (d.key != null) {
                                if (typeof d.key !== "object")
                                    throw TypeError(".io.token.proto.common.member.MemberAddKeyOperation.key: object expected");
                                m.key = $root.io.token.proto.common.security.Key.fromObject(d.key);
                            }
                            return m;
                        };

                        MemberAddKeyOperation.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.key = null;
                            }
                            if (m.key != null && m.hasOwnProperty("key")) {
                                d.key = $root.io.token.proto.common.security.Key.toObject(m.key, o);
                            }
                            return d;
                        };

                        MemberAddKeyOperation.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        MemberRemoveKeyOperation.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.member.MemberRemoveKeyOperation)
                                return d;
                            var m = new $root.io.token.proto.common.member.MemberRemoveKeyOperation();
                            if (d.keyId != null) {
                                m.keyId = String(d.keyId);
                            }
                            return m;
                        };

                        MemberRemoveKeyOperation.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.keyId = "";
                            }
                            if (m.keyId != null && m.hasOwnProperty("keyId")) {
                                d.keyId = m.keyId;
                            }
                            return d;
                        };

                        MemberRemoveKeyOperation.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        MemberAliasOperation.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.member.MemberAliasOperation)
                                return d;
                            var m = new $root.io.token.proto.common.member.MemberAliasOperation();
                            if (d.aliasHash != null) {
                                m.aliasHash = String(d.aliasHash);
                            }
                            if (d.realm != null) {
                                m.realm = String(d.realm);
                            }
                            return m;
                        };

                        MemberAliasOperation.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.aliasHash = "";
                                d.realm = "";
                            }
                            if (m.aliasHash != null && m.hasOwnProperty("aliasHash")) {
                                d.aliasHash = m.aliasHash;
                            }
                            if (m.realm != null && m.hasOwnProperty("realm")) {
                                d.realm = m.realm;
                            }
                            return d;
                        };

                        MemberAliasOperation.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        MemberRecoveryRulesOperation.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.member.MemberRecoveryRulesOperation)
                                return d;
                            var m = new $root.io.token.proto.common.member.MemberRecoveryRulesOperation();
                            if (d.recoveryRule != null) {
                                if (typeof d.recoveryRule !== "object")
                                    throw TypeError(".io.token.proto.common.member.MemberRecoveryRulesOperation.recoveryRule: object expected");
                                m.recoveryRule = $root.io.token.proto.common.member.RecoveryRule.fromObject(d.recoveryRule);
                            }
                            return m;
                        };

                        MemberRecoveryRulesOperation.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.recoveryRule = null;
                            }
                            if (m.recoveryRule != null && m.hasOwnProperty("recoveryRule")) {
                                d.recoveryRule = $root.io.token.proto.common.member.RecoveryRule.toObject(m.recoveryRule, o);
                            }
                            return d;
                        };

                        MemberRecoveryRulesOperation.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        MemberRecoveryOperation.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.member.MemberRecoveryOperation)
                                return d;
                            var m = new $root.io.token.proto.common.member.MemberRecoveryOperation();
                            if (d.authorization != null) {
                                if (typeof d.authorization !== "object")
                                    throw TypeError(".io.token.proto.common.member.MemberRecoveryOperation.authorization: object expected");
                                m.authorization = $root.io.token.proto.common.member.MemberRecoveryOperation.Authorization.fromObject(d.authorization);
                            }
                            if (d.agentSignature != null) {
                                if (typeof d.agentSignature !== "object")
                                    throw TypeError(".io.token.proto.common.member.MemberRecoveryOperation.agentSignature: object expected");
                                m.agentSignature = $root.io.token.proto.common.security.Signature.fromObject(d.agentSignature);
                            }
                            return m;
                        };

                        MemberRecoveryOperation.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.authorization = null;
                                d.agentSignature = null;
                            }
                            if (m.authorization != null && m.hasOwnProperty("authorization")) {
                                d.authorization = $root.io.token.proto.common.member.MemberRecoveryOperation.Authorization.toObject(m.authorization, o);
                            }
                            if (m.agentSignature != null && m.hasOwnProperty("agentSignature")) {
                                d.agentSignature = $root.io.token.proto.common.security.Signature.toObject(m.agentSignature, o);
                            }
                            return d;
                        };

                        MemberRecoveryOperation.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            Authorization.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.member.MemberRecoveryOperation.Authorization)
                                    return d;
                                var m = new $root.io.token.proto.common.member.MemberRecoveryOperation.Authorization();
                                if (d.memberId != null) {
                                    m.memberId = String(d.memberId);
                                }
                                if (d.prevHash != null) {
                                    m.prevHash = String(d.prevHash);
                                }
                                if (d.memberKey != null) {
                                    if (typeof d.memberKey !== "object")
                                        throw TypeError(".io.token.proto.common.member.MemberRecoveryOperation.Authorization.memberKey: object expected");
                                    m.memberKey = $root.io.token.proto.common.security.Key.fromObject(d.memberKey);
                                }
                                return m;
                            };

                            Authorization.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (o.defaults) {
                                    d.memberId = "";
                                    d.prevHash = "";
                                    d.memberKey = null;
                                }
                                if (m.memberId != null && m.hasOwnProperty("memberId")) {
                                    d.memberId = m.memberId;
                                }
                                if (m.prevHash != null && m.hasOwnProperty("prevHash")) {
                                    d.prevHash = m.prevHash;
                                }
                                if (m.memberKey != null && m.hasOwnProperty("memberKey")) {
                                    d.memberKey = $root.io.token.proto.common.security.Key.toObject(m.memberKey, o);
                                }
                                return d;
                            };

                            Authorization.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        MemberDeleteOperation.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.member.MemberDeleteOperation)
                                return d;
                            return new $root.io.token.proto.common.member.MemberDeleteOperation();
                        };

                        MemberDeleteOperation.toObject = function toObject() {
                            return {};
                        };

                        MemberDeleteOperation.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        MemberOperation.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.member.MemberOperation)
                                return d;
                            var m = new $root.io.token.proto.common.member.MemberOperation();
                            if (d.addKey != null) {
                                if (typeof d.addKey !== "object")
                                    throw TypeError(".io.token.proto.common.member.MemberOperation.addKey: object expected");
                                m.addKey = $root.io.token.proto.common.member.MemberAddKeyOperation.fromObject(d.addKey);
                            }
                            if (d.removeKey != null) {
                                if (typeof d.removeKey !== "object")
                                    throw TypeError(".io.token.proto.common.member.MemberOperation.removeKey: object expected");
                                m.removeKey = $root.io.token.proto.common.member.MemberRemoveKeyOperation.fromObject(d.removeKey);
                            }
                            if (d.removeAlias != null) {
                                if (typeof d.removeAlias !== "object")
                                    throw TypeError(".io.token.proto.common.member.MemberOperation.removeAlias: object expected");
                                m.removeAlias = $root.io.token.proto.common.member.MemberAliasOperation.fromObject(d.removeAlias);
                            }
                            if (d.addAlias != null) {
                                if (typeof d.addAlias !== "object")
                                    throw TypeError(".io.token.proto.common.member.MemberOperation.addAlias: object expected");
                                m.addAlias = $root.io.token.proto.common.member.MemberAliasOperation.fromObject(d.addAlias);
                            }
                            if (d.verifyAlias != null) {
                                if (typeof d.verifyAlias !== "object")
                                    throw TypeError(".io.token.proto.common.member.MemberOperation.verifyAlias: object expected");
                                m.verifyAlias = $root.io.token.proto.common.member.MemberAliasOperation.fromObject(d.verifyAlias);
                            }
                            if (d.recoveryRules != null) {
                                if (typeof d.recoveryRules !== "object")
                                    throw TypeError(".io.token.proto.common.member.MemberOperation.recoveryRules: object expected");
                                m.recoveryRules = $root.io.token.proto.common.member.MemberRecoveryRulesOperation.fromObject(d.recoveryRules);
                            }
                            if (d.recover != null) {
                                if (typeof d.recover !== "object")
                                    throw TypeError(".io.token.proto.common.member.MemberOperation.recover: object expected");
                                m.recover = $root.io.token.proto.common.member.MemberRecoveryOperation.fromObject(d.recover);
                            }
                            if (d["delete"] != null) {
                                if (typeof d["delete"] !== "object")
                                    throw TypeError(".io.token.proto.common.member.MemberOperation.delete: object expected");
                                m["delete"] = $root.io.token.proto.common.member.MemberDeleteOperation.fromObject(d["delete"]);
                            }
                            return m;
                        };

                        MemberOperation.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (m.addKey != null && m.hasOwnProperty("addKey")) {
                                d.addKey = $root.io.token.proto.common.member.MemberAddKeyOperation.toObject(m.addKey, o);
                                if (o.oneofs)
                                    d.operation = "addKey";
                            }
                            if (m.removeKey != null && m.hasOwnProperty("removeKey")) {
                                d.removeKey = $root.io.token.proto.common.member.MemberRemoveKeyOperation.toObject(m.removeKey, o);
                                if (o.oneofs)
                                    d.operation = "removeKey";
                            }
                            if (m.removeAlias != null && m.hasOwnProperty("removeAlias")) {
                                d.removeAlias = $root.io.token.proto.common.member.MemberAliasOperation.toObject(m.removeAlias, o);
                                if (o.oneofs)
                                    d.operation = "removeAlias";
                            }
                            if (m.addAlias != null && m.hasOwnProperty("addAlias")) {
                                d.addAlias = $root.io.token.proto.common.member.MemberAliasOperation.toObject(m.addAlias, o);
                                if (o.oneofs)
                                    d.operation = "addAlias";
                            }
                            if (m.verifyAlias != null && m.hasOwnProperty("verifyAlias")) {
                                d.verifyAlias = $root.io.token.proto.common.member.MemberAliasOperation.toObject(m.verifyAlias, o);
                                if (o.oneofs)
                                    d.operation = "verifyAlias";
                            }
                            if (m.recoveryRules != null && m.hasOwnProperty("recoveryRules")) {
                                d.recoveryRules = $root.io.token.proto.common.member.MemberRecoveryRulesOperation.toObject(m.recoveryRules, o);
                                if (o.oneofs)
                                    d.operation = "recoveryRules";
                            }
                            if (m.recover != null && m.hasOwnProperty("recover")) {
                                d.recover = $root.io.token.proto.common.member.MemberRecoveryOperation.toObject(m.recover, o);
                                if (o.oneofs)
                                    d.operation = "recover";
                            }
                            if (m["delete"] != null && m.hasOwnProperty("delete")) {
                                d["delete"] = $root.io.token.proto.common.member.MemberDeleteOperation.toObject(m["delete"], o);
                                if (o.oneofs)
                                    d.operation = "delete";
                            }
                            return d;
                        };

                        MemberOperation.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        MemberUpdate.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.member.MemberUpdate)
                                return d;
                            var m = new $root.io.token.proto.common.member.MemberUpdate();
                            if (d.prevHash != null) {
                                m.prevHash = String(d.prevHash);
                            }
                            if (d.memberId != null) {
                                m.memberId = String(d.memberId);
                            }
                            if (d.operations) {
                                if (!Array.isArray(d.operations))
                                    throw TypeError(".io.token.proto.common.member.MemberUpdate.operations: array expected");
                                m.operations = [];
                                for (var i = 0; i < d.operations.length; ++i) {
                                    if (typeof d.operations[i] !== "object")
                                        throw TypeError(".io.token.proto.common.member.MemberUpdate.operations: object expected");
                                    m.operations[i] = $root.io.token.proto.common.member.MemberOperation.fromObject(d.operations[i]);
                                }
                            }
                            return m;
                        };

                        MemberUpdate.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.arrays || o.defaults) {
                                d.operations = [];
                            }
                            if (o.defaults) {
                                d.prevHash = "";
                                d.memberId = "";
                            }
                            if (m.prevHash != null && m.hasOwnProperty("prevHash")) {
                                d.prevHash = m.prevHash;
                            }
                            if (m.memberId != null && m.hasOwnProperty("memberId")) {
                                d.memberId = m.memberId;
                            }
                            if (m.operations && m.operations.length) {
                                d.operations = [];
                                for (var j = 0; j < m.operations.length; ++j) {
                                    d.operations[j] = $root.io.token.proto.common.member.MemberOperation.toObject(m.operations[j], o);
                                }
                            }
                            return d;
                        };

                        MemberUpdate.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        MemberOperationMetadata.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.member.MemberOperationMetadata)
                                return d;
                            var m = new $root.io.token.proto.common.member.MemberOperationMetadata();
                            if (d.addAliasMetadata != null) {
                                if (typeof d.addAliasMetadata !== "object")
                                    throw TypeError(".io.token.proto.common.member.MemberOperationMetadata.addAliasMetadata: object expected");
                                m.addAliasMetadata = $root.io.token.proto.common.member.MemberOperationMetadata.AddAliasMetadata.fromObject(d.addAliasMetadata);
                            }
                            return m;
                        };

                        MemberOperationMetadata.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (m.addAliasMetadata != null && m.hasOwnProperty("addAliasMetadata")) {
                                d.addAliasMetadata = $root.io.token.proto.common.member.MemberOperationMetadata.AddAliasMetadata.toObject(m.addAliasMetadata, o);
                                if (o.oneofs)
                                    d.type = "addAliasMetadata";
                            }
                            return d;
                        };

                        MemberOperationMetadata.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            AddAliasMetadata.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.member.MemberOperationMetadata.AddAliasMetadata)
                                    return d;
                                var m = new $root.io.token.proto.common.member.MemberOperationMetadata.AddAliasMetadata();
                                if (d.aliasHash != null) {
                                    m.aliasHash = String(d.aliasHash);
                                }
                                if (d.alias != null) {
                                    if (typeof d.alias !== "object")
                                        throw TypeError(".io.token.proto.common.member.MemberOperationMetadata.AddAliasMetadata.alias: object expected");
                                    m.alias = $root.io.token.proto.common.alias.Alias.fromObject(d.alias);
                                }
                                return m;
                            };

                            AddAliasMetadata.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (o.defaults) {
                                    d.aliasHash = "";
                                    d.alias = null;
                                }
                                if (m.aliasHash != null && m.hasOwnProperty("aliasHash")) {
                                    d.aliasHash = m.aliasHash;
                                }
                                if (m.alias != null && m.hasOwnProperty("alias")) {
                                    d.alias = $root.io.token.proto.common.alias.Alias.toObject(m.alias, o);
                                }
                                return d;
                            };

                            AddAliasMetadata.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        MemberOperationResponseMetadata.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.member.MemberOperationResponseMetadata)
                                return d;
                            var m = new $root.io.token.proto.common.member.MemberOperationResponseMetadata();
                            if (d.addAliasResponseMetadata != null) {
                                if (typeof d.addAliasResponseMetadata !== "object")
                                    throw TypeError(".io.token.proto.common.member.MemberOperationResponseMetadata.addAliasResponseMetadata: object expected");
                                m.addAliasResponseMetadata = $root.io.token.proto.common.member.MemberOperationResponseMetadata.AddAliasResponseMetadata.fromObject(d.addAliasResponseMetadata);
                            }
                            return m;
                        };

                        MemberOperationResponseMetadata.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (m.addAliasResponseMetadata != null && m.hasOwnProperty("addAliasResponseMetadata")) {
                                d.addAliasResponseMetadata = $root.io.token.proto.common.member.MemberOperationResponseMetadata.AddAliasResponseMetadata.toObject(m.addAliasResponseMetadata, o);
                                if (o.oneofs)
                                    d.type = "addAliasResponseMetadata";
                            }
                            return d;
                        };

                        MemberOperationResponseMetadata.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            AddAliasResponseMetadata.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.member.MemberOperationResponseMetadata.AddAliasResponseMetadata)
                                    return d;
                                var m = new $root.io.token.proto.common.member.MemberOperationResponseMetadata.AddAliasResponseMetadata();
                                if (d.aliasHash != null) {
                                    m.aliasHash = String(d.aliasHash);
                                }
                                if (d.verificationId != null) {
                                    m.verificationId = String(d.verificationId);
                                }
                                return m;
                            };

                            AddAliasResponseMetadata.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (o.defaults) {
                                    d.aliasHash = "";
                                    d.verificationId = "";
                                }
                                if (m.aliasHash != null && m.hasOwnProperty("aliasHash")) {
                                    d.aliasHash = m.aliasHash;
                                }
                                if (m.verificationId != null && m.hasOwnProperty("verificationId")) {
                                    d.verificationId = m.verificationId;
                                }
                                return d;
                            };

                            AddAliasResponseMetadata.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        RecoveryRule.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.member.RecoveryRule)
                                return d;
                            var m = new $root.io.token.proto.common.member.RecoveryRule();
                            if (d.primaryAgent != null) {
                                m.primaryAgent = String(d.primaryAgent);
                            }
                            if (d.secondaryAgents) {
                                if (!Array.isArray(d.secondaryAgents))
                                    throw TypeError(".io.token.proto.common.member.RecoveryRule.secondaryAgents: array expected");
                                m.secondaryAgents = [];
                                for (var i = 0; i < d.secondaryAgents.length; ++i) {
                                    m.secondaryAgents[i] = String(d.secondaryAgents[i]);
                                }
                            }
                            return m;
                        };

                        RecoveryRule.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.arrays || o.defaults) {
                                d.secondaryAgents = [];
                            }
                            if (o.defaults) {
                                d.primaryAgent = "";
                            }
                            if (m.primaryAgent != null && m.hasOwnProperty("primaryAgent")) {
                                d.primaryAgent = m.primaryAgent;
                            }
                            if (m.secondaryAgents && m.secondaryAgents.length) {
                                d.secondaryAgents = [];
                                for (var j = 0; j < m.secondaryAgents.length; ++j) {
                                    d.secondaryAgents[j] = m.secondaryAgents[j];
                                }
                            }
                            return d;
                        };

                        RecoveryRule.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        Member.create = function create(properties) {
                            return new Member(properties);
                        };

                        Member.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.member.Member)
                                return d;
                            var m = new $root.io.token.proto.common.member.Member();
                            if (d.id != null) {
                                m.id = String(d.id);
                            }
                            if (d.lastHash != null) {
                                m.lastHash = String(d.lastHash);
                            }
                            if (d.aliasHashes) {
                                if (!Array.isArray(d.aliasHashes))
                                    throw TypeError(".io.token.proto.common.member.Member.aliasHashes: array expected");
                                m.aliasHashes = [];
                                for (var i = 0; i < d.aliasHashes.length; ++i) {
                                    m.aliasHashes[i] = String(d.aliasHashes[i]);
                                }
                            }
                            if (d.keys) {
                                if (!Array.isArray(d.keys))
                                    throw TypeError(".io.token.proto.common.member.Member.keys: array expected");
                                m.keys = [];
                                for (var i = 0; i < d.keys.length; ++i) {
                                    if (typeof d.keys[i] !== "object")
                                        throw TypeError(".io.token.proto.common.member.Member.keys: object expected");
                                    m.keys[i] = $root.io.token.proto.common.security.Key.fromObject(d.keys[i]);
                                }
                            }
                            if (d.unverifiedAliasHashes) {
                                if (!Array.isArray(d.unverifiedAliasHashes))
                                    throw TypeError(".io.token.proto.common.member.Member.unverifiedAliasHashes: array expected");
                                m.unverifiedAliasHashes = [];
                                for (var i = 0; i < d.unverifiedAliasHashes.length; ++i) {
                                    m.unverifiedAliasHashes[i] = String(d.unverifiedAliasHashes[i]);
                                }
                            }
                            if (d.recoveryRule != null) {
                                if (typeof d.recoveryRule !== "object")
                                    throw TypeError(".io.token.proto.common.member.Member.recoveryRule: object expected");
                                m.recoveryRule = $root.io.token.proto.common.member.RecoveryRule.fromObject(d.recoveryRule);
                            }
                            if (d.lastRecoverySequence != null) {
                                m.lastRecoverySequence = d.lastRecoverySequence | 0;
                            }
                            if (d.lastOperationSequence != null) {
                                m.lastOperationSequence = d.lastOperationSequence | 0;
                            }
                            switch (d.type) {
                            case "INVALID_MEMBER_TYPE":
                            case 0:
                                m.type = 0;
                                break;
                            case "PERSONAL":
                            case 1:
                                m.type = 1;
                                break;
                            case "BUSINESS_UNVERIFIED":
                            case 2:
                                m.type = 2;
                                break;
                            case "BUSINESS_VERIFIED":
                            case 3:
                                m.type = 3;
                                break;
                            case "TRANSIENT":
                            case 4:
                                m.type = 4;
                                break;
                            }
                            return m;
                        };

                        Member.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.arrays || o.defaults) {
                                d.aliasHashes = [];
                                d.keys = [];
                                d.unverifiedAliasHashes = [];
                            }
                            if (o.defaults) {
                                d.id = "";
                                d.lastHash = "";
                                d.recoveryRule = null;
                                d.lastRecoverySequence = 0;
                                d.lastOperationSequence = 0;
                                d.type = o.enums === String ? "INVALID_MEMBER_TYPE" : 0;
                            }
                            if (m.id != null && m.hasOwnProperty("id")) {
                                d.id = m.id;
                            }
                            if (m.lastHash != null && m.hasOwnProperty("lastHash")) {
                                d.lastHash = m.lastHash;
                            }
                            if (m.aliasHashes && m.aliasHashes.length) {
                                d.aliasHashes = [];
                                for (var j = 0; j < m.aliasHashes.length; ++j) {
                                    d.aliasHashes[j] = m.aliasHashes[j];
                                }
                            }
                            if (m.keys && m.keys.length) {
                                d.keys = [];
                                for (var j = 0; j < m.keys.length; ++j) {
                                    d.keys[j] = $root.io.token.proto.common.security.Key.toObject(m.keys[j], o);
                                }
                            }
                            if (m.unverifiedAliasHashes && m.unverifiedAliasHashes.length) {
                                d.unverifiedAliasHashes = [];
                                for (var j = 0; j < m.unverifiedAliasHashes.length; ++j) {
                                    d.unverifiedAliasHashes[j] = m.unverifiedAliasHashes[j];
                                }
                            }
                            if (m.recoveryRule != null && m.hasOwnProperty("recoveryRule")) {
                                d.recoveryRule = $root.io.token.proto.common.member.RecoveryRule.toObject(m.recoveryRule, o);
                            }
                            if (m.lastRecoverySequence != null && m.hasOwnProperty("lastRecoverySequence")) {
                                d.lastRecoverySequence = m.lastRecoverySequence;
                            }
                            if (m.lastOperationSequence != null && m.hasOwnProperty("lastOperationSequence")) {
                                d.lastOperationSequence = m.lastOperationSequence;
                            }
                            if (m.type != null && m.hasOwnProperty("type")) {
                                d.type = o.enums === String ? $root.io.token.proto.common.member.Member.MemberType[m.type] : m.type;
                            }
                            return d;
                        };

                        Member.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        AddressRecord.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.member.AddressRecord)
                                return d;
                            var m = new $root.io.token.proto.common.member.AddressRecord();
                            if (d.id != null) {
                                m.id = String(d.id);
                            }
                            if (d.name != null) {
                                m.name = String(d.name);
                            }
                            if (d.address != null) {
                                if (typeof d.address !== "object")
                                    throw TypeError(".io.token.proto.common.member.AddressRecord.address: object expected");
                                m.address = $root.io.token.proto.common.address.Address.fromObject(d.address);
                            }
                            if (d.addressSignature != null) {
                                if (typeof d.addressSignature !== "object")
                                    throw TypeError(".io.token.proto.common.member.AddressRecord.addressSignature: object expected");
                                m.addressSignature = $root.io.token.proto.common.security.Signature.fromObject(d.addressSignature);
                            }
                            return m;
                        };

                        AddressRecord.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.id = "";
                                d.name = "";
                                d.address = null;
                                d.addressSignature = null;
                            }
                            if (m.id != null && m.hasOwnProperty("id")) {
                                d.id = m.id;
                            }
                            if (m.name != null && m.hasOwnProperty("name")) {
                                d.name = m.name;
                            }
                            if (m.address != null && m.hasOwnProperty("address")) {
                                d.address = $root.io.token.proto.common.address.Address.toObject(m.address, o);
                            }
                            if (m.addressSignature != null && m.hasOwnProperty("addressSignature")) {
                                d.addressSignature = $root.io.token.proto.common.security.Signature.toObject(m.addressSignature, o);
                            }
                            return d;
                        };

                        AddressRecord.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        Profile.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.member.Profile)
                                return d;
                            var m = new $root.io.token.proto.common.member.Profile();
                            if (d.displayNameFirst != null) {
                                m.displayNameFirst = String(d.displayNameFirst);
                            }
                            if (d.displayNameLast != null) {
                                m.displayNameLast = String(d.displayNameLast);
                            }
                            if (d.originalPictureId != null) {
                                m.originalPictureId = String(d.originalPictureId);
                            }
                            if (d.smallPictureId != null) {
                                m.smallPictureId = String(d.smallPictureId);
                            }
                            if (d.mediumPictureId != null) {
                                m.mediumPictureId = String(d.mediumPictureId);
                            }
                            if (d.largePictureId != null) {
                                m.largePictureId = String(d.largePictureId);
                            }
                            return m;
                        };

                        Profile.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.displayNameFirst = "";
                                d.displayNameLast = "";
                                d.originalPictureId = "";
                                d.smallPictureId = "";
                                d.mediumPictureId = "";
                                d.largePictureId = "";
                            }
                            if (m.displayNameFirst != null && m.hasOwnProperty("displayNameFirst")) {
                                d.displayNameFirst = m.displayNameFirst;
                            }
                            if (m.displayNameLast != null && m.hasOwnProperty("displayNameLast")) {
                                d.displayNameLast = m.displayNameLast;
                            }
                            if (m.originalPictureId != null && m.hasOwnProperty("originalPictureId")) {
                                d.originalPictureId = m.originalPictureId;
                            }
                            if (m.smallPictureId != null && m.hasOwnProperty("smallPictureId")) {
                                d.smallPictureId = m.smallPictureId;
                            }
                            if (m.mediumPictureId != null && m.hasOwnProperty("mediumPictureId")) {
                                d.mediumPictureId = m.mediumPictureId;
                            }
                            if (m.largePictureId != null && m.hasOwnProperty("largePictureId")) {
                                d.largePictureId = m.largePictureId;
                            }
                            return d;
                        };

                        Profile.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        ReceiptContact.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.member.ReceiptContact)
                                return d;
                            var m = new $root.io.token.proto.common.member.ReceiptContact();
                            if (d.value != null) {
                                m.value = String(d.value);
                            }
                            switch (d.type) {
                            case "INVALID":
                            case 0:
                                m.type = 0;
                                break;
                            case "EMAIL":
                            case 1:
                                m.type = 1;
                                break;
                            }
                            return m;
                        };

                        ReceiptContact.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.value = "";
                                d.type = o.enums === String ? "INVALID" : 0;
                            }
                            if (m.value != null && m.hasOwnProperty("value")) {
                                d.value = m.value;
                            }
                            if (m.type != null && m.hasOwnProperty("type")) {
                                d.type = o.enums === String ? $root.io.token.proto.common.member.ReceiptContact.Type[m.type] : m.type;
                            }
                            return d;
                        };

                        ReceiptContact.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        Device.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.member.Device)
                                return d;
                            var m = new $root.io.token.proto.common.member.Device();
                            if (d.name != null) {
                                m.name = String(d.name);
                            }
                            if (d.key != null) {
                                if (typeof d.key !== "object")
                                    throw TypeError(".io.token.proto.common.member.Device.key: object expected");
                                m.key = $root.io.token.proto.common.security.Key.fromObject(d.key);
                            }
                            return m;
                        };

                        Device.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.name = "";
                                d.key = null;
                            }
                            if (m.name != null && m.hasOwnProperty("name")) {
                                d.name = m.name;
                            }
                            if (m.key != null && m.hasOwnProperty("key")) {
                                d.key = $root.io.token.proto.common.security.Key.toObject(m.key, o);
                            }
                            return d;
                        };

                        Device.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        Money.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.money.Money)
                                return d;
                            var m = new $root.io.token.proto.common.money.Money();
                            if (d.currency != null) {
                                m.currency = String(d.currency);
                            }
                            if (d.value != null) {
                                m.value = String(d.value);
                            }
                            return m;
                        };

                        Money.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.currency = "";
                                d.value = "";
                            }
                            if (m.currency != null && m.hasOwnProperty("currency")) {
                                d.currency = m.currency;
                            }
                            if (m.value != null && m.hasOwnProperty("value")) {
                                d.value = m.value;
                            }
                            return d;
                        };

                        Money.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        DeviceMetadata.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.DeviceMetadata)
                                return d;
                            var m = new $root.io.token.proto.common.notification.DeviceMetadata();
                            if (d.application != null) {
                                m.application = String(d.application);
                            }
                            if (d.applicationVersion != null) {
                                m.applicationVersion = String(d.applicationVersion);
                            }
                            if (d.device != null) {
                                m.device = String(d.device);
                            }
                            if (d.longitude != null) {
                                m.longitude = Number(d.longitude);
                            }
                            if (d.latitude != null) {
                                m.latitude = Number(d.latitude);
                            }
                            return m;
                        };

                        DeviceMetadata.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.application = "";
                                d.applicationVersion = "";
                                d.device = "";
                                d.longitude = 0;
                                d.latitude = 0;
                            }
                            if (m.application != null && m.hasOwnProperty("application")) {
                                d.application = m.application;
                            }
                            if (m.applicationVersion != null && m.hasOwnProperty("applicationVersion")) {
                                d.applicationVersion = m.applicationVersion;
                            }
                            if (m.device != null && m.hasOwnProperty("device")) {
                                d.device = m.device;
                            }
                            if (m.longitude != null && m.hasOwnProperty("longitude")) {
                                d.longitude = o.json && !isFinite(m.longitude) ? String(m.longitude) : m.longitude;
                            }
                            if (m.latitude != null && m.hasOwnProperty("latitude")) {
                                d.latitude = o.json && !isFinite(m.latitude) ? String(m.latitude) : m.latitude;
                            }
                            return d;
                        };

                        DeviceMetadata.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        PayerTransferProcessed.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.PayerTransferProcessed)
                                return d;
                            var m = new $root.io.token.proto.common.notification.PayerTransferProcessed();
                            if (d.transferId != null) {
                                m.transferId = String(d.transferId);
                            }
                            return m;
                        };

                        PayerTransferProcessed.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.transferId = "";
                            }
                            if (m.transferId != null && m.hasOwnProperty("transferId")) {
                                d.transferId = m.transferId;
                            }
                            return d;
                        };

                        PayerTransferProcessed.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        PayeeTransferProcessed.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.PayeeTransferProcessed)
                                return d;
                            var m = new $root.io.token.proto.common.notification.PayeeTransferProcessed();
                            if (d.transferId != null) {
                                m.transferId = String(d.transferId);
                            }
                            return m;
                        };

                        PayeeTransferProcessed.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.transferId = "";
                            }
                            if (m.transferId != null && m.hasOwnProperty("transferId")) {
                                d.transferId = m.transferId;
                            }
                            return d;
                        };

                        PayeeTransferProcessed.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        PayerTransferFailed.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.PayerTransferFailed)
                                return d;
                            var m = new $root.io.token.proto.common.notification.PayerTransferFailed();
                            if (d.transferId != null) {
                                m.transferId = String(d.transferId);
                            }
                            return m;
                        };

                        PayerTransferFailed.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.transferId = "";
                            }
                            if (m.transferId != null && m.hasOwnProperty("transferId")) {
                                d.transferId = m.transferId;
                            }
                            return d;
                        };

                        PayerTransferFailed.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        TransferProcessed.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.TransferProcessed)
                                return d;
                            var m = new $root.io.token.proto.common.notification.TransferProcessed();
                            if (d.transferId != null) {
                                m.transferId = String(d.transferId);
                            }
                            return m;
                        };

                        TransferProcessed.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.transferId = "";
                            }
                            if (m.transferId != null && m.hasOwnProperty("transferId")) {
                                d.transferId = m.transferId;
                            }
                            return d;
                        };

                        TransferProcessed.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        TransferFailed.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.TransferFailed)
                                return d;
                            var m = new $root.io.token.proto.common.notification.TransferFailed();
                            if (d.transferId != null) {
                                m.transferId = String(d.transferId);
                            }
                            return m;
                        };

                        TransferFailed.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.transferId = "";
                            }
                            if (m.transferId != null && m.hasOwnProperty("transferId")) {
                                d.transferId = m.transferId;
                            }
                            return d;
                        };

                        TransferFailed.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        LinkAccounts.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.LinkAccounts)
                                return d;
                            var m = new $root.io.token.proto.common.notification.LinkAccounts();
                            if (d.bankAuthorization != null) {
                                if (typeof d.bankAuthorization !== "object")
                                    throw TypeError(".io.token.proto.common.notification.LinkAccounts.bankAuthorization: object expected");
                                m.bankAuthorization = $root.io.token.proto.banklink.BankAuthorization.fromObject(d.bankAuthorization);
                            }
                            return m;
                        };

                        LinkAccounts.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.bankAuthorization = null;
                            }
                            if (m.bankAuthorization != null && m.hasOwnProperty("bankAuthorization")) {
                                d.bankAuthorization = $root.io.token.proto.banklink.BankAuthorization.toObject(m.bankAuthorization, o);
                            }
                            return d;
                        };

                        LinkAccounts.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        StepUp.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.StepUp)
                                return d;
                            var m = new $root.io.token.proto.common.notification.StepUp();
                            if (d.tokenId != null) {
                                m.tokenId = String(d.tokenId);
                            }
                            return m;
                        };

                        StepUp.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.tokenId = "";
                            }
                            if (m.tokenId != null && m.hasOwnProperty("tokenId")) {
                                d.tokenId = m.tokenId;
                            }
                            return d;
                        };

                        StepUp.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        BalanceStepUp.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.BalanceStepUp)
                                return d;
                            var m = new $root.io.token.proto.common.notification.BalanceStepUp();
                            if (d.accountId) {
                                if (!Array.isArray(d.accountId))
                                    throw TypeError(".io.token.proto.common.notification.BalanceStepUp.accountId: array expected");
                                m.accountId = [];
                                for (var i = 0; i < d.accountId.length; ++i) {
                                    m.accountId[i] = String(d.accountId[i]);
                                }
                            }
                            return m;
                        };

                        BalanceStepUp.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.arrays || o.defaults) {
                                d.accountId = [];
                            }
                            if (m.accountId && m.accountId.length) {
                                d.accountId = [];
                                for (var j = 0; j < m.accountId.length; ++j) {
                                    d.accountId[j] = m.accountId[j];
                                }
                            }
                            return d;
                        };

                        BalanceStepUp.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        TransactionStepUp.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.TransactionStepUp)
                                return d;
                            var m = new $root.io.token.proto.common.notification.TransactionStepUp();
                            if (d.accountId != null) {
                                m.accountId = String(d.accountId);
                            }
                            if (d.transactionId != null) {
                                m.transactionId = String(d.transactionId);
                            }
                            return m;
                        };

                        TransactionStepUp.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.accountId = "";
                                d.transactionId = "";
                            }
                            if (m.accountId != null && m.hasOwnProperty("accountId")) {
                                d.accountId = m.accountId;
                            }
                            if (m.transactionId != null && m.hasOwnProperty("transactionId")) {
                                d.transactionId = m.transactionId;
                            }
                            return d;
                        };

                        TransactionStepUp.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        RecoveryCompleted.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.RecoveryCompleted)
                                return d;
                            return new $root.io.token.proto.common.notification.RecoveryCompleted();
                        };

                        RecoveryCompleted.toObject = function toObject() {
                            return {};
                        };

                        RecoveryCompleted.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        AddKey.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.AddKey)
                                return d;
                            var m = new $root.io.token.proto.common.notification.AddKey();
                            if (d.name != null) {
                                m.name = String(d.name);
                            }
                            if (d.key != null) {
                                if (typeof d.key !== "object")
                                    throw TypeError(".io.token.proto.common.notification.AddKey.key: object expected");
                                m.key = $root.io.token.proto.common.security.Key.fromObject(d.key);
                            }
                            if (d.expiresMs != null) {
                                if ($util.Long)
                                    (m.expiresMs = $util.Long.fromValue(d.expiresMs)).unsigned = false;
                                else if (typeof d.expiresMs === "string")
                                    m.expiresMs = parseInt(d.expiresMs, 10);
                                else if (typeof d.expiresMs === "number")
                                    m.expiresMs = d.expiresMs;
                                else if (typeof d.expiresMs === "object")
                                    m.expiresMs = new $util.LongBits(d.expiresMs.low >>> 0, d.expiresMs.high >>> 0).toNumber();
                            }
                            if (d.keys) {
                                if (!Array.isArray(d.keys))
                                    throw TypeError(".io.token.proto.common.notification.AddKey.keys: array expected");
                                m.keys = [];
                                for (var i = 0; i < d.keys.length; ++i) {
                                    if (typeof d.keys[i] !== "object")
                                        throw TypeError(".io.token.proto.common.notification.AddKey.keys: object expected");
                                    m.keys[i] = $root.io.token.proto.common.security.Key.fromObject(d.keys[i]);
                                }
                            }
                            if (d.deviceMetadata != null) {
                                if (typeof d.deviceMetadata !== "object")
                                    throw TypeError(".io.token.proto.common.notification.AddKey.deviceMetadata: object expected");
                                m.deviceMetadata = $root.io.token.proto.common.notification.DeviceMetadata.fromObject(d.deviceMetadata);
                            }
                            return m;
                        };

                        AddKey.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.arrays || o.defaults) {
                                d.keys = [];
                            }
                            if (o.defaults) {
                                d.name = "";
                                d.key = null;
                                if ($util.Long) {
                                    var n = new $util.Long(0, 0, false);
                                    d.expiresMs = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                } else
                                    d.expiresMs = o.longs === String ? "0" : 0;
                                d.deviceMetadata = null;
                            }
                            if (m.name != null && m.hasOwnProperty("name")) {
                                d.name = m.name;
                            }
                            if (m.key != null && m.hasOwnProperty("key")) {
                                d.key = $root.io.token.proto.common.security.Key.toObject(m.key, o);
                            }
                            if (m.expiresMs != null && m.hasOwnProperty("expiresMs")) {
                                if (typeof m.expiresMs === "number")
                                    d.expiresMs = o.longs === String ? String(m.expiresMs) : m.expiresMs;
                                else
                                    d.expiresMs = o.longs === String ? $util.Long.prototype.toString.call(m.expiresMs) : o.longs === Number ? new $util.LongBits(m.expiresMs.low >>> 0, m.expiresMs.high >>> 0).toNumber() : m.expiresMs;
                            }
                            if (m.keys && m.keys.length) {
                                d.keys = [];
                                for (var j = 0; j < m.keys.length; ++j) {
                                    d.keys[j] = $root.io.token.proto.common.security.Key.toObject(m.keys[j], o);
                                }
                            }
                            if (m.deviceMetadata != null && m.hasOwnProperty("deviceMetadata")) {
                                d.deviceMetadata = $root.io.token.proto.common.notification.DeviceMetadata.toObject(m.deviceMetadata, o);
                            }
                            return d;
                        };

                        AddKey.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        LinkAccountsAndAddKey.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.LinkAccountsAndAddKey)
                                return d;
                            var m = new $root.io.token.proto.common.notification.LinkAccountsAndAddKey();
                            if (d.linkAccounts != null) {
                                if (typeof d.linkAccounts !== "object")
                                    throw TypeError(".io.token.proto.common.notification.LinkAccountsAndAddKey.linkAccounts: object expected");
                                m.linkAccounts = $root.io.token.proto.common.notification.LinkAccounts.fromObject(d.linkAccounts);
                            }
                            if (d.addKey != null) {
                                if (typeof d.addKey !== "object")
                                    throw TypeError(".io.token.proto.common.notification.LinkAccountsAndAddKey.addKey: object expected");
                                m.addKey = $root.io.token.proto.common.notification.AddKey.fromObject(d.addKey);
                            }
                            return m;
                        };

                        LinkAccountsAndAddKey.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.linkAccounts = null;
                                d.addKey = null;
                            }
                            if (m.linkAccounts != null && m.hasOwnProperty("linkAccounts")) {
                                d.linkAccounts = $root.io.token.proto.common.notification.LinkAccounts.toObject(m.linkAccounts, o);
                            }
                            if (m.addKey != null && m.hasOwnProperty("addKey")) {
                                d.addKey = $root.io.token.proto.common.notification.AddKey.toObject(m.addKey, o);
                            }
                            return d;
                        };

                        LinkAccountsAndAddKey.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        PaymentRequest.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.PaymentRequest)
                                return d;
                            var m = new $root.io.token.proto.common.notification.PaymentRequest();
                            if (d.payload != null) {
                                if (typeof d.payload !== "object")
                                    throw TypeError(".io.token.proto.common.notification.PaymentRequest.payload: object expected");
                                m.payload = $root.io.token.proto.common.token.TokenPayload.fromObject(d.payload);
                            }
                            return m;
                        };

                        PaymentRequest.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.payload = null;
                            }
                            if (m.payload != null && m.hasOwnProperty("payload")) {
                                d.payload = $root.io.token.proto.common.token.TokenPayload.toObject(m.payload, o);
                            }
                            return d;
                        };

                        PaymentRequest.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        TokenCancelled.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.TokenCancelled)
                                return d;
                            var m = new $root.io.token.proto.common.notification.TokenCancelled();
                            if (d.tokenId != null) {
                                m.tokenId = String(d.tokenId);
                            }
                            return m;
                        };

                        TokenCancelled.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.tokenId = "";
                            }
                            if (m.tokenId != null && m.hasOwnProperty("tokenId")) {
                                d.tokenId = m.tokenId;
                            }
                            return d;
                        };

                        TokenCancelled.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return TokenCancelled;
                    })();

                    notification.EndorseAndAddKey = (function() {

                        function EndorseAndAddKey(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        EndorseAndAddKey.prototype.payload = null;
                        EndorseAndAddKey.prototype.addKey = null;
                        EndorseAndAddKey.prototype.tokenRequestId = "";
                        EndorseAndAddKey.prototype.bankId = "";
                        EndorseAndAddKey.prototype.state = "";

                        EndorseAndAddKey.create = function create(properties) {
                            return new EndorseAndAddKey(properties);
                        };

                        EndorseAndAddKey.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.EndorseAndAddKey)
                                return d;
                            var m = new $root.io.token.proto.common.notification.EndorseAndAddKey();
                            if (d.payload != null) {
                                if (typeof d.payload !== "object")
                                    throw TypeError(".io.token.proto.common.notification.EndorseAndAddKey.payload: object expected");
                                m.payload = $root.io.token.proto.common.token.TokenPayload.fromObject(d.payload);
                            }
                            if (d.addKey != null) {
                                if (typeof d.addKey !== "object")
                                    throw TypeError(".io.token.proto.common.notification.EndorseAndAddKey.addKey: object expected");
                                m.addKey = $root.io.token.proto.common.notification.AddKey.fromObject(d.addKey);
                            }
                            if (d.tokenRequestId != null) {
                                m.tokenRequestId = String(d.tokenRequestId);
                            }
                            if (d.bankId != null) {
                                m.bankId = String(d.bankId);
                            }
                            if (d.state != null) {
                                m.state = String(d.state);
                            }
                            return m;
                        };

                        EndorseAndAddKey.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.payload = null;
                                d.addKey = null;
                                d.tokenRequestId = "";
                                d.bankId = "";
                                d.state = "";
                            }
                            if (m.payload != null && m.hasOwnProperty("payload")) {
                                d.payload = $root.io.token.proto.common.token.TokenPayload.toObject(m.payload, o);
                            }
                            if (m.addKey != null && m.hasOwnProperty("addKey")) {
                                d.addKey = $root.io.token.proto.common.notification.AddKey.toObject(m.addKey, o);
                            }
                            if (m.tokenRequestId != null && m.hasOwnProperty("tokenRequestId")) {
                                d.tokenRequestId = m.tokenRequestId;
                            }
                            if (m.bankId != null && m.hasOwnProperty("bankId")) {
                                d.bankId = m.bankId;
                            }
                            if (m.state != null && m.hasOwnProperty("state")) {
                                d.state = m.state;
                            }
                            return d;
                        };

                        EndorseAndAddKey.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return EndorseAndAddKey;
                    })();

                    notification.NotificationInvalidated = (function() {

                        function NotificationInvalidated(p) {
                            if (p)
                                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                                    if (p[ks[i]] != null)
                                        this[ks[i]] = p[ks[i]];
                        }

                        NotificationInvalidated.prototype.previousNotificationId = "";

                        NotificationInvalidated.create = function create(properties) {
                            return new NotificationInvalidated(properties);
                        };

                        NotificationInvalidated.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.NotificationInvalidated)
                                return d;
                            var m = new $root.io.token.proto.common.notification.NotificationInvalidated();
                            if (d.previousNotificationId != null) {
                                m.previousNotificationId = String(d.previousNotificationId);
                            }
                            return m;
                        };

                        NotificationInvalidated.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.previousNotificationId = "";
                            }
                            if (m.previousNotificationId != null && m.hasOwnProperty("previousNotificationId")) {
                                d.previousNotificationId = m.previousNotificationId;
                            }
                            return d;
                        };

                        NotificationInvalidated.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return NotificationInvalidated;
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
                        NotifyBody.prototype.endorseAndAddKey = null;
                        NotifyBody.prototype.recoveryCompleted = null;
                        NotifyBody.prototype.notificationInvalidated = null;

                        let $oneOfFields;

                        Object.defineProperty(NotifyBody.prototype, "body", {
                            get: $util.oneOfGetter($oneOfFields = ["payerTransferProcessed", "linkAccounts", "stepUp", "addKey", "linkAccountsAndAddKey", "payeeTransferProcessed", "paymentRequest", "payerTransferFailed", "transferProcessed", "transferFailed", "tokenCancelled", "balanceStepUp", "transactionStepUp", "endorseAndAddKey", "recoveryCompleted", "notificationInvalidated"]),
                            set: $util.oneOfSetter($oneOfFields)
                        });

                        NotifyBody.create = function create(properties) {
                            return new NotifyBody(properties);
                        };

                        NotifyBody.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.NotifyBody)
                                return d;
                            var m = new $root.io.token.proto.common.notification.NotifyBody();
                            if (d.payerTransferProcessed != null) {
                                if (typeof d.payerTransferProcessed !== "object")
                                    throw TypeError(".io.token.proto.common.notification.NotifyBody.payerTransferProcessed: object expected");
                                m.payerTransferProcessed = $root.io.token.proto.common.notification.PayerTransferProcessed.fromObject(d.payerTransferProcessed);
                            }
                            if (d.linkAccounts != null) {
                                if (typeof d.linkAccounts !== "object")
                                    throw TypeError(".io.token.proto.common.notification.NotifyBody.linkAccounts: object expected");
                                m.linkAccounts = $root.io.token.proto.common.notification.LinkAccounts.fromObject(d.linkAccounts);
                            }
                            if (d.stepUp != null) {
                                if (typeof d.stepUp !== "object")
                                    throw TypeError(".io.token.proto.common.notification.NotifyBody.stepUp: object expected");
                                m.stepUp = $root.io.token.proto.common.notification.StepUp.fromObject(d.stepUp);
                            }
                            if (d.addKey != null) {
                                if (typeof d.addKey !== "object")
                                    throw TypeError(".io.token.proto.common.notification.NotifyBody.addKey: object expected");
                                m.addKey = $root.io.token.proto.common.notification.AddKey.fromObject(d.addKey);
                            }
                            if (d.linkAccountsAndAddKey != null) {
                                if (typeof d.linkAccountsAndAddKey !== "object")
                                    throw TypeError(".io.token.proto.common.notification.NotifyBody.linkAccountsAndAddKey: object expected");
                                m.linkAccountsAndAddKey = $root.io.token.proto.common.notification.LinkAccountsAndAddKey.fromObject(d.linkAccountsAndAddKey);
                            }
                            if (d.payeeTransferProcessed != null) {
                                if (typeof d.payeeTransferProcessed !== "object")
                                    throw TypeError(".io.token.proto.common.notification.NotifyBody.payeeTransferProcessed: object expected");
                                m.payeeTransferProcessed = $root.io.token.proto.common.notification.PayeeTransferProcessed.fromObject(d.payeeTransferProcessed);
                            }
                            if (d.paymentRequest != null) {
                                if (typeof d.paymentRequest !== "object")
                                    throw TypeError(".io.token.proto.common.notification.NotifyBody.paymentRequest: object expected");
                                m.paymentRequest = $root.io.token.proto.common.notification.PaymentRequest.fromObject(d.paymentRequest);
                            }
                            if (d.payerTransferFailed != null) {
                                if (typeof d.payerTransferFailed !== "object")
                                    throw TypeError(".io.token.proto.common.notification.NotifyBody.payerTransferFailed: object expected");
                                m.payerTransferFailed = $root.io.token.proto.common.notification.PayerTransferFailed.fromObject(d.payerTransferFailed);
                            }
                            if (d.transferProcessed != null) {
                                if (typeof d.transferProcessed !== "object")
                                    throw TypeError(".io.token.proto.common.notification.NotifyBody.transferProcessed: object expected");
                                m.transferProcessed = $root.io.token.proto.common.notification.TransferProcessed.fromObject(d.transferProcessed);
                            }
                            if (d.transferFailed != null) {
                                if (typeof d.transferFailed !== "object")
                                    throw TypeError(".io.token.proto.common.notification.NotifyBody.transferFailed: object expected");
                                m.transferFailed = $root.io.token.proto.common.notification.TransferFailed.fromObject(d.transferFailed);
                            }
                            if (d.tokenCancelled != null) {
                                if (typeof d.tokenCancelled !== "object")
                                    throw TypeError(".io.token.proto.common.notification.NotifyBody.tokenCancelled: object expected");
                                m.tokenCancelled = $root.io.token.proto.common.notification.TokenCancelled.fromObject(d.tokenCancelled);
                            }
                            if (d.balanceStepUp != null) {
                                if (typeof d.balanceStepUp !== "object")
                                    throw TypeError(".io.token.proto.common.notification.NotifyBody.balanceStepUp: object expected");
                                m.balanceStepUp = $root.io.token.proto.common.notification.BalanceStepUp.fromObject(d.balanceStepUp);
                            }
                            if (d.transactionStepUp != null) {
                                if (typeof d.transactionStepUp !== "object")
                                    throw TypeError(".io.token.proto.common.notification.NotifyBody.transactionStepUp: object expected");
                                m.transactionStepUp = $root.io.token.proto.common.notification.TransactionStepUp.fromObject(d.transactionStepUp);
                            }
                            if (d.endorseAndAddKey != null) {
                                if (typeof d.endorseAndAddKey !== "object")
                                    throw TypeError(".io.token.proto.common.notification.NotifyBody.endorseAndAddKey: object expected");
                                m.endorseAndAddKey = $root.io.token.proto.common.notification.EndorseAndAddKey.fromObject(d.endorseAndAddKey);
                            }
                            if (d.recoveryCompleted != null) {
                                if (typeof d.recoveryCompleted !== "object")
                                    throw TypeError(".io.token.proto.common.notification.NotifyBody.recoveryCompleted: object expected");
                                m.recoveryCompleted = $root.io.token.proto.common.notification.RecoveryCompleted.fromObject(d.recoveryCompleted);
                            }
                            if (d.notificationInvalidated != null) {
                                if (typeof d.notificationInvalidated !== "object")
                                    throw TypeError(".io.token.proto.common.notification.NotifyBody.notificationInvalidated: object expected");
                                m.notificationInvalidated = $root.io.token.proto.common.notification.NotificationInvalidated.fromObject(d.notificationInvalidated);
                            }
                            return m;
                        };

                        NotifyBody.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (m.payerTransferProcessed != null && m.hasOwnProperty("payerTransferProcessed")) {
                                d.payerTransferProcessed = $root.io.token.proto.common.notification.PayerTransferProcessed.toObject(m.payerTransferProcessed, o);
                                if (o.oneofs)
                                    d.body = "payerTransferProcessed";
                            }
                            if (m.linkAccounts != null && m.hasOwnProperty("linkAccounts")) {
                                d.linkAccounts = $root.io.token.proto.common.notification.LinkAccounts.toObject(m.linkAccounts, o);
                                if (o.oneofs)
                                    d.body = "linkAccounts";
                            }
                            if (m.stepUp != null && m.hasOwnProperty("stepUp")) {
                                d.stepUp = $root.io.token.proto.common.notification.StepUp.toObject(m.stepUp, o);
                                if (o.oneofs)
                                    d.body = "stepUp";
                            }
                            if (m.addKey != null && m.hasOwnProperty("addKey")) {
                                d.addKey = $root.io.token.proto.common.notification.AddKey.toObject(m.addKey, o);
                                if (o.oneofs)
                                    d.body = "addKey";
                            }
                            if (m.linkAccountsAndAddKey != null && m.hasOwnProperty("linkAccountsAndAddKey")) {
                                d.linkAccountsAndAddKey = $root.io.token.proto.common.notification.LinkAccountsAndAddKey.toObject(m.linkAccountsAndAddKey, o);
                                if (o.oneofs)
                                    d.body = "linkAccountsAndAddKey";
                            }
                            if (m.payeeTransferProcessed != null && m.hasOwnProperty("payeeTransferProcessed")) {
                                d.payeeTransferProcessed = $root.io.token.proto.common.notification.PayeeTransferProcessed.toObject(m.payeeTransferProcessed, o);
                                if (o.oneofs)
                                    d.body = "payeeTransferProcessed";
                            }
                            if (m.paymentRequest != null && m.hasOwnProperty("paymentRequest")) {
                                d.paymentRequest = $root.io.token.proto.common.notification.PaymentRequest.toObject(m.paymentRequest, o);
                                if (o.oneofs)
                                    d.body = "paymentRequest";
                            }
                            if (m.payerTransferFailed != null && m.hasOwnProperty("payerTransferFailed")) {
                                d.payerTransferFailed = $root.io.token.proto.common.notification.PayerTransferFailed.toObject(m.payerTransferFailed, o);
                                if (o.oneofs)
                                    d.body = "payerTransferFailed";
                            }
                            if (m.transferProcessed != null && m.hasOwnProperty("transferProcessed")) {
                                d.transferProcessed = $root.io.token.proto.common.notification.TransferProcessed.toObject(m.transferProcessed, o);
                                if (o.oneofs)
                                    d.body = "transferProcessed";
                            }
                            if (m.transferFailed != null && m.hasOwnProperty("transferFailed")) {
                                d.transferFailed = $root.io.token.proto.common.notification.TransferFailed.toObject(m.transferFailed, o);
                                if (o.oneofs)
                                    d.body = "transferFailed";
                            }
                            if (m.tokenCancelled != null && m.hasOwnProperty("tokenCancelled")) {
                                d.tokenCancelled = $root.io.token.proto.common.notification.TokenCancelled.toObject(m.tokenCancelled, o);
                                if (o.oneofs)
                                    d.body = "tokenCancelled";
                            }
                            if (m.balanceStepUp != null && m.hasOwnProperty("balanceStepUp")) {
                                d.balanceStepUp = $root.io.token.proto.common.notification.BalanceStepUp.toObject(m.balanceStepUp, o);
                                if (o.oneofs)
                                    d.body = "balanceStepUp";
                            }
                            if (m.transactionStepUp != null && m.hasOwnProperty("transactionStepUp")) {
                                d.transactionStepUp = $root.io.token.proto.common.notification.TransactionStepUp.toObject(m.transactionStepUp, o);
                                if (o.oneofs)
                                    d.body = "transactionStepUp";
                            }
                            if (m.endorseAndAddKey != null && m.hasOwnProperty("endorseAndAddKey")) {
                                d.endorseAndAddKey = $root.io.token.proto.common.notification.EndorseAndAddKey.toObject(m.endorseAndAddKey, o);
                                if (o.oneofs)
                                    d.body = "endorseAndAddKey";
                            }
                            if (m.recoveryCompleted != null && m.hasOwnProperty("recoveryCompleted")) {
                                d.recoveryCompleted = $root.io.token.proto.common.notification.RecoveryCompleted.toObject(m.recoveryCompleted, o);
                                if (o.oneofs)
                                    d.body = "recoveryCompleted";
                            }
                            if (m.notificationInvalidated != null && m.hasOwnProperty("notificationInvalidated")) {
                                d.notificationInvalidated = $root.io.token.proto.common.notification.NotificationInvalidated.toObject(m.notificationInvalidated, o);
                                if (o.oneofs)
                                    d.body = "notificationInvalidated";
                            }
                            return d;
                        };

                        NotifyBody.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        Notification.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.Notification)
                                return d;
                            var m = new $root.io.token.proto.common.notification.Notification();
                            if (d.id != null) {
                                m.id = String(d.id);
                            }
                            if (d.subscriberId != null) {
                                m.subscriberId = String(d.subscriberId);
                            }
                            if (d.content != null) {
                                if (typeof d.content !== "object")
                                    throw TypeError(".io.token.proto.common.notification.Notification.content: object expected");
                                m.content = $root.io.token.proto.common.notification.NotificationContent.fromObject(d.content);
                            }
                            switch (d.status) {
                            case "INVALID":
                            case 0:
                                m.status = 0;
                                break;
                            case "PENDING":
                            case 1:
                                m.status = 1;
                                break;
                            case "DELIVERED":
                            case 2:
                                m.status = 2;
                                break;
                            case "COMPLETED":
                            case 3:
                                m.status = 3;
                                break;
                            case "INVALIDATED":
                            case 4:
                                m.status = 4;
                                break;
                            }
                            return m;
                        };

                        Notification.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.id = "";
                                d.subscriberId = "";
                                d.content = null;
                                d.status = o.enums === String ? "INVALID" : 0;
                            }
                            if (m.id != null && m.hasOwnProperty("id")) {
                                d.id = m.id;
                            }
                            if (m.subscriberId != null && m.hasOwnProperty("subscriberId")) {
                                d.subscriberId = m.subscriberId;
                            }
                            if (m.content != null && m.hasOwnProperty("content")) {
                                d.content = $root.io.token.proto.common.notification.NotificationContent.toObject(m.content, o);
                            }
                            if (m.status != null && m.hasOwnProperty("status")) {
                                d.status = o.enums === String ? $root.io.token.proto.common.notification.Notification.Status[m.status] : m.status;
                            }
                            return d;
                        };

                        Notification.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        NotificationContent.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.notification.NotificationContent)
                                return d;
                            var m = new $root.io.token.proto.common.notification.NotificationContent();
                            if (d.type != null) {
                                m.type = String(d.type);
                            }
                            if (d.title != null) {
                                m.title = String(d.title);
                            }
                            if (d.body != null) {
                                m.body = String(d.body);
                            }
                            if (d.payload != null) {
                                m.payload = String(d.payload);
                            }
                            if (d.createdAtMs != null) {
                                if ($util.Long)
                                    (m.createdAtMs = $util.Long.fromValue(d.createdAtMs)).unsigned = false;
                                else if (typeof d.createdAtMs === "string")
                                    m.createdAtMs = parseInt(d.createdAtMs, 10);
                                else if (typeof d.createdAtMs === "number")
                                    m.createdAtMs = d.createdAtMs;
                                else if (typeof d.createdAtMs === "object")
                                    m.createdAtMs = new $util.LongBits(d.createdAtMs.low >>> 0, d.createdAtMs.high >>> 0).toNumber();
                            }
                            if (d.locKey != null) {
                                m.locKey = String(d.locKey);
                            }
                            if (d.locArgs) {
                                if (!Array.isArray(d.locArgs))
                                    throw TypeError(".io.token.proto.common.notification.NotificationContent.locArgs: array expected");
                                m.locArgs = [];
                                for (var i = 0; i < d.locArgs.length; ++i) {
                                    m.locArgs[i] = String(d.locArgs[i]);
                                }
                            }
                            return m;
                        };

                        NotificationContent.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.arrays || o.defaults) {
                                d.locArgs = [];
                            }
                            if (o.defaults) {
                                d.type = "";
                                d.title = "";
                                d.body = "";
                                d.payload = "";
                                if ($util.Long) {
                                    var n = new $util.Long(0, 0, false);
                                    d.createdAtMs = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                } else
                                    d.createdAtMs = o.longs === String ? "0" : 0;
                                d.locKey = "";
                            }
                            if (m.type != null && m.hasOwnProperty("type")) {
                                d.type = m.type;
                            }
                            if (m.title != null && m.hasOwnProperty("title")) {
                                d.title = m.title;
                            }
                            if (m.body != null && m.hasOwnProperty("body")) {
                                d.body = m.body;
                            }
                            if (m.payload != null && m.hasOwnProperty("payload")) {
                                d.payload = m.payload;
                            }
                            if (m.createdAtMs != null && m.hasOwnProperty("createdAtMs")) {
                                if (typeof m.createdAtMs === "number")
                                    d.createdAtMs = o.longs === String ? String(m.createdAtMs) : m.createdAtMs;
                                else
                                    d.createdAtMs = o.longs === String ? $util.Long.prototype.toString.call(m.createdAtMs) : o.longs === Number ? new $util.LongBits(m.createdAtMs.low >>> 0, m.createdAtMs.high >>> 0).toNumber() : m.createdAtMs;
                            }
                            if (m.locKey != null && m.hasOwnProperty("locKey")) {
                                d.locKey = m.locKey;
                            }
                            if (m.locArgs && m.locArgs.length) {
                                d.locArgs = [];
                                for (var j = 0; j < m.locArgs.length; ++j) {
                                    d.locArgs[j] = m.locArgs[j];
                                }
                            }
                            return d;
                        };

                        NotificationContent.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return NotificationContent;
                    })();

                    return notification;
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

                        Token.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.token.Token)
                                return d;
                            var m = new $root.io.token.proto.common.token.Token();
                            if (d.id != null) {
                                m.id = String(d.id);
                            }
                            if (d.payload != null) {
                                if (typeof d.payload !== "object")
                                    throw TypeError(".io.token.proto.common.token.Token.payload: object expected");
                                m.payload = $root.io.token.proto.common.token.TokenPayload.fromObject(d.payload);
                            }
                            if (d.payloadSignatures) {
                                if (!Array.isArray(d.payloadSignatures))
                                    throw TypeError(".io.token.proto.common.token.Token.payloadSignatures: array expected");
                                m.payloadSignatures = [];
                                for (var i = 0; i < d.payloadSignatures.length; ++i) {
                                    if (typeof d.payloadSignatures[i] !== "object")
                                        throw TypeError(".io.token.proto.common.token.Token.payloadSignatures: object expected");
                                    m.payloadSignatures[i] = $root.io.token.proto.common.token.TokenSignature.fromObject(d.payloadSignatures[i]);
                                }
                            }
                            if (d.replacedByTokenId != null) {
                                m.replacedByTokenId = String(d.replacedByTokenId);
                            }
                            if (d.tokenRequestId != null) {
                                m.tokenRequestId = String(d.tokenRequestId);
                            }
                            return m;
                        };

                        Token.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.arrays || o.defaults) {
                                d.payloadSignatures = [];
                            }
                            if (o.defaults) {
                                d.id = "";
                                d.payload = null;
                                d.replacedByTokenId = "";
                                d.tokenRequestId = "";
                            }
                            if (m.id != null && m.hasOwnProperty("id")) {
                                d.id = m.id;
                            }
                            if (m.payload != null && m.hasOwnProperty("payload")) {
                                d.payload = $root.io.token.proto.common.token.TokenPayload.toObject(m.payload, o);
                            }
                            if (m.payloadSignatures && m.payloadSignatures.length) {
                                d.payloadSignatures = [];
                                for (var j = 0; j < m.payloadSignatures.length; ++j) {
                                    d.payloadSignatures[j] = $root.io.token.proto.common.token.TokenSignature.toObject(m.payloadSignatures[j], o);
                                }
                            }
                            if (m.replacedByTokenId != null && m.hasOwnProperty("replacedByTokenId")) {
                                d.replacedByTokenId = m.replacedByTokenId;
                            }
                            if (m.tokenRequestId != null && m.hasOwnProperty("tokenRequestId")) {
                                d.tokenRequestId = m.tokenRequestId;
                            }
                            return d;
                        };

                        Token.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
                        TokenRequest.prototype.userRefId = "";

                        TokenRequest.create = function create(properties) {
                            return new TokenRequest(properties);
                        };

                        TokenRequest.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.token.TokenRequest)
                                return d;
                            var m = new $root.io.token.proto.common.token.TokenRequest();
                            if (d.id != null) {
                                m.id = String(d.id);
                            }
                            if (d.payload != null) {
                                if (typeof d.payload !== "object")
                                    throw TypeError(".io.token.proto.common.token.TokenRequest.payload: object expected");
                                m.payload = $root.io.token.proto.common.token.TokenPayload.fromObject(d.payload);
                            }
                            if (d.options) {
                                if (typeof d.options !== "object")
                                    throw TypeError(".io.token.proto.common.token.TokenRequest.options: object expected");
                                m.options = {};
                                for (var ks = Object.keys(d.options), i = 0; i < ks.length; ++i) {
                                    m.options[ks[i]] = String(d.options[ks[i]]);
                                }
                            }
                            if (d.userRefId != null) {
                                m.userRefId = String(d.userRefId);
                            }
                            return m;
                        };

                        TokenRequest.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.objects || o.defaults) {
                                d.options = {};
                            }
                            if (o.defaults) {
                                d.id = "";
                                d.payload = null;
                                d.userRefId = "";
                            }
                            if (m.id != null && m.hasOwnProperty("id")) {
                                d.id = m.id;
                            }
                            if (m.payload != null && m.hasOwnProperty("payload")) {
                                d.payload = $root.io.token.proto.common.token.TokenPayload.toObject(m.payload, o);
                            }
                            var ks2;
                            if (m.options && (ks2 = Object.keys(m.options)).length) {
                                d.options = {};
                                for (var j = 0; j < ks2.length; ++j) {
                                    d.options[ks2[j]] = m.options[ks2[j]];
                                }
                            }
                            if (m.userRefId != null && m.hasOwnProperty("userRefId")) {
                                d.userRefId = m.userRefId;
                            }
                            return d;
                        };

                        TokenRequest.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        TokenSignature.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.token.TokenSignature)
                                return d;
                            var m = new $root.io.token.proto.common.token.TokenSignature();
                            switch (d.action) {
                            case "INVALID":
                            case 0:
                                m.action = 0;
                                break;
                            case "ENDORSED":
                            case 1:
                                m.action = 1;
                                break;
                            case "CANCELLED":
                            case 2:
                                m.action = 2;
                                break;
                            }
                            if (d.signature != null) {
                                if (typeof d.signature !== "object")
                                    throw TypeError(".io.token.proto.common.token.TokenSignature.signature: object expected");
                                m.signature = $root.io.token.proto.common.security.Signature.fromObject(d.signature);
                            }
                            return m;
                        };

                        TokenSignature.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.action = o.enums === String ? "INVALID" : 0;
                                d.signature = null;
                            }
                            if (m.action != null && m.hasOwnProperty("action")) {
                                d.action = o.enums === String ? $root.io.token.proto.common.token.TokenSignature.Action[m.action] : m.action;
                            }
                            if (m.signature != null && m.hasOwnProperty("signature")) {
                                d.signature = $root.io.token.proto.common.security.Signature.toObject(m.signature, o);
                            }
                            return d;
                        };

                        TokenSignature.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        TokenMember.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.token.TokenMember)
                                return d;
                            var m = new $root.io.token.proto.common.token.TokenMember();
                            if (d.id != null) {
                                m.id = String(d.id);
                            }
                            if (d.username != null) {
                                m.username = String(d.username);
                            }
                            if (d.alias != null) {
                                if (typeof d.alias !== "object")
                                    throw TypeError(".io.token.proto.common.token.TokenMember.alias: object expected");
                                m.alias = $root.io.token.proto.common.alias.Alias.fromObject(d.alias);
                            }
                            return m;
                        };

                        TokenMember.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.id = "";
                                d.username = "";
                                d.alias = null;
                            }
                            if (m.id != null && m.hasOwnProperty("id")) {
                                d.id = m.id;
                            }
                            if (m.username != null && m.hasOwnProperty("username")) {
                                d.username = m.username;
                            }
                            if (m.alias != null && m.hasOwnProperty("alias")) {
                                d.alias = $root.io.token.proto.common.alias.Alias.toObject(m.alias, o);
                            }
                            return d;
                        };

                        TokenMember.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        TokenPayload.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.token.TokenPayload)
                                return d;
                            var m = new $root.io.token.proto.common.token.TokenPayload();
                            if (d.version != null) {
                                m.version = String(d.version);
                            }
                            if (d.refId != null) {
                                m.refId = String(d.refId);
                            }
                            if (d.issuer != null) {
                                if (typeof d.issuer !== "object")
                                    throw TypeError(".io.token.proto.common.token.TokenPayload.issuer: object expected");
                                m.issuer = $root.io.token.proto.common.token.TokenMember.fromObject(d.issuer);
                            }
                            if (d.from != null) {
                                if (typeof d.from !== "object")
                                    throw TypeError(".io.token.proto.common.token.TokenPayload.from: object expected");
                                m.from = $root.io.token.proto.common.token.TokenMember.fromObject(d.from);
                            }
                            if (d.to != null) {
                                if (typeof d.to !== "object")
                                    throw TypeError(".io.token.proto.common.token.TokenPayload.to: object expected");
                                m.to = $root.io.token.proto.common.token.TokenMember.fromObject(d.to);
                            }
                            if (d.effectiveAtMs != null) {
                                if ($util.Long)
                                    (m.effectiveAtMs = $util.Long.fromValue(d.effectiveAtMs)).unsigned = false;
                                else if (typeof d.effectiveAtMs === "string")
                                    m.effectiveAtMs = parseInt(d.effectiveAtMs, 10);
                                else if (typeof d.effectiveAtMs === "number")
                                    m.effectiveAtMs = d.effectiveAtMs;
                                else if (typeof d.effectiveAtMs === "object")
                                    m.effectiveAtMs = new $util.LongBits(d.effectiveAtMs.low >>> 0, d.effectiveAtMs.high >>> 0).toNumber();
                            }
                            if (d.expiresAtMs != null) {
                                if ($util.Long)
                                    (m.expiresAtMs = $util.Long.fromValue(d.expiresAtMs)).unsigned = false;
                                else if (typeof d.expiresAtMs === "string")
                                    m.expiresAtMs = parseInt(d.expiresAtMs, 10);
                                else if (typeof d.expiresAtMs === "number")
                                    m.expiresAtMs = d.expiresAtMs;
                                else if (typeof d.expiresAtMs === "object")
                                    m.expiresAtMs = new $util.LongBits(d.expiresAtMs.low >>> 0, d.expiresAtMs.high >>> 0).toNumber();
                            }
                            if (d.endorseUntilMs != null) {
                                if ($util.Long)
                                    (m.endorseUntilMs = $util.Long.fromValue(d.endorseUntilMs)).unsigned = false;
                                else if (typeof d.endorseUntilMs === "string")
                                    m.endorseUntilMs = parseInt(d.endorseUntilMs, 10);
                                else if (typeof d.endorseUntilMs === "number")
                                    m.endorseUntilMs = d.endorseUntilMs;
                                else if (typeof d.endorseUntilMs === "object")
                                    m.endorseUntilMs = new $util.LongBits(d.endorseUntilMs.low >>> 0, d.endorseUntilMs.high >>> 0).toNumber();
                            }
                            if (d.description != null) {
                                m.description = String(d.description);
                            }
                            if (d.transfer != null) {
                                if (typeof d.transfer !== "object")
                                    throw TypeError(".io.token.proto.common.token.TokenPayload.transfer: object expected");
                                m.transfer = $root.io.token.proto.common.token.TransferBody.fromObject(d.transfer);
                            }
                            if (d.access != null) {
                                if (typeof d.access !== "object")
                                    throw TypeError(".io.token.proto.common.token.TokenPayload.access: object expected");
                                m.access = $root.io.token.proto.common.token.AccessBody.fromObject(d.access);
                            }
                            if (d.actingAs != null) {
                                if (typeof d.actingAs !== "object")
                                    throw TypeError(".io.token.proto.common.token.TokenPayload.actingAs: object expected");
                                m.actingAs = $root.io.token.proto.common.token.TokenPayload.ActingAs.fromObject(d.actingAs);
                            }
                            if (d.receiptRequested != null) {
                                m.receiptRequested = Boolean(d.receiptRequested);
                            }
                            return m;
                        };

                        TokenPayload.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.version = "";
                                d.refId = "";
                                d.issuer = null;
                                d.from = null;
                                d.to = null;
                                if ($util.Long) {
                                    var n = new $util.Long(0, 0, false);
                                    d.effectiveAtMs = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                } else
                                    d.effectiveAtMs = o.longs === String ? "0" : 0;
                                if ($util.Long) {
                                    var n = new $util.Long(0, 0, false);
                                    d.expiresAtMs = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                } else
                                    d.expiresAtMs = o.longs === String ? "0" : 0;
                                d.description = "";
                                if ($util.Long) {
                                    var n = new $util.Long(0, 0, false);
                                    d.endorseUntilMs = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                } else
                                    d.endorseUntilMs = o.longs === String ? "0" : 0;
                                d.actingAs = null;
                                d.receiptRequested = false;
                            }
                            if (m.version != null && m.hasOwnProperty("version")) {
                                d.version = m.version;
                            }
                            if (m.refId != null && m.hasOwnProperty("refId")) {
                                d.refId = m.refId;
                            }
                            if (m.issuer != null && m.hasOwnProperty("issuer")) {
                                d.issuer = $root.io.token.proto.common.token.TokenMember.toObject(m.issuer, o);
                            }
                            if (m.from != null && m.hasOwnProperty("from")) {
                                d.from = $root.io.token.proto.common.token.TokenMember.toObject(m.from, o);
                            }
                            if (m.to != null && m.hasOwnProperty("to")) {
                                d.to = $root.io.token.proto.common.token.TokenMember.toObject(m.to, o);
                            }
                            if (m.effectiveAtMs != null && m.hasOwnProperty("effectiveAtMs")) {
                                if (typeof m.effectiveAtMs === "number")
                                    d.effectiveAtMs = o.longs === String ? String(m.effectiveAtMs) : m.effectiveAtMs;
                                else
                                    d.effectiveAtMs = o.longs === String ? $util.Long.prototype.toString.call(m.effectiveAtMs) : o.longs === Number ? new $util.LongBits(m.effectiveAtMs.low >>> 0, m.effectiveAtMs.high >>> 0).toNumber() : m.effectiveAtMs;
                            }
                            if (m.expiresAtMs != null && m.hasOwnProperty("expiresAtMs")) {
                                if (typeof m.expiresAtMs === "number")
                                    d.expiresAtMs = o.longs === String ? String(m.expiresAtMs) : m.expiresAtMs;
                                else
                                    d.expiresAtMs = o.longs === String ? $util.Long.prototype.toString.call(m.expiresAtMs) : o.longs === Number ? new $util.LongBits(m.expiresAtMs.low >>> 0, m.expiresAtMs.high >>> 0).toNumber() : m.expiresAtMs;
                            }
                            if (m.description != null && m.hasOwnProperty("description")) {
                                d.description = m.description;
                            }
                            if (m.transfer != null && m.hasOwnProperty("transfer")) {
                                d.transfer = $root.io.token.proto.common.token.TransferBody.toObject(m.transfer, o);
                                if (o.oneofs)
                                    d.body = "transfer";
                            }
                            if (m.access != null && m.hasOwnProperty("access")) {
                                d.access = $root.io.token.proto.common.token.AccessBody.toObject(m.access, o);
                                if (o.oneofs)
                                    d.body = "access";
                            }
                            if (m.endorseUntilMs != null && m.hasOwnProperty("endorseUntilMs")) {
                                if (typeof m.endorseUntilMs === "number")
                                    d.endorseUntilMs = o.longs === String ? String(m.endorseUntilMs) : m.endorseUntilMs;
                                else
                                    d.endorseUntilMs = o.longs === String ? $util.Long.prototype.toString.call(m.endorseUntilMs) : o.longs === Number ? new $util.LongBits(m.endorseUntilMs.low >>> 0, m.endorseUntilMs.high >>> 0).toNumber() : m.endorseUntilMs;
                            }
                            if (m.actingAs != null && m.hasOwnProperty("actingAs")) {
                                d.actingAs = $root.io.token.proto.common.token.TokenPayload.ActingAs.toObject(m.actingAs, o);
                            }
                            if (m.receiptRequested != null && m.hasOwnProperty("receiptRequested")) {
                                d.receiptRequested = m.receiptRequested;
                            }
                            return d;
                        };

                        TokenPayload.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            ActingAs.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.token.TokenPayload.ActingAs)
                                    return d;
                                var m = new $root.io.token.proto.common.token.TokenPayload.ActingAs();
                                if (d.displayName != null) {
                                    m.displayName = String(d.displayName);
                                }
                                if (d.refId != null) {
                                    m.refId = String(d.refId);
                                }
                                if (d.logoUrl != null) {
                                    m.logoUrl = String(d.logoUrl);
                                }
                                if (d.secondaryName != null) {
                                    m.secondaryName = String(d.secondaryName);
                                }
                                return m;
                            };

                            ActingAs.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (o.defaults) {
                                    d.displayName = "";
                                    d.refId = "";
                                    d.logoUrl = "";
                                    d.secondaryName = "";
                                }
                                if (m.displayName != null && m.hasOwnProperty("displayName")) {
                                    d.displayName = m.displayName;
                                }
                                if (m.refId != null && m.hasOwnProperty("refId")) {
                                    d.refId = m.refId;
                                }
                                if (m.logoUrl != null && m.hasOwnProperty("logoUrl")) {
                                    d.logoUrl = m.logoUrl;
                                }
                                if (m.secondaryName != null && m.hasOwnProperty("secondaryName")) {
                                    d.secondaryName = m.secondaryName;
                                }
                                return d;
                            };

                            ActingAs.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        ExternalAuthorizationDetails.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.token.ExternalAuthorizationDetails)
                                return d;
                            var m = new $root.io.token.proto.common.token.ExternalAuthorizationDetails();
                            if (d.url != null) {
                                m.url = String(d.url);
                            }
                            if (d.completionPattern != null) {
                                m.completionPattern = String(d.completionPattern);
                            }
                            if (d.authorizationUrl != null) {
                                m.authorizationUrl = String(d.authorizationUrl);
                            }
                            return m;
                        };

                        ExternalAuthorizationDetails.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.url = "";
                                d.completionPattern = "";
                                d.authorizationUrl = "";
                            }
                            if (m.url != null && m.hasOwnProperty("url")) {
                                d.url = m.url;
                            }
                            if (m.completionPattern != null && m.hasOwnProperty("completionPattern")) {
                                d.completionPattern = m.completionPattern;
                            }
                            if (m.authorizationUrl != null && m.hasOwnProperty("authorizationUrl")) {
                                d.authorizationUrl = m.authorizationUrl;
                            }
                            return d;
                        };

                        ExternalAuthorizationDetails.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        TransferBody.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.token.TransferBody)
                                return d;
                            var m = new $root.io.token.proto.common.token.TransferBody();
                            if (d.redeemer != null) {
                                if (typeof d.redeemer !== "object")
                                    throw TypeError(".io.token.proto.common.token.TransferBody.redeemer: object expected");
                                m.redeemer = $root.io.token.proto.common.token.TokenMember.fromObject(d.redeemer);
                            }
                            if (d.instructions != null) {
                                if (typeof d.instructions !== "object")
                                    throw TypeError(".io.token.proto.common.token.TransferBody.instructions: object expected");
                                m.instructions = $root.io.token.proto.common.transferinstructions.TransferInstructions.fromObject(d.instructions);
                            }
                            if (d.currency != null) {
                                m.currency = String(d.currency);
                            }
                            if (d.lifetimeAmount != null) {
                                m.lifetimeAmount = String(d.lifetimeAmount);
                            }
                            if (d.amount != null) {
                                m.amount = String(d.amount);
                            }
                            if (d.attachments) {
                                if (!Array.isArray(d.attachments))
                                    throw TypeError(".io.token.proto.common.token.TransferBody.attachments: array expected");
                                m.attachments = [];
                                for (var i = 0; i < d.attachments.length; ++i) {
                                    if (typeof d.attachments[i] !== "object")
                                        throw TypeError(".io.token.proto.common.token.TransferBody.attachments: object expected");
                                    m.attachments[i] = $root.io.token.proto.common.blob.Attachment.fromObject(d.attachments[i]);
                                }
                            }
                            if (d.pricing != null) {
                                if (typeof d.pricing !== "object")
                                    throw TypeError(".io.token.proto.common.token.TransferBody.pricing: object expected");
                                m.pricing = $root.io.token.proto.common.pricing.Pricing.fromObject(d.pricing);
                            }
                            return m;
                        };

                        TransferBody.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.arrays || o.defaults) {
                                d.attachments = [];
                            }
                            if (o.defaults) {
                                d.redeemer = null;
                                d.instructions = null;
                                d.currency = "";
                                d.lifetimeAmount = "";
                                d.amount = "";
                                d.pricing = null;
                            }
                            if (m.redeemer != null && m.hasOwnProperty("redeemer")) {
                                d.redeemer = $root.io.token.proto.common.token.TokenMember.toObject(m.redeemer, o);
                            }
                            if (m.instructions != null && m.hasOwnProperty("instructions")) {
                                d.instructions = $root.io.token.proto.common.transferinstructions.TransferInstructions.toObject(m.instructions, o);
                            }
                            if (m.currency != null && m.hasOwnProperty("currency")) {
                                d.currency = m.currency;
                            }
                            if (m.lifetimeAmount != null && m.hasOwnProperty("lifetimeAmount")) {
                                d.lifetimeAmount = m.lifetimeAmount;
                            }
                            if (m.amount != null && m.hasOwnProperty("amount")) {
                                d.amount = m.amount;
                            }
                            if (m.attachments && m.attachments.length) {
                                d.attachments = [];
                                for (var j = 0; j < m.attachments.length; ++j) {
                                    d.attachments[j] = $root.io.token.proto.common.blob.Attachment.toObject(m.attachments[j], o);
                                }
                            }
                            if (m.pricing != null && m.hasOwnProperty("pricing")) {
                                d.pricing = $root.io.token.proto.common.pricing.Pricing.toObject(m.pricing, o);
                            }
                            return d;
                        };

                        TransferBody.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        AccessBody.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.token.AccessBody)
                                return d;
                            var m = new $root.io.token.proto.common.token.AccessBody();
                            if (d.resources) {
                                if (!Array.isArray(d.resources))
                                    throw TypeError(".io.token.proto.common.token.AccessBody.resources: array expected");
                                m.resources = [];
                                for (var i = 0; i < d.resources.length; ++i) {
                                    if (typeof d.resources[i] !== "object")
                                        throw TypeError(".io.token.proto.common.token.AccessBody.resources: object expected");
                                    m.resources[i] = $root.io.token.proto.common.token.AccessBody.Resource.fromObject(d.resources[i]);
                                }
                            }
                            return m;
                        };

                        AccessBody.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.arrays || o.defaults) {
                                d.resources = [];
                            }
                            if (m.resources && m.resources.length) {
                                d.resources = [];
                                for (var j = 0; j < m.resources.length; ++j) {
                                    d.resources[j] = $root.io.token.proto.common.token.AccessBody.Resource.toObject(m.resources[j], o);
                                }
                            }
                            return d;
                        };

                        AccessBody.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            Resource.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.token.AccessBody.Resource)
                                    return d;
                                var m = new $root.io.token.proto.common.token.AccessBody.Resource();
                                if (d.allAddresses != null) {
                                    if (typeof d.allAddresses !== "object")
                                        throw TypeError(".io.token.proto.common.token.AccessBody.Resource.allAddresses: object expected");
                                    m.allAddresses = $root.io.token.proto.common.token.AccessBody.Resource.AllAddresses.fromObject(d.allAddresses);
                                }
                                if (d.allAccounts != null) {
                                    if (typeof d.allAccounts !== "object")
                                        throw TypeError(".io.token.proto.common.token.AccessBody.Resource.allAccounts: object expected");
                                    m.allAccounts = $root.io.token.proto.common.token.AccessBody.Resource.AllAccounts.fromObject(d.allAccounts);
                                }
                                if (d.allTransactions != null) {
                                    if (typeof d.allTransactions !== "object")
                                        throw TypeError(".io.token.proto.common.token.AccessBody.Resource.allTransactions: object expected");
                                    m.allTransactions = $root.io.token.proto.common.token.AccessBody.Resource.AllAccountTransactions.fromObject(d.allTransactions);
                                }
                                if (d.allBalances != null) {
                                    if (typeof d.allBalances !== "object")
                                        throw TypeError(".io.token.proto.common.token.AccessBody.Resource.allBalances: object expected");
                                    m.allBalances = $root.io.token.proto.common.token.AccessBody.Resource.AllAccountBalances.fromObject(d.allBalances);
                                }
                                if (d.address != null) {
                                    if (typeof d.address !== "object")
                                        throw TypeError(".io.token.proto.common.token.AccessBody.Resource.address: object expected");
                                    m.address = $root.io.token.proto.common.token.AccessBody.Resource.Address.fromObject(d.address);
                                }
                                if (d.account != null) {
                                    if (typeof d.account !== "object")
                                        throw TypeError(".io.token.proto.common.token.AccessBody.Resource.account: object expected");
                                    m.account = $root.io.token.proto.common.token.AccessBody.Resource.Account.fromObject(d.account);
                                }
                                if (d.transactions != null) {
                                    if (typeof d.transactions !== "object")
                                        throw TypeError(".io.token.proto.common.token.AccessBody.Resource.transactions: object expected");
                                    m.transactions = $root.io.token.proto.common.token.AccessBody.Resource.AccountTransactions.fromObject(d.transactions);
                                }
                                if (d.balance != null) {
                                    if (typeof d.balance !== "object")
                                        throw TypeError(".io.token.proto.common.token.AccessBody.Resource.balance: object expected");
                                    m.balance = $root.io.token.proto.common.token.AccessBody.Resource.AccountBalance.fromObject(d.balance);
                                }
                                if (d.allAccountsAtBank != null) {
                                    if (typeof d.allAccountsAtBank !== "object")
                                        throw TypeError(".io.token.proto.common.token.AccessBody.Resource.allAccountsAtBank: object expected");
                                    m.allAccountsAtBank = $root.io.token.proto.common.token.AccessBody.Resource.AllAccountsAtBank.fromObject(d.allAccountsAtBank);
                                }
                                if (d.allTransactionsAtBank != null) {
                                    if (typeof d.allTransactionsAtBank !== "object")
                                        throw TypeError(".io.token.proto.common.token.AccessBody.Resource.allTransactionsAtBank: object expected");
                                    m.allTransactionsAtBank = $root.io.token.proto.common.token.AccessBody.Resource.AllTransactionsAtBank.fromObject(d.allTransactionsAtBank);
                                }
                                if (d.allBalancesAtBank != null) {
                                    if (typeof d.allBalancesAtBank !== "object")
                                        throw TypeError(".io.token.proto.common.token.AccessBody.Resource.allBalancesAtBank: object expected");
                                    m.allBalancesAtBank = $root.io.token.proto.common.token.AccessBody.Resource.AllBalancesAtBank.fromObject(d.allBalancesAtBank);
                                }
                                return m;
                            };

                            Resource.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (m.allAddresses != null && m.hasOwnProperty("allAddresses")) {
                                    d.allAddresses = $root.io.token.proto.common.token.AccessBody.Resource.AllAddresses.toObject(m.allAddresses, o);
                                    if (o.oneofs)
                                        d.resource = "allAddresses";
                                }
                                if (m.allAccounts != null && m.hasOwnProperty("allAccounts")) {
                                    d.allAccounts = $root.io.token.proto.common.token.AccessBody.Resource.AllAccounts.toObject(m.allAccounts, o);
                                    if (o.oneofs)
                                        d.resource = "allAccounts";
                                }
                                if (m.allTransactions != null && m.hasOwnProperty("allTransactions")) {
                                    d.allTransactions = $root.io.token.proto.common.token.AccessBody.Resource.AllAccountTransactions.toObject(m.allTransactions, o);
                                    if (o.oneofs)
                                        d.resource = "allTransactions";
                                }
                                if (m.allBalances != null && m.hasOwnProperty("allBalances")) {
                                    d.allBalances = $root.io.token.proto.common.token.AccessBody.Resource.AllAccountBalances.toObject(m.allBalances, o);
                                    if (o.oneofs)
                                        d.resource = "allBalances";
                                }
                                if (m.address != null && m.hasOwnProperty("address")) {
                                    d.address = $root.io.token.proto.common.token.AccessBody.Resource.Address.toObject(m.address, o);
                                    if (o.oneofs)
                                        d.resource = "address";
                                }
                                if (m.account != null && m.hasOwnProperty("account")) {
                                    d.account = $root.io.token.proto.common.token.AccessBody.Resource.Account.toObject(m.account, o);
                                    if (o.oneofs)
                                        d.resource = "account";
                                }
                                if (m.transactions != null && m.hasOwnProperty("transactions")) {
                                    d.transactions = $root.io.token.proto.common.token.AccessBody.Resource.AccountTransactions.toObject(m.transactions, o);
                                    if (o.oneofs)
                                        d.resource = "transactions";
                                }
                                if (m.balance != null && m.hasOwnProperty("balance")) {
                                    d.balance = $root.io.token.proto.common.token.AccessBody.Resource.AccountBalance.toObject(m.balance, o);
                                    if (o.oneofs)
                                        d.resource = "balance";
                                }
                                if (m.allAccountsAtBank != null && m.hasOwnProperty("allAccountsAtBank")) {
                                    d.allAccountsAtBank = $root.io.token.proto.common.token.AccessBody.Resource.AllAccountsAtBank.toObject(m.allAccountsAtBank, o);
                                    if (o.oneofs)
                                        d.resource = "allAccountsAtBank";
                                }
                                if (m.allTransactionsAtBank != null && m.hasOwnProperty("allTransactionsAtBank")) {
                                    d.allTransactionsAtBank = $root.io.token.proto.common.token.AccessBody.Resource.AllTransactionsAtBank.toObject(m.allTransactionsAtBank, o);
                                    if (o.oneofs)
                                        d.resource = "allTransactionsAtBank";
                                }
                                if (m.allBalancesAtBank != null && m.hasOwnProperty("allBalancesAtBank")) {
                                    d.allBalancesAtBank = $root.io.token.proto.common.token.AccessBody.Resource.AllBalancesAtBank.toObject(m.allBalancesAtBank, o);
                                    if (o.oneofs)
                                        d.resource = "allBalancesAtBank";
                                }
                                return d;
                            };

                            Resource.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                                AllAddresses.fromObject = function fromObject(d) {
                                    if (d instanceof $root.io.token.proto.common.token.AccessBody.Resource.AllAddresses)
                                        return d;
                                    return new $root.io.token.proto.common.token.AccessBody.Resource.AllAddresses();
                                };

                                AllAddresses.toObject = function toObject() {
                                    return {};
                                };

                                AllAddresses.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                                Address.fromObject = function fromObject(d) {
                                    if (d instanceof $root.io.token.proto.common.token.AccessBody.Resource.Address)
                                        return d;
                                    var m = new $root.io.token.proto.common.token.AccessBody.Resource.Address();
                                    if (d.addressId != null) {
                                        m.addressId = String(d.addressId);
                                    }
                                    return m;
                                };

                                Address.toObject = function toObject(m, o) {
                                    if (!o)
                                        o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        d.addressId = "";
                                    }
                                    if (m.addressId != null && m.hasOwnProperty("addressId")) {
                                        d.addressId = m.addressId;
                                    }
                                    return d;
                                };

                                Address.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                                AllAccounts.fromObject = function fromObject(d) {
                                    if (d instanceof $root.io.token.proto.common.token.AccessBody.Resource.AllAccounts)
                                        return d;
                                    return new $root.io.token.proto.common.token.AccessBody.Resource.AllAccounts();
                                };

                                AllAccounts.toObject = function toObject() {
                                    return {};
                                };

                                AllAccounts.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                                AllAccountsAtBank.fromObject = function fromObject(d) {
                                    if (d instanceof $root.io.token.proto.common.token.AccessBody.Resource.AllAccountsAtBank)
                                        return d;
                                    var m = new $root.io.token.proto.common.token.AccessBody.Resource.AllAccountsAtBank();
                                    if (d.bankId != null) {
                                        m.bankId = String(d.bankId);
                                    }
                                    return m;
                                };

                                AllAccountsAtBank.toObject = function toObject(m, o) {
                                    if (!o)
                                        o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        d.bankId = "";
                                    }
                                    if (m.bankId != null && m.hasOwnProperty("bankId")) {
                                        d.bankId = m.bankId;
                                    }
                                    return d;
                                };

                                AllAccountsAtBank.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                                Account.fromObject = function fromObject(d) {
                                    if (d instanceof $root.io.token.proto.common.token.AccessBody.Resource.Account)
                                        return d;
                                    var m = new $root.io.token.proto.common.token.AccessBody.Resource.Account();
                                    if (d.accountId != null) {
                                        m.accountId = String(d.accountId);
                                    }
                                    return m;
                                };

                                Account.toObject = function toObject(m, o) {
                                    if (!o)
                                        o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        d.accountId = "";
                                    }
                                    if (m.accountId != null && m.hasOwnProperty("accountId")) {
                                        d.accountId = m.accountId;
                                    }
                                    return d;
                                };

                                Account.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                                AllAccountTransactions.fromObject = function fromObject(d) {
                                    if (d instanceof $root.io.token.proto.common.token.AccessBody.Resource.AllAccountTransactions)
                                        return d;
                                    return new $root.io.token.proto.common.token.AccessBody.Resource.AllAccountTransactions();
                                };

                                AllAccountTransactions.toObject = function toObject() {
                                    return {};
                                };

                                AllAccountTransactions.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                                AllTransactionsAtBank.fromObject = function fromObject(d) {
                                    if (d instanceof $root.io.token.proto.common.token.AccessBody.Resource.AllTransactionsAtBank)
                                        return d;
                                    var m = new $root.io.token.proto.common.token.AccessBody.Resource.AllTransactionsAtBank();
                                    if (d.bankId != null) {
                                        m.bankId = String(d.bankId);
                                    }
                                    return m;
                                };

                                AllTransactionsAtBank.toObject = function toObject(m, o) {
                                    if (!o)
                                        o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        d.bankId = "";
                                    }
                                    if (m.bankId != null && m.hasOwnProperty("bankId")) {
                                        d.bankId = m.bankId;
                                    }
                                    return d;
                                };

                                AllTransactionsAtBank.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                                AccountTransactions.fromObject = function fromObject(d) {
                                    if (d instanceof $root.io.token.proto.common.token.AccessBody.Resource.AccountTransactions)
                                        return d;
                                    var m = new $root.io.token.proto.common.token.AccessBody.Resource.AccountTransactions();
                                    if (d.accountId != null) {
                                        m.accountId = String(d.accountId);
                                    }
                                    return m;
                                };

                                AccountTransactions.toObject = function toObject(m, o) {
                                    if (!o)
                                        o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        d.accountId = "";
                                    }
                                    if (m.accountId != null && m.hasOwnProperty("accountId")) {
                                        d.accountId = m.accountId;
                                    }
                                    return d;
                                };

                                AccountTransactions.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                                AllAccountBalances.fromObject = function fromObject(d) {
                                    if (d instanceof $root.io.token.proto.common.token.AccessBody.Resource.AllAccountBalances)
                                        return d;
                                    return new $root.io.token.proto.common.token.AccessBody.Resource.AllAccountBalances();
                                };

                                AllAccountBalances.toObject = function toObject() {
                                    return {};
                                };

                                AllAccountBalances.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                                AllBalancesAtBank.fromObject = function fromObject(d) {
                                    if (d instanceof $root.io.token.proto.common.token.AccessBody.Resource.AllBalancesAtBank)
                                        return d;
                                    var m = new $root.io.token.proto.common.token.AccessBody.Resource.AllBalancesAtBank();
                                    if (d.bankId != null) {
                                        m.bankId = String(d.bankId);
                                    }
                                    return m;
                                };

                                AllBalancesAtBank.toObject = function toObject(m, o) {
                                    if (!o)
                                        o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        d.bankId = "";
                                    }
                                    if (m.bankId != null && m.hasOwnProperty("bankId")) {
                                        d.bankId = m.bankId;
                                    }
                                    return d;
                                };

                                AllBalancesAtBank.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                                AccountBalance.fromObject = function fromObject(d) {
                                    if (d instanceof $root.io.token.proto.common.token.AccessBody.Resource.AccountBalance)
                                        return d;
                                    var m = new $root.io.token.proto.common.token.AccessBody.Resource.AccountBalance();
                                    if (d.accountId != null) {
                                        m.accountId = String(d.accountId);
                                    }
                                    return m;
                                };

                                AccountBalance.toObject = function toObject(m, o) {
                                    if (!o)
                                        o = {};
                                    var d = {};
                                    if (o.defaults) {
                                        d.accountId = "";
                                    }
                                    if (m.accountId != null && m.hasOwnProperty("accountId")) {
                                        d.accountId = m.accountId;
                                    }
                                    return d;
                                };

                                AccountBalance.prototype.toJSON = function toJSON() {
                                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        TokenOperationResult.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.token.TokenOperationResult)
                                return d;
                            var m = new $root.io.token.proto.common.token.TokenOperationResult();
                            if (d.token != null) {
                                if (typeof d.token !== "object")
                                    throw TypeError(".io.token.proto.common.token.TokenOperationResult.token: object expected");
                                m.token = $root.io.token.proto.common.token.Token.fromObject(d.token);
                            }
                            switch (d.status) {
                            case "INVALID":
                            case 0:
                                m.status = 0;
                                break;
                            case "SUCCESS":
                            case 1:
                                m.status = 1;
                                break;
                            case "MORE_SIGNATURES_NEEDED":
                            case 2:
                                m.status = 2;
                                break;
                            }
                            return m;
                        };

                        TokenOperationResult.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.token = null;
                                d.status = o.enums === String ? "INVALID" : 0;
                            }
                            if (m.token != null && m.hasOwnProperty("token")) {
                                d.token = $root.io.token.proto.common.token.Token.toObject(m.token, o);
                            }
                            if (m.status != null && m.hasOwnProperty("status")) {
                                d.status = o.enums === String ? $root.io.token.proto.common.token.TokenOperationResult.Status[m.status] : m.status;
                            }
                            return d;
                        };

                        TokenOperationResult.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        TokenRequestStatePayload.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.token.TokenRequestStatePayload)
                                return d;
                            var m = new $root.io.token.proto.common.token.TokenRequestStatePayload();
                            if (d.tokenId != null) {
                                m.tokenId = String(d.tokenId);
                            }
                            if (d.state != null) {
                                m.state = String(d.state);
                            }
                            return m;
                        };

                        TokenRequestStatePayload.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.tokenId = "";
                                d.state = "";
                            }
                            if (m.tokenId != null && m.hasOwnProperty("tokenId")) {
                                d.tokenId = m.tokenId;
                            }
                            if (m.state != null && m.hasOwnProperty("state")) {
                                d.state = m.state;
                            }
                            return d;
                        };

                        TokenRequestStatePayload.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return TokenRequestStatePayload;
                    })();

                    return token;
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

                        TransferQuote.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.pricing.TransferQuote)
                                return d;
                            var m = new $root.io.token.proto.common.pricing.TransferQuote();
                            if (d.id != null) {
                                m.id = String(d.id);
                            }
                            if (d.accountCurrency != null) {
                                m.accountCurrency = String(d.accountCurrency);
                            }
                            if (d.feesTotal != null) {
                                m.feesTotal = String(d.feesTotal);
                            }
                            if (d.fees) {
                                if (!Array.isArray(d.fees))
                                    throw TypeError(".io.token.proto.common.pricing.TransferQuote.fees: array expected");
                                m.fees = [];
                                for (var i = 0; i < d.fees.length; ++i) {
                                    if (typeof d.fees[i] !== "object")
                                        throw TypeError(".io.token.proto.common.pricing.TransferQuote.fees: object expected");
                                    m.fees[i] = $root.io.token.proto.common.pricing.TransferQuote.Fee.fromObject(d.fees[i]);
                                }
                            }
                            if (d.rates) {
                                if (!Array.isArray(d.rates))
                                    throw TypeError(".io.token.proto.common.pricing.TransferQuote.rates: array expected");
                                m.rates = [];
                                for (var i = 0; i < d.rates.length; ++i) {
                                    if (typeof d.rates[i] !== "object")
                                        throw TypeError(".io.token.proto.common.pricing.TransferQuote.rates: object expected");
                                    m.rates[i] = $root.io.token.proto.common.pricing.TransferQuote.FxRate.fromObject(d.rates[i]);
                                }
                            }
                            if (d.expiresAtMs != null) {
                                if ($util.Long)
                                    (m.expiresAtMs = $util.Long.fromValue(d.expiresAtMs)).unsigned = false;
                                else if (typeof d.expiresAtMs === "string")
                                    m.expiresAtMs = parseInt(d.expiresAtMs, 10);
                                else if (typeof d.expiresAtMs === "number")
                                    m.expiresAtMs = d.expiresAtMs;
                                else if (typeof d.expiresAtMs === "object")
                                    m.expiresAtMs = new $util.LongBits(d.expiresAtMs.low >>> 0, d.expiresAtMs.high >>> 0).toNumber();
                            }
                            return m;
                        };

                        TransferQuote.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.arrays || o.defaults) {
                                d.fees = [];
                                d.rates = [];
                            }
                            if (o.defaults) {
                                d.id = "";
                                d.accountCurrency = "";
                                d.feesTotal = "";
                                if ($util.Long) {
                                    var n = new $util.Long(0, 0, false);
                                    d.expiresAtMs = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                } else
                                    d.expiresAtMs = o.longs === String ? "0" : 0;
                            }
                            if (m.id != null && m.hasOwnProperty("id")) {
                                d.id = m.id;
                            }
                            if (m.accountCurrency != null && m.hasOwnProperty("accountCurrency")) {
                                d.accountCurrency = m.accountCurrency;
                            }
                            if (m.feesTotal != null && m.hasOwnProperty("feesTotal")) {
                                d.feesTotal = m.feesTotal;
                            }
                            if (m.fees && m.fees.length) {
                                d.fees = [];
                                for (var j = 0; j < m.fees.length; ++j) {
                                    d.fees[j] = $root.io.token.proto.common.pricing.TransferQuote.Fee.toObject(m.fees[j], o);
                                }
                            }
                            if (m.rates && m.rates.length) {
                                d.rates = [];
                                for (var j = 0; j < m.rates.length; ++j) {
                                    d.rates[j] = $root.io.token.proto.common.pricing.TransferQuote.FxRate.toObject(m.rates[j], o);
                                }
                            }
                            if (m.expiresAtMs != null && m.hasOwnProperty("expiresAtMs")) {
                                if (typeof m.expiresAtMs === "number")
                                    d.expiresAtMs = o.longs === String ? String(m.expiresAtMs) : m.expiresAtMs;
                                else
                                    d.expiresAtMs = o.longs === String ? $util.Long.prototype.toString.call(m.expiresAtMs) : o.longs === Number ? new $util.LongBits(m.expiresAtMs.low >>> 0, m.expiresAtMs.high >>> 0).toNumber() : m.expiresAtMs;
                            }
                            return d;
                        };

                        TransferQuote.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            Fee.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.pricing.TransferQuote.Fee)
                                    return d;
                                var m = new $root.io.token.proto.common.pricing.TransferQuote.Fee();
                                if (d.amount != null) {
                                    m.amount = String(d.amount);
                                }
                                if (d.description != null) {
                                    m.description = String(d.description);
                                }
                                return m;
                            };

                            Fee.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (o.defaults) {
                                    d.amount = "";
                                    d.description = "";
                                }
                                if (m.amount != null && m.hasOwnProperty("amount")) {
                                    d.amount = m.amount;
                                }
                                if (m.description != null && m.hasOwnProperty("description")) {
                                    d.description = m.description;
                                }
                                return d;
                            };

                            Fee.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            FxRate.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.pricing.TransferQuote.FxRate)
                                    return d;
                                var m = new $root.io.token.proto.common.pricing.TransferQuote.FxRate();
                                if (d.baseCurrency != null) {
                                    m.baseCurrency = String(d.baseCurrency);
                                }
                                if (d.quoteCurrency != null) {
                                    m.quoteCurrency = String(d.quoteCurrency);
                                }
                                if (d.rate != null) {
                                    m.rate = String(d.rate);
                                }
                                return m;
                            };

                            FxRate.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (o.defaults) {
                                    d.baseCurrency = "";
                                    d.quoteCurrency = "";
                                    d.rate = "";
                                }
                                if (m.baseCurrency != null && m.hasOwnProperty("baseCurrency")) {
                                    d.baseCurrency = m.baseCurrency;
                                }
                                if (m.quoteCurrency != null && m.hasOwnProperty("quoteCurrency")) {
                                    d.quoteCurrency = m.quoteCurrency;
                                }
                                if (m.rate != null && m.hasOwnProperty("rate")) {
                                    d.rate = m.rate;
                                }
                                return d;
                            };

                            FxRate.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        Pricing.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.pricing.Pricing)
                                return d;
                            var m = new $root.io.token.proto.common.pricing.Pricing();
                            if (d.sourceQuote != null) {
                                if (typeof d.sourceQuote !== "object")
                                    throw TypeError(".io.token.proto.common.pricing.Pricing.sourceQuote: object expected");
                                m.sourceQuote = $root.io.token.proto.common.pricing.TransferQuote.fromObject(d.sourceQuote);
                            }
                            if (d.destinationQuote != null) {
                                if (typeof d.destinationQuote !== "object")
                                    throw TypeError(".io.token.proto.common.pricing.Pricing.destinationQuote: object expected");
                                m.destinationQuote = $root.io.token.proto.common.pricing.TransferQuote.fromObject(d.destinationQuote);
                            }
                            if (d.instructions != null) {
                                if (typeof d.instructions !== "object")
                                    throw TypeError(".io.token.proto.common.pricing.Pricing.instructions: object expected");
                                m.instructions = $root.io.token.proto.common.pricing.PricingInstructions.fromObject(d.instructions);
                            }
                            return m;
                        };

                        Pricing.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.sourceQuote = null;
                                d.destinationQuote = null;
                                d.instructions = null;
                            }
                            if (m.sourceQuote != null && m.hasOwnProperty("sourceQuote")) {
                                d.sourceQuote = $root.io.token.proto.common.pricing.TransferQuote.toObject(m.sourceQuote, o);
                            }
                            if (m.destinationQuote != null && m.hasOwnProperty("destinationQuote")) {
                                d.destinationQuote = $root.io.token.proto.common.pricing.TransferQuote.toObject(m.destinationQuote, o);
                            }
                            if (m.instructions != null && m.hasOwnProperty("instructions")) {
                                d.instructions = $root.io.token.proto.common.pricing.PricingInstructions.toObject(m.instructions, o);
                            }
                            return d;
                        };

                        Pricing.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        PricingInstructions.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.pricing.PricingInstructions)
                                return d;
                            var m = new $root.io.token.proto.common.pricing.PricingInstructions();
                            switch (d.feesPaidBy) {
                            case "INVALID_FEE":
                            case 0:
                                m.feesPaidBy = 0;
                                break;
                            case "SOURCE_FEE":
                            case 1:
                                m.feesPaidBy = 1;
                                break;
                            case "DESTINATION_FEE":
                            case 2:
                                m.feesPaidBy = 2;
                                break;
                            case "SHARED_FEE":
                            case 3:
                                m.feesPaidBy = 3;
                                break;
                            }
                            switch (d.fxPerformedBy) {
                            case "INVALID_FX":
                            case 0:
                                m.fxPerformedBy = 0;
                                break;
                            case "SOURCE_FX":
                            case 1:
                                m.fxPerformedBy = 1;
                                break;
                            case "SHARED_FX":
                            case 2:
                                m.fxPerformedBy = 2;
                                break;
                            }
                            return m;
                        };

                        PricingInstructions.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.feesPaidBy = o.enums === String ? "INVALID_FEE" : 0;
                                d.fxPerformedBy = o.enums === String ? "INVALID_FX" : 0;
                            }
                            if (m.feesPaidBy != null && m.hasOwnProperty("feesPaidBy")) {
                                d.feesPaidBy = o.enums === String ? $root.io.token.proto.common.pricing.FeeResponsibility[m.feesPaidBy] : m.feesPaidBy;
                            }
                            if (m.fxPerformedBy != null && m.hasOwnProperty("fxPerformedBy")) {
                                d.fxPerformedBy = o.enums === String ? $root.io.token.proto.common.pricing.FxResponsibility[m.fxPerformedBy] : m.fxPerformedBy;
                            }
                            return d;
                        };

                        PricingInstructions.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return PricingInstructions;
                    })();

                    return pricing;
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

                        Transfer.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.transfer.Transfer)
                                return d;
                            var m = new $root.io.token.proto.common.transfer.Transfer();
                            if (d.id != null) {
                                m.id = String(d.id);
                            }
                            if (d.transactionId != null) {
                                m.transactionId = String(d.transactionId);
                            }
                            if (d.createdAtMs != null) {
                                if ($util.Long)
                                    (m.createdAtMs = $util.Long.fromValue(d.createdAtMs)).unsigned = false;
                                else if (typeof d.createdAtMs === "string")
                                    m.createdAtMs = parseInt(d.createdAtMs, 10);
                                else if (typeof d.createdAtMs === "number")
                                    m.createdAtMs = d.createdAtMs;
                                else if (typeof d.createdAtMs === "object")
                                    m.createdAtMs = new $util.LongBits(d.createdAtMs.low >>> 0, d.createdAtMs.high >>> 0).toNumber();
                            }
                            if (d.payload != null) {
                                if (typeof d.payload !== "object")
                                    throw TypeError(".io.token.proto.common.transfer.Transfer.payload: object expected");
                                m.payload = $root.io.token.proto.common.transfer.TransferPayload.fromObject(d.payload);
                            }
                            if (d.payloadSignatures) {
                                if (!Array.isArray(d.payloadSignatures))
                                    throw TypeError(".io.token.proto.common.transfer.Transfer.payloadSignatures: array expected");
                                m.payloadSignatures = [];
                                for (var i = 0; i < d.payloadSignatures.length; ++i) {
                                    if (typeof d.payloadSignatures[i] !== "object")
                                        throw TypeError(".io.token.proto.common.transfer.Transfer.payloadSignatures: object expected");
                                    m.payloadSignatures[i] = $root.io.token.proto.common.security.Signature.fromObject(d.payloadSignatures[i]);
                                }
                            }
                            switch (d.status) {
                            case "INVALID_STATUS":
                            case 0:
                                m.status = 0;
                                break;
                            case "PENDING":
                            case 1:
                                m.status = 1;
                                break;
                            case "PROCESSING":
                            case 7:
                                m.status = 7;
                                break;
                            case "SUCCESS":
                            case 2:
                                m.status = 2;
                                break;
                            case "PENDING_EXTERNAL_AUTHORIZATION":
                            case 15:
                                m.status = 15;
                                break;
                            case "FAILURE_CANCELED":
                            case 10:
                                m.status = 10;
                                break;
                            case "FAILURE_INSUFFICIENT_FUNDS":
                            case 3:
                                m.status = 3;
                                break;
                            case "FAILURE_INVALID_CURRENCY":
                            case 4:
                                m.status = 4;
                                break;
                            case "FAILURE_PERMISSION_DENIED":
                            case 6:
                                m.status = 6;
                                break;
                            case "FAILURE_QUOTE_EXPIRED":
                            case 11:
                                m.status = 11;
                                break;
                            case "FAILURE_INVALID_AMOUNT":
                            case 12:
                                m.status = 12;
                                break;
                            case "FAILURE_INVALID_QUOTE":
                            case 13:
                                m.status = 13;
                                break;
                            case "FAILURE_EXPIRED":
                            case 14:
                                m.status = 14;
                                break;
                            case "FAILURE_GENERIC":
                            case 5:
                                m.status = 5;
                                break;
                            case "SENT":
                            case 16:
                                m.status = 16;
                                break;
                            }
                            if (d.orderId != null) {
                                m.orderId = String(d.orderId);
                            }
                            switch (d.method) {
                            case "DEFAULT":
                            case 0:
                                m.method = 0;
                                break;
                            case "INSTANT":
                            case 1:
                                m.method = 1;
                                break;
                            }
                            return m;
                        };

                        Transfer.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.arrays || o.defaults) {
                                d.payloadSignatures = [];
                            }
                            if (o.defaults) {
                                d.id = "";
                                d.transactionId = "";
                                if ($util.Long) {
                                    var n = new $util.Long(0, 0, false);
                                    d.createdAtMs = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                } else
                                    d.createdAtMs = o.longs === String ? "0" : 0;
                                d.payload = null;
                                d.status = o.enums === String ? "INVALID_STATUS" : 0;
                                d.orderId = "";
                                d.method = o.enums === String ? "DEFAULT" : 0;
                            }
                            if (m.id != null && m.hasOwnProperty("id")) {
                                d.id = m.id;
                            }
                            if (m.transactionId != null && m.hasOwnProperty("transactionId")) {
                                d.transactionId = m.transactionId;
                            }
                            if (m.createdAtMs != null && m.hasOwnProperty("createdAtMs")) {
                                if (typeof m.createdAtMs === "number")
                                    d.createdAtMs = o.longs === String ? String(m.createdAtMs) : m.createdAtMs;
                                else
                                    d.createdAtMs = o.longs === String ? $util.Long.prototype.toString.call(m.createdAtMs) : o.longs === Number ? new $util.LongBits(m.createdAtMs.low >>> 0, m.createdAtMs.high >>> 0).toNumber() : m.createdAtMs;
                            }
                            if (m.payload != null && m.hasOwnProperty("payload")) {
                                d.payload = $root.io.token.proto.common.transfer.TransferPayload.toObject(m.payload, o);
                            }
                            if (m.payloadSignatures && m.payloadSignatures.length) {
                                d.payloadSignatures = [];
                                for (var j = 0; j < m.payloadSignatures.length; ++j) {
                                    d.payloadSignatures[j] = $root.io.token.proto.common.security.Signature.toObject(m.payloadSignatures[j], o);
                                }
                            }
                            if (m.status != null && m.hasOwnProperty("status")) {
                                d.status = o.enums === String ? $root.io.token.proto.common.transaction.TransactionStatus[m.status] : m.status;
                            }
                            if (m.orderId != null && m.hasOwnProperty("orderId")) {
                                d.orderId = m.orderId;
                            }
                            if (m.method != null && m.hasOwnProperty("method")) {
                                d.method = o.enums === String ? $root.io.token.proto.common.transfer.Transfer.Method[m.method] : m.method;
                            }
                            return d;
                        };

                        Transfer.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        TransferPayload.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.transfer.TransferPayload)
                                return d;
                            var m = new $root.io.token.proto.common.transfer.TransferPayload();
                            if (d.refId != null) {
                                m.refId = String(d.refId);
                            }
                            if (d.tokenId != null) {
                                m.tokenId = String(d.tokenId);
                            }
                            if (d.amount != null) {
                                if (typeof d.amount !== "object")
                                    throw TypeError(".io.token.proto.common.transfer.TransferPayload.amount: object expected");
                                m.amount = $root.io.token.proto.common.money.Money.fromObject(d.amount);
                            }
                            if (d.destinations) {
                                if (!Array.isArray(d.destinations))
                                    throw TypeError(".io.token.proto.common.transfer.TransferPayload.destinations: array expected");
                                m.destinations = [];
                                for (var i = 0; i < d.destinations.length; ++i) {
                                    if (typeof d.destinations[i] !== "object")
                                        throw TypeError(".io.token.proto.common.transfer.TransferPayload.destinations: object expected");
                                    m.destinations[i] = $root.io.token.proto.common.transferinstructions.TransferEndpoint.fromObject(d.destinations[i]);
                                }
                            }
                            if (d.description != null) {
                                m.description = String(d.description);
                            }
                            return m;
                        };

                        TransferPayload.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.arrays || o.defaults) {
                                d.destinations = [];
                            }
                            if (o.defaults) {
                                d.refId = "";
                                d.tokenId = "";
                                d.amount = null;
                                d.description = "";
                            }
                            if (m.refId != null && m.hasOwnProperty("refId")) {
                                d.refId = m.refId;
                            }
                            if (m.tokenId != null && m.hasOwnProperty("tokenId")) {
                                d.tokenId = m.tokenId;
                            }
                            if (m.amount != null && m.hasOwnProperty("amount")) {
                                d.amount = $root.io.token.proto.common.money.Money.toObject(m.amount, o);
                            }
                            if (m.destinations && m.destinations.length) {
                                d.destinations = [];
                                for (var j = 0; j < m.destinations.length; ++j) {
                                    d.destinations[j] = $root.io.token.proto.common.transferinstructions.TransferEndpoint.toObject(m.destinations[j], o);
                                }
                            }
                            if (m.description != null && m.hasOwnProperty("description")) {
                                d.description = m.description;
                            }
                            return d;
                        };

                        TransferPayload.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return TransferPayload;
                    })();

                    return transfer;
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
                        values[valuesById[15] = "PENDING_EXTERNAL_AUTHORIZATION"] = 15;
                        values[valuesById[10] = "FAILURE_CANCELED"] = 10;
                        values[valuesById[3] = "FAILURE_INSUFFICIENT_FUNDS"] = 3;
                        values[valuesById[4] = "FAILURE_INVALID_CURRENCY"] = 4;
                        values[valuesById[6] = "FAILURE_PERMISSION_DENIED"] = 6;
                        values[valuesById[11] = "FAILURE_QUOTE_EXPIRED"] = 11;
                        values[valuesById[12] = "FAILURE_INVALID_AMOUNT"] = 12;
                        values[valuesById[13] = "FAILURE_INVALID_QUOTE"] = 13;
                        values[valuesById[14] = "FAILURE_EXPIRED"] = 14;
                        values[valuesById[5] = "FAILURE_GENERIC"] = 5;
                        values[valuesById[16] = "SENT"] = 16;
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

                        Transaction.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.transaction.Transaction)
                                return d;
                            var m = new $root.io.token.proto.common.transaction.Transaction();
                            if (d.id != null) {
                                m.id = String(d.id);
                            }
                            switch (d.type) {
                            case "INVALID_TYPE":
                            case 0:
                                m.type = 0;
                                break;
                            case "DEBIT":
                            case 1:
                                m.type = 1;
                                break;
                            case "CREDIT":
                            case 2:
                                m.type = 2;
                                break;
                            }
                            switch (d.status) {
                            case "INVALID_STATUS":
                            case 0:
                                m.status = 0;
                                break;
                            case "PENDING":
                            case 1:
                                m.status = 1;
                                break;
                            case "PROCESSING":
                            case 7:
                                m.status = 7;
                                break;
                            case "SUCCESS":
                            case 2:
                                m.status = 2;
                                break;
                            case "PENDING_EXTERNAL_AUTHORIZATION":
                            case 15:
                                m.status = 15;
                                break;
                            case "FAILURE_CANCELED":
                            case 10:
                                m.status = 10;
                                break;
                            case "FAILURE_INSUFFICIENT_FUNDS":
                            case 3:
                                m.status = 3;
                                break;
                            case "FAILURE_INVALID_CURRENCY":
                            case 4:
                                m.status = 4;
                                break;
                            case "FAILURE_PERMISSION_DENIED":
                            case 6:
                                m.status = 6;
                                break;
                            case "FAILURE_QUOTE_EXPIRED":
                            case 11:
                                m.status = 11;
                                break;
                            case "FAILURE_INVALID_AMOUNT":
                            case 12:
                                m.status = 12;
                                break;
                            case "FAILURE_INVALID_QUOTE":
                            case 13:
                                m.status = 13;
                                break;
                            case "FAILURE_EXPIRED":
                            case 14:
                                m.status = 14;
                                break;
                            case "FAILURE_GENERIC":
                            case 5:
                                m.status = 5;
                                break;
                            case "SENT":
                            case 16:
                                m.status = 16;
                                break;
                            }
                            if (d.amount != null) {
                                if (typeof d.amount !== "object")
                                    throw TypeError(".io.token.proto.common.transaction.Transaction.amount: object expected");
                                m.amount = $root.io.token.proto.common.money.Money.fromObject(d.amount);
                            }
                            if (d.description != null) {
                                m.description = String(d.description);
                            }
                            if (d.tokenId != null) {
                                m.tokenId = String(d.tokenId);
                            }
                            if (d.tokenTransferId != null) {
                                m.tokenTransferId = String(d.tokenTransferId);
                            }
                            if (d.createdAtMs != null) {
                                if ($util.Long)
                                    (m.createdAtMs = $util.Long.fromValue(d.createdAtMs)).unsigned = false;
                                else if (typeof d.createdAtMs === "string")
                                    m.createdAtMs = parseInt(d.createdAtMs, 10);
                                else if (typeof d.createdAtMs === "number")
                                    m.createdAtMs = d.createdAtMs;
                                else if (typeof d.createdAtMs === "object")
                                    m.createdAtMs = new $util.LongBits(d.createdAtMs.low >>> 0, d.createdAtMs.high >>> 0).toNumber();
                            }
                            if (d.metadata) {
                                if (typeof d.metadata !== "object")
                                    throw TypeError(".io.token.proto.common.transaction.Transaction.metadata: object expected");
                                m.metadata = {};
                                for (var ks = Object.keys(d.metadata), i = 0; i < ks.length; ++i) {
                                    m.metadata[ks[i]] = String(d.metadata[ks[i]]);
                                }
                            }
                            return m;
                        };

                        Transaction.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.objects || o.defaults) {
                                d.metadata = {};
                            }
                            if (o.defaults) {
                                d.id = "";
                                d.type = o.enums === String ? "INVALID_TYPE" : 0;
                                d.status = o.enums === String ? "INVALID_STATUS" : 0;
                                d.amount = null;
                                d.description = "";
                                d.tokenId = "";
                                d.tokenTransferId = "";
                                if ($util.Long) {
                                    var n = new $util.Long(0, 0, false);
                                    d.createdAtMs = o.longs === String ? n.toString() : o.longs === Number ? n.toNumber() : n;
                                } else
                                    d.createdAtMs = o.longs === String ? "0" : 0;
                            }
                            if (m.id != null && m.hasOwnProperty("id")) {
                                d.id = m.id;
                            }
                            if (m.type != null && m.hasOwnProperty("type")) {
                                d.type = o.enums === String ? $root.io.token.proto.common.transaction.TransactionType[m.type] : m.type;
                            }
                            if (m.status != null && m.hasOwnProperty("status")) {
                                d.status = o.enums === String ? $root.io.token.proto.common.transaction.TransactionStatus[m.status] : m.status;
                            }
                            if (m.amount != null && m.hasOwnProperty("amount")) {
                                d.amount = $root.io.token.proto.common.money.Money.toObject(m.amount, o);
                            }
                            if (m.description != null && m.hasOwnProperty("description")) {
                                d.description = m.description;
                            }
                            if (m.tokenId != null && m.hasOwnProperty("tokenId")) {
                                d.tokenId = m.tokenId;
                            }
                            if (m.tokenTransferId != null && m.hasOwnProperty("tokenTransferId")) {
                                d.tokenTransferId = m.tokenTransferId;
                            }
                            if (m.createdAtMs != null && m.hasOwnProperty("createdAtMs")) {
                                if (typeof m.createdAtMs === "number")
                                    d.createdAtMs = o.longs === String ? String(m.createdAtMs) : m.createdAtMs;
                                else
                                    d.createdAtMs = o.longs === String ? $util.Long.prototype.toString.call(m.createdAtMs) : o.longs === Number ? new $util.LongBits(m.createdAtMs.low >>> 0, m.createdAtMs.high >>> 0).toNumber() : m.createdAtMs;
                            }
                            var ks2;
                            if (m.metadata && (ks2 = Object.keys(m.metadata)).length) {
                                d.metadata = {};
                                for (var j = 0; j < ks2.length; ++j) {
                                    d.metadata[ks2[j]] = m.metadata[ks2[j]];
                                }
                            }
                            return d;
                        };

                        Transaction.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        Balance.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.transaction.Balance)
                                return d;
                            var m = new $root.io.token.proto.common.transaction.Balance();
                            if (d.accountId != null) {
                                m.accountId = String(d.accountId);
                            }
                            if (d.current != null) {
                                if (typeof d.current !== "object")
                                    throw TypeError(".io.token.proto.common.transaction.Balance.current: object expected");
                                m.current = $root.io.token.proto.common.money.Money.fromObject(d.current);
                            }
                            if (d.available != null) {
                                if (typeof d.available !== "object")
                                    throw TypeError(".io.token.proto.common.transaction.Balance.available: object expected");
                                m.available = $root.io.token.proto.common.money.Money.fromObject(d.available);
                            }
                            return m;
                        };

                        Balance.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.accountId = "";
                                d.current = null;
                                d.available = null;
                            }
                            if (m.accountId != null && m.hasOwnProperty("accountId")) {
                                d.accountId = m.accountId;
                            }
                            if (m.current != null && m.hasOwnProperty("current")) {
                                d.current = $root.io.token.proto.common.money.Money.toObject(m.current, o);
                            }
                            if (m.available != null && m.hasOwnProperty("available")) {
                                d.available = $root.io.token.proto.common.money.Money.toObject(m.available, o);
                            }
                            return d;
                        };

                        Balance.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        CustomerData.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.transferinstructions.CustomerData)
                                return d;
                            var m = new $root.io.token.proto.common.transferinstructions.CustomerData();
                            if (d.legalNames) {
                                if (!Array.isArray(d.legalNames))
                                    throw TypeError(".io.token.proto.common.transferinstructions.CustomerData.legalNames: array expected");
                                m.legalNames = [];
                                for (var i = 0; i < d.legalNames.length; ++i) {
                                    m.legalNames[i] = String(d.legalNames[i]);
                                }
                            }
                            if (d.address != null) {
                                if (typeof d.address !== "object")
                                    throw TypeError(".io.token.proto.common.transferinstructions.CustomerData.address: object expected");
                                m.address = $root.io.token.proto.common.address.Address.fromObject(d.address);
                            }
                            return m;
                        };

                        CustomerData.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.arrays || o.defaults) {
                                d.legalNames = [];
                            }
                            if (o.defaults) {
                                d.address = null;
                            }
                            if (m.legalNames && m.legalNames.length) {
                                d.legalNames = [];
                                for (var j = 0; j < m.legalNames.length; ++j) {
                                    d.legalNames[j] = m.legalNames[j];
                                }
                            }
                            if (m.address != null && m.hasOwnProperty("address")) {
                                d.address = $root.io.token.proto.common.address.Address.toObject(m.address, o);
                            }
                            return d;
                        };

                        CustomerData.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        TransferEndpoint.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.transferinstructions.TransferEndpoint)
                                return d;
                            var m = new $root.io.token.proto.common.transferinstructions.TransferEndpoint();
                            if (d.account != null) {
                                if (typeof d.account !== "object")
                                    throw TypeError(".io.token.proto.common.transferinstructions.TransferEndpoint.account: object expected");
                                m.account = $root.io.token.proto.common.account.BankAccount.fromObject(d.account);
                            }
                            if (d.customerData != null) {
                                if (typeof d.customerData !== "object")
                                    throw TypeError(".io.token.proto.common.transferinstructions.TransferEndpoint.customerData: object expected");
                                m.customerData = $root.io.token.proto.common.transferinstructions.CustomerData.fromObject(d.customerData);
                            }
                            return m;
                        };

                        TransferEndpoint.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.defaults) {
                                d.account = null;
                                d.customerData = null;
                            }
                            if (m.account != null && m.hasOwnProperty("account")) {
                                d.account = $root.io.token.proto.common.account.BankAccount.toObject(m.account, o);
                            }
                            if (m.customerData != null && m.hasOwnProperty("customerData")) {
                                d.customerData = $root.io.token.proto.common.transferinstructions.CustomerData.toObject(m.customerData, o);
                            }
                            return d;
                        };

                        TransferEndpoint.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                        TransferInstructions.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.transferinstructions.TransferInstructions)
                                return d;
                            var m = new $root.io.token.proto.common.transferinstructions.TransferInstructions();
                            if (d.source != null) {
                                if (typeof d.source !== "object")
                                    throw TypeError(".io.token.proto.common.transferinstructions.TransferInstructions.source: object expected");
                                m.source = $root.io.token.proto.common.transferinstructions.TransferEndpoint.fromObject(d.source);
                            }
                            if (d.destinations) {
                                if (!Array.isArray(d.destinations))
                                    throw TypeError(".io.token.proto.common.transferinstructions.TransferInstructions.destinations: array expected");
                                m.destinations = [];
                                for (var i = 0; i < d.destinations.length; ++i) {
                                    if (typeof d.destinations[i] !== "object")
                                        throw TypeError(".io.token.proto.common.transferinstructions.TransferInstructions.destinations: object expected");
                                    m.destinations[i] = $root.io.token.proto.common.transferinstructions.TransferEndpoint.fromObject(d.destinations[i]);
                                }
                            }
                            if (d.metadata != null) {
                                if (typeof d.metadata !== "object")
                                    throw TypeError(".io.token.proto.common.transferinstructions.TransferInstructions.metadata: object expected");
                                m.metadata = $root.io.token.proto.common.transferinstructions.TransferInstructions.Metadata.fromObject(d.metadata);
                            }
                            return m;
                        };

                        TransferInstructions.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.arrays || o.defaults) {
                                d.destinations = [];
                            }
                            if (o.defaults) {
                                d.source = null;
                                d.metadata = null;
                            }
                            if (m.source != null && m.hasOwnProperty("source")) {
                                d.source = $root.io.token.proto.common.transferinstructions.TransferEndpoint.toObject(m.source, o);
                            }
                            if (m.destinations && m.destinations.length) {
                                d.destinations = [];
                                for (var j = 0; j < m.destinations.length; ++j) {
                                    d.destinations[j] = $root.io.token.proto.common.transferinstructions.TransferEndpoint.toObject(m.destinations[j], o);
                                }
                            }
                            if (m.metadata != null && m.hasOwnProperty("metadata")) {
                                d.metadata = $root.io.token.proto.common.transferinstructions.TransferInstructions.Metadata.toObject(m.metadata, o);
                            }
                            return d;
                        };

                        TransferInstructions.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                            Metadata.fromObject = function fromObject(d) {
                                if (d instanceof $root.io.token.proto.common.transferinstructions.TransferInstructions.Metadata)
                                    return d;
                                var m = new $root.io.token.proto.common.transferinstructions.TransferInstructions.Metadata();
                                switch (d.transferPurpose) {
                                case "INVALID":
                                case 0:
                                    m.transferPurpose = 0;
                                    break;
                                case "OTHER":
                                case 1:
                                    m.transferPurpose = 1;
                                    break;
                                case "PERSONAL_EXPENSES":
                                case 2:
                                    m.transferPurpose = 2;
                                    break;
                                case "PURCHASE_OF_SHARES":
                                case 3:
                                    m.transferPurpose = 3;
                                    break;
                                case "TRANSFER_TO_YOUR_OWN_ACCOUNT":
                                case 4:
                                    m.transferPurpose = 4;
                                    break;
                                case "PURCHASE_OF_PROPERTY":
                                case 5:
                                    m.transferPurpose = 5;
                                    break;
                                case "FAMILY_MAINTENANCE":
                                case 6:
                                    m.transferPurpose = 6;
                                    break;
                                case "SAVINGS":
                                case 7:
                                    m.transferPurpose = 7;
                                    break;
                                }
                                switch (d.paymentContext) {
                                case "INVALID_CONTEXT":
                                case 0:
                                    m.paymentContext = 0;
                                    break;
                                case "OTHER_CONTEXT":
                                case 1:
                                    m.paymentContext = 1;
                                    break;
                                case "BILL_PAYMENT":
                                case 2:
                                    m.paymentContext = 2;
                                    break;
                                case "ECOMMERCE_GOODS":
                                case 3:
                                    m.paymentContext = 3;
                                    break;
                                case "ECOMMERCE_SERVICES":
                                case 4:
                                    m.paymentContext = 4;
                                    break;
                                case "PERSON_TO_PERSON":
                                case 5:
                                    m.paymentContext = 5;
                                    break;
                                }
                                if (d.merchantCategoryCode != null) {
                                    m.merchantCategoryCode = String(d.merchantCategoryCode);
                                }
                                if (d.merchantCustomerId != null) {
                                    m.merchantCustomerId = String(d.merchantCustomerId);
                                }
                                if (d.deliveryAddress != null) {
                                    if (typeof d.deliveryAddress !== "object")
                                        throw TypeError(".io.token.proto.common.transferinstructions.TransferInstructions.Metadata.deliveryAddress: object expected");
                                    m.deliveryAddress = $root.io.token.proto.common.address.Address.fromObject(d.deliveryAddress);
                                }
                                return m;
                            };

                            Metadata.toObject = function toObject(m, o) {
                                if (!o)
                                    o = {};
                                var d = {};
                                if (o.defaults) {
                                    d.transferPurpose = o.enums === String ? "INVALID" : 0;
                                    d.paymentContext = o.enums === String ? "INVALID_CONTEXT" : 0;
                                    d.merchantCategoryCode = "";
                                    d.merchantCustomerId = "";
                                    d.deliveryAddress = null;
                                }
                                if (m.transferPurpose != null && m.hasOwnProperty("transferPurpose")) {
                                    d.transferPurpose = o.enums === String ? $root.io.token.proto.common.transferinstructions.PurposeOfPayment[m.transferPurpose] : m.transferPurpose;
                                }
                                if (m.paymentContext != null && m.hasOwnProperty("paymentContext")) {
                                    d.paymentContext = o.enums === String ? $root.io.token.proto.common.transferinstructions.PaymentContext[m.paymentContext] : m.paymentContext;
                                }
                                if (m.merchantCategoryCode != null && m.hasOwnProperty("merchantCategoryCode")) {
                                    d.merchantCategoryCode = m.merchantCategoryCode;
                                }
                                if (m.merchantCustomerId != null && m.hasOwnProperty("merchantCustomerId")) {
                                    d.merchantCustomerId = m.merchantCustomerId;
                                }
                                if (m.deliveryAddress != null && m.hasOwnProperty("deliveryAddress")) {
                                    d.deliveryAddress = $root.io.token.proto.common.address.Address.toObject(m.deliveryAddress, o);
                                }
                                return d;
                            };

                            Metadata.prototype.toJSON = function toJSON() {
                                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                            };

                            return Metadata;
                        })();

                        return TransferInstructions;
                    })();

                    return transferinstructions;
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

                        Subscriber.fromObject = function fromObject(d) {
                            if (d instanceof $root.io.token.proto.common.subscriber.Subscriber)
                                return d;
                            var m = new $root.io.token.proto.common.subscriber.Subscriber();
                            if (d.id != null) {
                                m.id = String(d.id);
                            }
                            if (d.handler != null) {
                                m.handler = String(d.handler);
                            }
                            if (d.handlerInstructions) {
                                if (typeof d.handlerInstructions !== "object")
                                    throw TypeError(".io.token.proto.common.subscriber.Subscriber.handlerInstructions: object expected");
                                m.handlerInstructions = {};
                                for (var ks = Object.keys(d.handlerInstructions), i = 0; i < ks.length; ++i) {
                                    m.handlerInstructions[ks[i]] = String(d.handlerInstructions[ks[i]]);
                                }
                            }
                            return m;
                        };

                        Subscriber.toObject = function toObject(m, o) {
                            if (!o)
                                o = {};
                            var d = {};
                            if (o.objects || o.defaults) {
                                d.handlerInstructions = {};
                            }
                            if (o.defaults) {
                                d.id = "";
                                d.handler = "";
                            }
                            if (m.id != null && m.hasOwnProperty("id")) {
                                d.id = m.id;
                            }
                            if (m.handler != null && m.hasOwnProperty("handler")) {
                                d.handler = m.handler;
                            }
                            var ks2;
                            if (m.handlerInstructions && (ks2 = Object.keys(m.handlerInstructions)).length) {
                                d.handlerInstructions = {};
                                for (var j = 0; j < ks2.length; ++j) {
                                    d.handlerInstructions[ks2[j]] = m.handlerInstructions[ks2[j]];
                                }
                            }
                            return d;
                        };

                        Subscriber.prototype.toJSON = function toJSON() {
                            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                        };

                        return Subscriber;
                    })();

                    return subscriber;
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

                    BankAuthorization.fromObject = function fromObject(d) {
                        if (d instanceof $root.io.token.proto.banklink.BankAuthorization)
                            return d;
                        var m = new $root.io.token.proto.banklink.BankAuthorization();
                        if (d.bankId != null) {
                            m.bankId = String(d.bankId);
                        }
                        if (d.accounts) {
                            if (!Array.isArray(d.accounts))
                                throw TypeError(".io.token.proto.banklink.BankAuthorization.accounts: array expected");
                            m.accounts = [];
                            for (var i = 0; i < d.accounts.length; ++i) {
                                if (typeof d.accounts[i] !== "object")
                                    throw TypeError(".io.token.proto.banklink.BankAuthorization.accounts: object expected");
                                m.accounts[i] = $root.io.token.proto.common.security.SealedMessage.fromObject(d.accounts[i]);
                            }
                        }
                        return m;
                    };

                    BankAuthorization.toObject = function toObject(m, o) {
                        if (!o)
                            o = {};
                        var d = {};
                        if (o.arrays || o.defaults) {
                            d.accounts = [];
                        }
                        if (o.defaults) {
                            d.bankId = "";
                        }
                        if (m.bankId != null && m.hasOwnProperty("bankId")) {
                            d.bankId = m.bankId;
                        }
                        if (m.accounts && m.accounts.length) {
                            d.accounts = [];
                            for (var j = 0; j < m.accounts.length; ++j) {
                                d.accounts[j] = $root.io.token.proto.common.security.SealedMessage.toObject(m.accounts[j], o);
                            }
                        }
                        return d;
                    };

                    BankAuthorization.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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

                    OauthBankAuthorization.fromObject = function fromObject(d) {
                        if (d instanceof $root.io.token.proto.banklink.OauthBankAuthorization)
                            return d;
                        var m = new $root.io.token.proto.banklink.OauthBankAuthorization();
                        if (d.bankId != null) {
                            m.bankId = String(d.bankId);
                        }
                        if (d.accessToken != null) {
                            m.accessToken = String(d.accessToken);
                        }
                        return m;
                    };

                    OauthBankAuthorization.toObject = function toObject(m, o) {
                        if (!o)
                            o = {};
                        var d = {};
                        if (o.defaults) {
                            d.bankId = "";
                            d.accessToken = "";
                        }
                        if (m.bankId != null && m.hasOwnProperty("bankId")) {
                            d.bankId = m.bankId;
                        }
                        if (m.accessToken != null && m.hasOwnProperty("accessToken")) {
                            d.accessToken = m.accessToken;
                        }
                        return d;
                    };

                    OauthBankAuthorization.prototype.toJSON = function toJSON() {
                        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
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
