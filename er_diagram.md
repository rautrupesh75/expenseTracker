# Personal Monthly Expense Tracker -- Database ER Diagram

This document contains the Entity Relationship Diagram (ERD) and relational schema specification for the Personal Monthly Expense Tracker.

## 1. Visual Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    EXPENSE_CATEGORY ||--o{ EXPENSE_MASTER : classifies
    EXPENSE_MASTER ||--o{ EXPENSE_PAYMENT : tracks

    EXPENSE_CATEGORY {
        int category_id PK "Auto Increment"
        varchar(100) category_name "Unique name"
        int display_order "Sort weight"
        datetime created_at
        datetime updated_at
    }

    EXPENSE_MASTER {
        bigint expense_id PK "Auto Increment"
        int category_id FK "Nullable, classifies expense"
        varchar(150) expense_name "Name of bill or expense"
        varchar(50) expense_code "Unique slug / identifier"
        enum frequency_type "MONTHLY, BI_MONTHLY, QUARTERLY, etc."
        json applicable_months "Array e.g. [2, 5, 8, 11]"
        varchar(50) payment_channel "WEB, APP, UPI, OFFLINE, NA"
        varchar(1000) payment_url "Direct payment / portal link"
        varchar(100) account_reference "Consumer ID, Card #, Policy #"
        tinyint expected_due_day "Day of month (1-31)"
        decimal estimated_amount "Planned budget benchmark"
        boolean active_flag "Active or Retired"
        varchar(7) valid_from_period "YYYY-MM start boundary"
        varchar(7) valid_to_period "YYYY-MM retirement boundary"
        int display_order "UI sort order"
        datetime created_at
        datetime updated_at
    }

    EXPENSE_PAYMENT {
        bigint payment_id PK "Auto Increment"
        bigint expense_id FK "References EXPENSE_MASTER"
        smallint expense_year "Expense Period Year (e.g., 2026)"
        tinyint expense_month "Expense Period Month (1-12)"
        date payment_date "Actual transaction date"
        decimal amount "Amount in INR (> 0)"
        varchar(100) reference_no "Transaction UTR / Receipt No"
        varchar(500) notes "Optional remarks"
        enum status "PAID, PENDING, SKIPPED"
        datetime created_at
        datetime updated_at
    }
```

---

## 2. Table Specifications and Constraints

### Table: `expense_category`
- **Purpose:** Groups related bills (e.g., Utilities, Insurances, Maintenance, Household).
- **Primary Key:** `category_id` (`INT AUTO_INCREMENT`)
- **Key Constraints:**
  - `category_name`: `VARCHAR(100) NOT NULL UNIQUE`

### Table: `expense_master`
- **Purpose:** Stores configurable expense row metadata, dynamic recurrences, URLs, and payment criteria.
- **Primary Key:** `expense_id` (`BIGINT AUTO_INCREMENT`)
- **Foreign Key:** `category_id` references `expense_category(category_id)` on delete `SET NULL`.
- **Key Constraints & Rules:**
  - `frequency_type`: `ENUM('MONTHLY', 'BI_MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL', 'CUSTOM_MONTHS', 'AD_HOC') NOT NULL`
  - `applicable_months`: Validated JSON array containing month integers ($1 \le m \le 12$).
  - `active_flag`: Defaults to `TRUE`. When set to `FALSE`, the item is omitted from future months.
  - `valid_from_period` / `valid_to_period`: Format `YYYY-MM`. Prevents deleted/retired items from polluting current views while retaining past associations.

### Table: `expense_payment`
- **Purpose:** Transactional ledger of actual payments made.
- **Primary Key:** `payment_id` (`BIGINT AUTO_INCREMENT`)
- **Foreign Key:** `expense_id` references `expense_master(expense_id)` on delete `RESTRICT`.
- **Key Constraints & Rules:**
  - `uq_expense_period`: `UNIQUE KEY (expense_id, expense_year, expense_month)` ensures an expense cannot be paid twice for the same billing period without an explicit edit.
  - `chk_expense_payment_amount`: `CHECK (amount > 0)`
  - `chk_expense_payment_month`: `CHECK (expense_month BETWEEN 1 AND 12)`
  - `idx_period_status`: Composite index on `(expense_year, expense_month, status)` for sub-millisecond monthly total computation.