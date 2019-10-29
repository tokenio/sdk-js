# *JavaScript SDK Release Notes*

> If you're upgrading to the latest version of the SDK, here's what's new.

# Release 1.0.21
  > These release notes include the changes incorporated in versions 1.0.4 thru 1.0.21.

## *New Features/Enhancements*
The following new features and enhancements are introduced:

- **Support for Future-dated Payments and Standing Orders (recurring payments)**
  > Via the SDK, Token's Connect service now provides the mechanism for PSU's to initiate instructions for a series of payments of a specified amount to a designated payee on a number of future dates or at regularly scheduled intervals (daily, weekly, twice-weekly, monthly, twice-monthly, quarterly, semiannually, or yearly). Standing orders and future-dated payments implement the same workflow with the following highlights:
  > - **Standing Order**
  >   - Creates a new transaction payload in `tokenRequest` that includes `frequency`, `startDate` and `endDate`
  >   - PSU confirms "Approve Standing Order" based on the standing order payload content displayed
  > - **Future-dated Payment**
  >   - Creates the transaction payload as a standard payment, but adds a specific `executionDate` in the future 
  >   - PSU confirms future-dated payment initiation based on the payload content displayed
   
- **Compulsory eIDAS Validation**
  > Effective 14 Spetember 2019, Token is required under PSD2 rules to validate third-party providers (TPPs) and their service requests on behalf of its PSD2-enabled banks. An initial vaidation check is performed during TTP onboarding to ensure that the TPP is in compliance with respective host-nation business licensing requirements for the TPP's planned service geography and that the TPP is using a legitimate eIDAS certificate issued by a qualified trust service provider (QTSP). Successful validation is required before Token can promote a TPP to production. Thereafter, automated validation checks are performed no less than 4 times per business day (GMT 0700-1800). Validation failure will suspend any subsequent service requests attempted by the TPP until the TPP's certificate or license issue is resolved.
  
- **Support for Bulk Transfers**
  > A bulk transfer is a convenient way for PSUs to make payments to multiple payees at the same time based on a defined payment group specifying all of the pertinent details. The PSU-defined group of payments is then made to multiple creditor accounts from the same debtor account on the same date with the same currency according to the same payment scheme.
  > The major difference between bulk and single transactions is that bulk payments/transfers only need to be authenticated once for the specified payment group, rather than requiring the PSU to authenticate each individual transaction. 
  
- **Support for Confirming Available Funds (CAF)**
  > CAF checks that an account (debit/credit) has sufficient funds available to make a payment. The method for invoking Token's CAF feature differs somewhat between CBPIIs and PISPs.
  > - **Card-based Payment Instrument Issuer (CBPII)** — call the `confirmFunds()` function, specifying the relevant account, amount and currency to receive a boolean indication that sufficient funds are in fact available.
  > - **Payment Information Service Provider (PISP)** — create a standard `TransferTokenRequest` using the `setConfirmFunds()`  before executing the transfer request. Banks that do not support CAF will ignore `setConfirmFunds()`. 
  
- **Augmented permissions (consent) list with support for new endpoints**
  > Additional PSU consent granularity is now implemented via the SDK:
  > - **Account Info**: `ReadAccountsBasic`, `ReadAccountsDetail`
  > - **Balances**: `ReadBalances'
  > - **Beneficiaries**: `ReadBeneficiariesBasic`, `ReadBeneficiariesDetail`
  > - **Direct Debits**: `ReadDirectDebits`
  > - **Offers**: `ReadOffers`
  > - **Party**: `ReadParty`
  > - **Products**: `ReadProducts`
  > - **Scheduled Payments**: `ReadScheduledPaymentsBasic`, `ReadScheduledPaymentsDetail`
  > - **Standing Orders**: `ReadStandingOrdersBasic`, `ReadStandingOrdersDetail`
  > - **Statements**: `ReadStatements Basic`, `ReadStatementsDetail`
  > - **Transactions**: `ReadTransactionsBasic`, `ReadTransactionsCredits`, `ReadTransactionsDebits`, `ReadTransactionsDetail`
  
- **TRUSTED_PARTY signature type removed from the directory service**
  > Replaced by a new `User_And_Realm` signature type that allows an electronic signature from both the user and the the realm owner
    
- **Added `getBanks` filtering to UI customization**
  > By specifying the `bankId` of the PSU-selected bank when creating the token request, you can now filter the banks available to the user and control the bank selection UI. Each bank returned specifies the additional properties it supports:
  >  - `supports_information` – allows retrieval of account information
  >  - `supports_send_payment` – allows payment initiation
  >  - `supports_receive_payment` – allows payments to be received
  >  - `provider` – underlying connectivity type (e.g., Yodlee FinAPI Token)
  >  - `country` – ISO 3166-1 alpha-2 two-letter country code in uppercase
  
## *Deprecations*
Within a major version of the Token SDK, deprecated APIs/methods fall into two types:
  1. functions removed/replaced by another function 
  2. function that, though not removed, cannot be used in precisely the same way as previously (i.e., in a prior version of the SDK).
> **NOTE**: Version numbers consist of three numbers separated by dots. The leftmost number designates a **major** release. The middle number designates a **minor** (yet significant) update to a major release. The rightmost number identifies a notable revision to a minor release of the SDK and is often referred to as a **point release**.

The deprecations listed here encompass the respective changes dating back to the original major version of the SDK and is intended for developers using the most current major version of the SDK. Unless stated otherwise deprecations apply to both asynchronous and synchronous variations of an API call. Developers using a version of the SDK predating the most current major release are encouraged to upgrade to take advantage of the latest capabilities and improvements.

- **`Member`**
  - `createAttachment` is deprecated; Token attachments are no longer supported
  - `redeemToken(... TransferEndpoint destination ...)`; use `redeemToken(... TransferDesitnation destination ...)` instead
  - `getTokenAttachment` is deprecated; Token attachments are no longer supported
  - `createCustomization(Payload logo, Map<String, Sting> colors, String consentText)` now accepts `String name` and `String appName` as well
  
- **`TokenClient`**
  - `getBanks(... Map,<String, Boolean> bank FeaturesMap ...)` is deprecated;
    use `getBanks(... BankFeatures bankFeatures ...)` instead
  - `completeRecoveryWithDefaultRule(String memberId, String verificationId, String code)` now accepts `CryptoEngine cryptoEngine` as well
  - `generateTokenRequestUrl(String requestId, String state)` should now set state on `TokenRequest` builder instead of passing it here
  - `generateTokenRequestUrl(String requestId, String state, String csrfToken)` should now set state and SDRF token on `TokenRequest` builder instead of passing them here
  - `parseTokenRequestCallbackIrl(String callbackUrl)` should now use the method that also takes in `String csrfToken'
  - `parseTokenRequestCallbackParams(Map<String, String. callbackParams)` should now use the method that also takes in `String csrfToken`

- **`TokenRequest (`/`TokenRequestBuilder`/[`Access`/`Transfer`]`TokenRequestBuilder)`**
  - `setProviderMetadata` is renamed to `setProviderTransferMetadata`
  - `addDestination(TransferEndpoint destination)` is deprecated; use `addDestination(TransferDestination destination)` instead

## *Other Changes*
The following additional changes have been incorporated into this release:
  - Visual design fixes to Nav header and footer – corrected font sizes/styles, logo size/color, etc.
