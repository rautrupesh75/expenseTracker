# Personal Monthly Expense Tracker -- Functional & Technical Requirements

## 1. Purpose and Scope

This document defines the functional and technical requirements for a generic, configurable local web application for personal expense and payment tracking.

The application replaces manual spreadsheet tracking with a dynamic browser-based interface backed by a local MySQL relational database. The design eliminates hardcoded row items, fixed URLs, and static frequencies, allowing users to dynamically configure, add, reorder, modify, or deactivate expense rows at runtime without database migrations or code redeployment.

* **Historical Source Workbook:** `OjasBills(1).xls` / `OjasBills.xls`

* **Historical Source Sheet:** `Monthly-expenses` only

* **Scope Boundary:** Individual expense items and payment logs only. Workbook summary/income/withdrawal sections (`SubTotal`, `Grand total`, `Withdrawals`, `Rental income`, `Gross Income`, `Net income`, `Investments`) are strictly excluded from the expense master and transactional imports.

## 2. Core Architecture & Dynamic Principles

1. **Zero Hardcoded Items:** Expense names, categories, payment URLs, channels, and recurrence rules are fully data-driven.

2. **Dynamic Row Management:** Users can add new expense items, modify existing criteria, or soft-delete/retire items without breaking past monthly logs.

3. **Flexible Frequency Engine:** Evaluates recurrence dynamically using frequency types (`MONTHLY`, `BI_MONTHLY`, `QUARTERLY`, `SEMI_ANNUAL`, `ANNUAL`, `CUSTOM_MONTHS`, `AD_HOC`) and integer arrays for applicable calendar months.

4. **Parameterized Payment Channels & Reference Data:** Supports Web links (`WEB`), Mobile Apps (`APP`), Direct UPI (`UPI`), and Offline (`NA`/`OFFLINE`), along with reference identifiers (Consumer numbers, Policy numbers, Card digits) accessible via UI tooltips.

5. **Period-Based Historical Integrity:** Dynamic filtering evaluates `valid_from_period` and `valid_to_period`. Retiring an expense item removes it from future dashboards while preserving past records and historical totals.

## 3. Database Schema Requirements (MySQL)

Recommended database: `personal_expense_tracker`

The application shall run under a dedicated MySQL user account with least-privilege access (`SELECT`, `INSERT`, `UPDATE`, `DELETE`), strictly avoiding MySQL `root` or the system `sys` schema.

### 3.1 Table: `expense_category`

Provides optional grouping and visual organization on the dashboard.

```
CREATE TABLE expense_category (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

```

### 3.2 Table: `expense_master`

Stores dynamic row configurations, recurrence rules, payment criteria, and display metadata.

```
CREATE TABLE expense_master (
    expense_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NULL,
    expense_name VARCHAR(150) NOT NULL,
    expense_code VARCHAR(50) NULL UNIQUE,
    frequency_type ENUM(
        'MONTHLY',
        'BI_MONTHLY',
        'QUARTERLY',
        'SEMI_ANNUAL',
        'ANNUAL',
        'CUSTOM_MONTHS',
        'AD_HOC'
    ) NOT NULL DEFAULT 'MONTHLY',
    applicable_months JSON NULL COMMENT 'Array of calendar month numbers [1..12]',
    payment_channel VARCHAR(50) NOT NULL DEFAULT 'NA' COMMENT 'WEB, APP, UPI, OFFLINE, NA',
    payment_url VARCHAR(1000) NULL,
    account_reference VARCHAR(100) NULL COMMENT 'Consumer ID, Policy No, Card digits',
    expected_due_day TINYINT NULL COMMENT 'Expected due day of month (1-31)',
    estimated_amount DECIMAL(12,2) NULL COMMENT 'Budget benchmark amount',
    active_flag BOOLEAN NOT NULL DEFAULT TRUE,
    valid_from_period VARCHAR(7) NULL COMMENT 'YYYY-MM; row hidden prior to this period',
    valid_to_period VARCHAR(7) NULL COMMENT 'YYYY-MM; row retired after this period',
    display_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_expense_category FOREIGN KEY (category_id) REFERENCES expense_category(category_id) ON DELETE SET NULL
);

```

### 3.3 Table: `expense_payment`

Maintains normalized monthly transaction records.

```
CREATE TABLE expense_payment (
    payment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    expense_id BIGINT NOT NULL,
    expense_year SMALLINT NOT NULL,
    expense_month TINYINT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    reference_no VARCHAR(100) NULL COMMENT 'Transaction ID, UTR, or Receipt No',
    notes VARCHAR(500) NULL,
    status ENUM('PAID', 'PENDING', 'SKIPPED') NOT NULL DEFAULT 'PAID',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_expense_payment_expense FOREIGN KEY (expense_id) REFERENCES expense_master(expense_id),
    CONSTRAINT chk_expense_payment_amount CHECK (amount > 0),
    CONSTRAINT chk_expense_payment_month CHECK (expense_month BETWEEN 1 AND 12),
    UNIQUE KEY uq_expense_period (expense_id, expense_year, expense_month)
);

```

## 4. Functional Requirements

### FR-001 -- Dynamic Monthly Dashboard

* Provide a single-page responsive dashboard showing all expenses applicable to the selected month and year.

* Columns: Expense Name, Category, Frequency, Channel/Payment Link, Amount Paid (INR), Payment Date, Status (`PAID`, `PENDING`, `SKIPPED`), and Actions (`Save`, `Edit`, `Skip`).

* Render total monthly expenses at the bottom, computed strictly from database records.

### FR-002 -- Month & Period Navigation

* Month navigation controls: `[ < ] Month YYYY [ > ]`, defaulting to the current calendar month.

* Changing the month dynamically queries and renders only the items active and due in that period.

### FR-003 -- Dynamic Recurrence & Period Evaluator

For a selected year ($Y$) and month ($M$):

1. Include items where `active_flag = TRUE`.

2. Ensure $Y\text{-}M$ falls within `[valid_from_period, valid_to_period]`.

3. Filter by frequency rule:

   * `MONTHLY`: Include for months 1 through 12.

   * `QUARTERLY`, `SEMI_ANNUAL`, `ANNUAL`, `CUSTOM_MONTHS`: Include if $M \in \text{applicable\_months}$.

   * `AD_HOC`: Include if an explicit transaction already exists for $(Y, M)$ or if the user manually adds an ad-hoc row for that month.

### FR-004 -- Dynamic Item Management (Admin CRUD)

* **Create:** Add new expense items with custom frequencies, URLs, channels, and accounts.

* **Update:** Edit names, target URLs, channels, and month sets.

* **Deactivate/Soft Delete:** Retiring an item sets `active_flag = FALSE` and `valid_to_period = YYYY-MM`. Past payments remain unaltered.

* **Reorder:** Update numeric display order to customize visual grouping.

### FR-005 -- Payment Actions and Deep Linking

* If `payment_channel = 'WEB'` and `payment_url` is present, display a `[Pay]` action opening the URL in a new browser tab with `rel="noopener noreferrer"`.

* If `payment_channel = 'APP'`, display the application name badge (e.g., `MyGate App`).

* If `payment_channel = 'NA'` or `'OFFLINE'`, show an offline badge; do not render broken links.

* Render account reference numbers (e.g., consumer number, credit card last 4 digits) with a quick one-click copy button.

### FR-006 -- Amount and Date Entry

* Validate positive decimal amounts (`DECIMAL(12,2)`).

* Provide a standard date picker for the actual payment date.

* Default payment date to current date when entering new payments.

### FR-007 -- Monthly Expense Aggregation

* Compute monthly total via:

  ```
  SELECT COALESCE(SUM(amount), 0) AS monthly_total
  FROM expense_payment
  WHERE expense_year = ? AND expense_month = ? AND status = 'PAID';
  
  ```

* Updating any row updates the displayed total in real time.

## 5. Initial Seed Catalog (43 Items from Workbook)

The 43 rows identified from the `Monthly-expenses` sheet are seeded into `expense_master` as initial configurations:

| **#** | **Expense Name** | **Frequency Type** | **Applicable Months** | **Channel** | **URL / Payment Reference** | 
| 1 | TATA CC | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | WEB | `https://www.tatacard.com/creditcards/app/user/login` | 
| 2 | HDFC CC | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | WEB | `https://www.hdfc.bank.in/ways-to-bank/digital-banking/online-banking/netbanking` | 
| 3 | Gpay | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | APP | Google Pay | 
| 4 | Phone / data bill | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | WEB | `https://www.hdfc.bank.in/ways-to-bank/digital-banking/online-banking/netbanking` | 
| 5 | Lodha power bill | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | NA | NA | 
| 6 | SK home power bill | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | WEB | `https://onlinesbi.sbi.bank.in/` | 
| 7 | Ojas power | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | WEB | `https://www.adanione.com/bill-payment` | 
| 8 | SK MGL | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | WEB | `https://onlinesbi.sbi.bank.in/` | 
| 9 | Ojas MGL | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | NA | NA | 
| 10 | Lodha FDS CMS | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | APP | MyGate App | 
| 11 | SK Maintanance | `QUARTERLY` | `[2, 5, 8, 11]` | WEB | `https://onlinesbi.sbi.bank.in/` | 
| 12 | Ojas Maintanance | `QUARTERLY` | `[2, 5, 8, 11]` | WEB | `https://onlinesbi.sbi.bank.in/` | 
| 13 | Lodha Maintanance | `QUARTERLY` | `[2, 5, 8, 11]` | APP | MyGate App | 
| 14 | SK Property tax | `CUSTOM_MONTHS` | `[8, 9]` | WEB | `https://ptaxportal.mcgm.gov.in/CitizenPortal/#/login` | 
| 15 | Ojas Property tax | `CUSTOM_MONTHS` | `[8, 9]` | WEB | `https://ptaxportal.mcgm.gov.in/CitizenPortal/#/login` | 
| 16 | Lodha Property tax | `CUSTOM_MONTHS` | `[8, 9]` | WEB | `https://kdmc.gov.in/kdmc/CitizenHome.html` | 
| 17 | Food card | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | NA | NA | 
| 18 | Sakshi PM | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | NA | NA | 
| 19 | Pratham Pocket money | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | NA | NA | 
| 20 | Jeetu sir | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | NA | NA | 
| 21 | Avnish sir | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | NA | NA | 
| 22 | Aniket sir | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | NA | NA | 
| 23 | Misc | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | NA | NA | 
| 24 | MF -- SIP | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | NA | NA | 
| 25 | HDFC Premium 1 | `ANNUAL` | `[4]` | NA | NA | 
| 26 | HDFC Premium 2 | `ANNUAL` | `[12]` | NA | NA | 
| 27 | LIC Premium 1 | `AD_HOC` | `[]` | NA | NA | 
| 28 | HSBC Insurance | `ANNUAL` | `[3]` | NA | NA | 
| 29 | LIC Premium 2 | `ANNUAL` | `[7]` | NA | NA | 
| 30 | LIC Premium 3 | `ANNUAL` | `[9]` | NA | NA | 
| 31 | Pulsar Insurance | `ANNUAL` | `[5]` | NA | NA | 
| 32 | Activa Insurance | `ANNUAL` | `[6]` | NA | NA | 
| 33 | Car Insurance | `ANNUAL` | `[8]` | NA | NA | 
| 34 | PPF - Rupesh | `ANNUAL` | `[1]` | NA | NA | 
| 35 | PPF - Pratika | `ANNUAL` | `[2]` | NA | NA | 
| 36 | PPF - Sakshi | `ANNUAL` | `[3]` | NA | NA | 
| 37 | PPF - Pratham | `ANNUAL` | `[3]` | NA | NA | 
| 38 | Sakshi fees | `AD_HOC` | `[]` | NA | NA | 
| 39 | Pratham fees | `SEMI_ANNUAL` | `[7, 12]` | NA | NA | 
| 40 | Phone claim | `AD_HOC` | `[]` | NA | NA | 
| 41 | Data claim | `AD_HOC` | `[]` | NA | NA | 
| 42 | SK power bill | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | WEB | `https://pgi.billdesk.com/pgidsk/pgmerc/tatapwr/TATAPWRDetails.jsp` | 
| 43 | SK BMC Water | `MONTHLY` | `[1,2,3,4,5,6,7,8,9,10,11,12]` | WEB | `https://aquaptax.mcgm.gov.in/aqua/CitizenHome.html` | 

## 6. One-Time Historical Data Import Utility

The application includes an automated migration utility that reads the historical `Monthly-expenses` sheet:

1. Matches row headers with `expense_master` records.

2. Iterates horizontally across month/year column pairs (e.g., `Jul-26 Amt`, `Jul-26 Dt`).

3. Normalizes non-empty date and amount pairs into rows in `expense_payment`.

4. Ignores empty/unpaid periods.

5. Ignores summary/subtotal/income/investment rows.

6. Employs `INSERT ... ON DUPLICATE KEY UPDATE` to ensure idempotency.

## 7. Non-Functional & Security Requirements

* **Security:** Zero credential storage for banking pins, CVVs, passwords, or OTPs. No direct MySQL exposure to web clients.

* **Local Isolation:** All APIs and databases run on `localhost` (`127.0.0.1`).

* **Configuration:** Database credentials loaded strictly from local `.env` variables.

* **Data Integrity:** Foreign keys and unique constraints guarantee that an expense cannot have duplicate conflicting payments for the same period.