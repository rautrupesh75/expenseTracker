# Personal Monthly Expense Tracker -- Functional Requirements

## 1. Purpose and Scope

This document defines the functional requirements for a simple local web
application for personal expense/payment tracking.

**Source workbook:** `OjasBills(1).xls`\
**Source sheet:** `Monthly-expenses` only.

No other worksheet in the workbook shall be used for the initial
requirements, expense master, or historical import.

The `Monthly-expenses` sheet contains expense rows followed by
summary/income/withdrawal sections. Only the individual expense rows are
in scope; rows such as `SubTotal`, `Grand total`, `Withdrawals`,
`Rental income`, `Gross Income`, `Net income`, and `Investments` are not
expense master records.

## 2. Objective

The application shall replace the manual monthly tracking process with a
simple browser-based interface where the user can:

-   select a month/year;
-   view expenses applicable to that month;
-   enter amount paid and actual payment date;
-   open a configured payment website/app;
-   save payment details into local MySQL;
-   view Paid/Pending status;
-   edit previously saved payments; and
-   see the total monthly expenses at the bottom of the page.

## 3. Existing Workbook Pattern

The `Monthly-expenses` sheet stores historical data horizontally as
repeating **payment date + amount** pairs for each expense and month.
Blank pairs mean that no payment was recorded for that period.

The application shall normalize this structure into database records
such as:

``` text
Expense       Expense Period   Payment Date   Amount
TATA CC       2026-07          2026-07-19     9351.00
TATA CC       2026-08          2026-08-15     5597.00
TATA CC       2026-09          2026-09-19     5551.00
```

## 4. Functional Requirements

### FR-001 -- Monthly Dashboard

Provide one primary dashboard containing:

  ---------------------------------------------------------------------------------
  Expense   Frequency   Payment         Amount Payment   Status         Action
                        Link                   Date                     
  --------- ----------- --------- ------------ --------- -------------- -----------
  TATA CC   Monthly     Pay                  ₹ Date      Paid/Pending   Save/Edit

  ---------------------------------------------------------------------------------

The dashboard shall show the selected month/year and the total monthly
expenses at the bottom.

### FR-002 -- Month Selection

Provide month/year navigation, e.g. `[ < ] September 2026 [ > ]`.
Default to the current month. Changing the month refreshes applicable
expenses, payment records, statuses, and total.

### FR-003 -- Expense Master

Each expense shall have a configurable master record with at least:

-   `expense_id`
-   `expense_name`
-   `frequency_type`
-   `applicable_months`
-   `payment_url`
-   `payment_channel`
-   `active_flag`
-   `display_order`
-   `created_at`
-   `updated_at`

### FR-004 -- Amount Input

The user shall enter the amount paid. Only positive numeric INR amounts
shall be accepted. Recommended MySQL type: `DECIMAL(12,2)`.

### FR-005 -- Payment Date

The user shall select the actual payment date using a date picker. Store
it as `DATE`. The selected month represents the **expense period**,
while payment date represents the actual payment date.

### FR-006 -- Save/Edit Payment

Save shall validate the expense, amount, payment date and period,
persist the record, refresh status and recalculate the monthly total.
Existing records shall be editable rather than unintentionally
duplicated.

### FR-007 -- Payment Status

For the initial version:

-   valid saved payment for the expense/period = `PAID`
-   no saved payment = `PENDING`

Optional future statuses: `PARTIALLY PAID`, `NOT APPLICABLE`, `SKIPPED`.

### FR-008 -- Payment Links

Where a URL is supplied, show a `Pay` action and open it in a new
browser tab/window. For `NA`, do not show a payment link. For
`MyGate App`, show `MyGate App` as the payment channel; do not invent a
URL.

The application shall not automate bank login, OTP, PIN, CVV, password
entry, or payment submission.

## 5. Initial Expense Master

The following 43 expense rows are in scope, based on the
`Monthly-expenses` sheet and the frequencies/payment URLs supplied for
the application:

  -----------------------------------------------------------------------------------------------------------------------------------------
                     \# Expense          Frequency /      Payment URL / Channel
                                         Applicable       
                                         Months           
  --------------------- ---------------- ---------------- ---------------------------------------------------------------------------------
                      1 TATA CC          Monthly          https://www.tatacard.com/creditcards/app/user/login

                      2 HDFC CC          Monthly          https://www.hdfc.bank.in/ways-to-bank/digital-banking/online-banking/netbanking

                      3 Gpay             Monthly          NA

                      4 Phone / data     Monthly          https://www.hdfc.bank.in/ways-to-bank/digital-banking/online-banking/netbanking
                        bill                              

                      5 Lodha power bill Monthly          NA

                      6 SK home power    Monthly          https://onlinesbi.sbi.bank.in/
                        bill                              

                      7 Ojas power       Monthly          https://www.adanione.com/bill-payment

                      8 SK MGL           Monthly          https://onlinesbi.sbi.bank.in/

                      9 Ojas MGL         Monthly          NA

                     10 Lodha FDS CMS    Monthly          MyGate App

                     11 SK Maintanance   February, May,   https://onlinesbi.sbi.bank.in/
                                         August, November 

                     12 Ojas Maintanance February, May,   https://onlinesbi.sbi.bank.in/
                                         August, November 

                     13 Lodha            February, May,   MyGate App
                        Maintanance      August, November 

                     14 SK Property tax  August /         https://ptaxportal.mcgm.gov.in/CitizenPortal/#/login
                                         September        

                     15 Ojas Property    August /         https://ptaxportal.mcgm.gov.in/CitizenPortal/#/login
                        tax              September        

                     16 Lodha Property   August /         https://kdmc.gov.in/kdmc/CitizenHome.html
                        tax              September        

                     17 Food card        Monthly          NA

                     18 Sakshi PM        Monthly          NA

                     19 Pratham Pocket   Monthly          NA
                        money                             

                     20 Jeetu sir        Monthly          NA

                     21 Avnish sir       Monthly          NA

                     22 Aniket sir       Monthly          NA

                     23 Misc             Monthly          NA

                     24 MF -- SIP        Monthly          NA

                     25 HDFC Premium 1   April            NA

                     26 HDFC Premium 2   December         NA

                     27 LIC Premium 1    Not specified    NA

                     28 HSBC Insurance   March            NA

                     29 LIC Premium 2    July             NA

                     30 LIC Premium 3    September        NA

                     31 Pulsar Insurance May              NA

                     32 Activa Insurance June             NA

                     33 Car Insurance    August           NA

                     34 PPF - Rupesh     January          NA

                     35 PPF - Pratika    February         NA

                     36 PPF - Sakshi     March            NA

                     37 PPF - Pratham    March            NA

                     38 Sakshi fees      Not specified    NA

                     39 Pratham fees     July & December  NA

                     40 Phone claim      Not specified    NA

                     41 Data claim       Not specified    NA

                     42 SK power bill    Monthly          https://pgi.billdesk.com/pgidsk/pgmerc/tatapwr/TATAPWRDetails.jsp

                     43 SK BMC Water     Monthly          https://aquaptax.mcgm.gov.in/aqua/CitizenHome.html
  -----------------------------------------------------------------------------------------------------------------------------------------

> The supplied spelling `Maintanance` is retained in the requirements.
> UI spelling may be corrected later without changing the underlying
> logical record.

> `LIC Premium 1`, `Sakshi fees`, `Phone claim`, and `Data claim` have
> no specified frequency in the supplied requirements. They must not be
> assumed to be monthly; their frequency should remain configurable.

## 6. Frequency Rules

### Monthly

The following shall appear every month: TATA CC, HDFC CC, Gpay, Phone /
data bill, Lodha power bill, SK home power bill, Ojas power, SK MGL,
Ojas MGL, Lodha FDS CMS, Food card, Sakshi PM, Pratham Pocket money,
Jeetu sir, Avnish sir, Aniket sir, Misc, MF -- SIP, SK power bill, SK
BMC Water.

### February / May / August / November

-   SK Maintanance
-   Ojas Maintanance
-   Lodha Maintanance

### August / September

-   SK Property tax
-   Ojas Property tax
-   Lodha Property tax

### Specific months

  Expense            Month(s)
  ------------------ ----------------
  HDFC Premium 1     April
  HDFC Premium 2     December
  HSBC Insurance     March
  LIC Premium 2      July
  LIC Premium 3      September
  Pulsar Insurance   May
  Activa Insurance   June
  Car Insurance      August
  PPF - Rupesh       January
  PPF - Pratika      February
  PPF - Sakshi       March
  PPF - Pratham      March
  Pratham fees       July, December

## 7. MySQL Requirements

### FR-009 -- Local MySQL

The backend shall use a locally running MySQL server.

Recommended application database:

``` text
personal_expense_tracker
```

The web application shall **not** use the MySQL `root` account at
runtime. Create a dedicated application user with only required
permissions.

The MySQL `sys` schema is a system schema and shall not be used to store
application expense data. Application tables must reside in the
dedicated application database/schema.

### FR-010 -- `expense_master`

Recommended structure:

``` sql
CREATE TABLE expense_master (
    expense_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    expense_name VARCHAR(150) NOT NULL,
    frequency_type VARCHAR(30) NOT NULL,
    applicable_months JSON NULL,
    payment_url VARCHAR(1000) NULL,
    payment_channel VARCHAR(50) NOT NULL DEFAULT 'NA',
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### FR-011 -- `expense_payment`

Recommended structure:

``` sql
CREATE TABLE expense_payment (
    payment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    expense_id BIGINT NOT NULL,
    expense_year SMALLINT NOT NULL,
    expense_month TINYINT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    notes VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_expense_payment_expense
        FOREIGN KEY (expense_id) REFERENCES expense_master(expense_id),
    CONSTRAINT chk_expense_payment_amount CHECK (amount > 0),
    CONSTRAINT chk_expense_payment_month CHECK (expense_month BETWEEN 1 AND 12)
);
```

Create an index on `(expense_id, expense_year, expense_month)`. If an
expense is limited to one payment per period, enforce an appropriate
unique constraint.

## 8. Monthly Total

### FR-012 -- Total Monthly Expenses

The mandatory total shall be calculated from saved payment records for
the selected expense period:

``` sql
SELECT COALESCE(SUM(amount), 0) AS monthly_total
FROM expense_payment
WHERE expense_year = ?
  AND expense_month = ?;
```

Display it at the bottom of the page, for example:

``` text
---------------------------------------------
Total Monthly Expenses: ₹304,929.00
---------------------------------------------
```

The total must come from the database, not from an independently
maintained front-end value.

## 9. Historical Data Import

### FR-013 -- Import `Monthly-expenses`

Provide a one-time import utility that reads **only**
`Monthly-expenses`.

The importer shall:

1.  identify expense rows;
2.  identify monthly date/amount pairs;
3.  normalize them into `expense_payment` records;
4.  preserve actual payment dates and amounts;
5.  skip blank date/amount pairs;
6.  skip subtotal/summary/income/withdrawal rows;
7.  avoid duplicate records if the import is rerun; and
8.  produce an import summary.

Suggested summary:

``` text
Import completed
Expense master records: XX
Payment records imported: XXX
Blank records skipped: XXX
Summary rows skipped: XX
Duplicates skipped: XX
Errors: 0
```

## 10. Suggested API

A lightweight REST API may expose:

``` text
GET    /api/expenses
GET    /api/expenses?year=2026&month=9
GET    /api/payments?year=2026&month=9
POST   /api/payments
PUT    /api/payments/{payment_id}
DELETE /api/payments/{payment_id}
GET    /api/monthly-total?year=2026&month=9
```

Technology choice is implementation-specific. Suitable local options
include Python/FastAPI, Python/Flask, Node.js/Express, or Java/Spring
Boot.

## 11. User Interface

Recommended dashboard:

``` text
========================================================
              PERSONAL EXPENSE TRACKER
========================================================

             [ < ] September 2026 [ > ]

--------------------------------------------------------
Expense             Frequency       Payment     Status
--------------------------------------------------------
TATA CC             Monthly         [Pay]       Paid
Amount [ 5551.00 ]  Date [19-09-2026]             [Edit]

HDFC CC             Monthly         [Pay]       Pending
Amount [          ]  Date [          ]             [Save]

...
--------------------------------------------------------
             TOTAL MONTHLY EXPENSES
                  ₹ XXX,XXX.XX
--------------------------------------------------------
```

The interface should be desktop-friendly but responsive enough for
personal mobile use.

## 12. Validation and Error Handling

The backend shall validate:

-   valid expense ID;
-   positive amount;
-   valid payment date;
-   valid year/month;
-   applicable expense period; and
-   duplicate payment rules.

User-friendly errors shall be shown for save failures, invalid input,
duplicate payments, and database connectivity failures. Raw SQL/database
errors must not be exposed.

Use parameterized SQL/prepared statements.

## 13. Security

The application is intended for local personal use. Recommended
architecture:

``` text
Browser
   |
   v
Web Frontend
   |
   v
Backend API
   |
   v
Local MySQL
```

The browser must never connect directly to MySQL.

Database credentials shall not be hard-coded in source code. Use
environment variables/local configuration, e.g.:

``` text
DB_HOST=localhost
DB_PORT=3306
DB_NAME=personal_expense_tracker
DB_USER=expense_app
DB_PASSWORD=<local-secret>
```

The application shall never store bank passwords, OTPs, PINs or CVVs.

## 14. Optional/Recommended Features

-   Expense search/filter.
-   Sort by expense, amount, payment date or status.
-   Notes field.
-   Paid/Pending counters.
-   Historical month navigation.
-   Yearly expense summary.
-   CSV/Excel export.
-   Database backup using `mysqldump`.
-   Configurable reminders for pending payments.

Filtering must not change the monthly total: the total represents the
complete selected month, not only filtered rows.

## 15. Acceptance Criteria

The first version is functionally complete when:

-   [ ] Only `Monthly-expenses` is used as the workbook source.
-   [ ] The 43 in-scope expense items are available in the master.
-   [ ] User can select month/year.
-   [ ] Monthly expenses appear every month.
-   [ ] Maintenance expenses appear in Feb/May/Aug/Nov.
-   [ ] Property-tax expenses appear in Aug/Sep.
-   [ ] Specific annual expenses appear in configured months.
-   [ ] User can enter amount.
-   [ ] User can enter payment date.
-   [ ] User can open configured payment links.
-   [ ] `NA` items do not display a payment URL.
-   [ ] Payment can be saved to local MySQL.
-   [ ] Payment can be edited.
-   [ ] Paid/Pending status is displayed.
-   [ ] Monthly total is displayed at the bottom.
-   [ ] Monthly total is calculated from MySQL records.
-   [ ] Historical `Monthly-expenses` data can be imported.
-   [ ] Summary/income/withdrawal rows are not imported as expenses.
-   [ ] Application does not use MySQL `root` for runtime access.
-   [ ] Application does not store expense data in the MySQL `sys`
    schema.

## 16. Out of Scope

The first version shall not include:

-   automatic bank/credit-card login;
-   OTP/PIN/CVV/password handling;
-   automatic payment submission;
-   online banking API integrations;
-   cloud deployment;
-   public internet exposure;
-   multi-user authentication;
-   investment/income/rental/withdrawal tracking; or
-   data from any worksheet other than `Monthly-expenses`.

## 17. End-to-End Workflow

``` text
Select Month/Year
       ↓
Load Applicable Expenses
       ↓
Open Payment Link (if required)
       ↓
Enter Amount
       ↓
Enter Payment Date
       ↓
Save
       ↓
Validate
       ↓
Store in MySQL
       ↓
Mark Paid
       ↓
Recalculate Monthly Total
       ↓
Display Total at Bottom
```

## 18. Final Requirement

The deliverable shall be a simple, maintainable, local personal expense
tracker that converts the manually maintained `Monthly-expenses`
worksheet into a normalized MySQL-backed web application. Expense
frequency, payment URLs, and applicable months should be data-driven
through the expense master rather than scattered hard-coded logic.
