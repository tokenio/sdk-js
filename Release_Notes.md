# Release 1.0.21
  > What's new in the JavaScript SDK from version 1.0.4 thru 1.0.21 is included in these release notes.

## New Features/Enhancements
The following new features and enhancements are introduced:

- **Support for Future-dated Payments and Standing Orders (recurring payments)**
  > Via the SDK, Token's Connect service now provides the mechanism for PSU's to initiate instructions for a series of payments of a specified amount to a designated payee on a number of future dates or at regularly scheduled intervals (daily, weekly, twice-weekly, monthly, twice-monthly, quarterly, semiannually, or yearly). Standing orders and future-dated payments implement the same workflow with the following highlights:
  > - **Standing Order**
  >   - Creates a new transaction payload in `tokenRequest`
  >   - PSU confirms "Approve Standing Order" based on the standing order payload content displayed
  > - **Future-dated Payment**
  >   - Creates the same transaction payload as a standing order but with a specific execution date
  >   - PSU confirms future-dated payment initiation based on the standing order payload content displayed
   
- **Compulsory eIDAS Validation**
  > Effective 24 Spetember 2019, Token is required under PSD2 rules to validate third-party providers (TPPs) and their service requests on behalf of its PSD2-enabled banks. An initial vaidation check is performed during TTP onboarding to ensure that the TPP is in compliance with respective host-nation business licensing requirements for the TPP's planned service geography and that the TPP is using a legitimate eIDAS certificate issued by a qualified trust service provider (QTSP). Successful validation is required before Token can promote a TPP to production. Thereafter, automated validation checks are performed no less than 4 times per business day (GMT 0700-1800). Validation failure will suspend any subsequent service requests attempted by the TPP until the TPP's certificate or license issue is resolved.
  
- **Support for Bulk Transfers**
  > A bulk transfer is a convenient way for PSUs to make payments to multiple payees at the same time based on a defined payment group specifying all of the pertinent details. The PSU-defined group of payments is then made to multiple creditor accounts from the same debtor account on the same date with the same currency according to the same payment scheme.
  > The major difference between bulk and single transactions is that bulk payments/transfers only need to be authenticated once for the specified payment group, rather than requiring the PSU to authenticate each individual transaction. 
  
- **Support for Confirming Available Funds (CAF)**
  > CAF checks that an account (debit/credit) has sufficient funds available to make a payment. The method for invoking Token's CAF feature differs somewhat between CBPIIs and PISPs.
  > - **Card-based Payment Instrument Issuer (CBPII)** — call the `confirmFunds()` function, specifying the relevant account, amount and currency to receive a boolean indication that sufficient funds are in fact available.
  > - **Payment Information Service Provider (PISP)** — create a standard `TransferTokenRequest` using the `setConfirmFunds()`  before executing the transfer request. Banks that do not support CAF will ignore `setConfirmFunds()`. 
  
