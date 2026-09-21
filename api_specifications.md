# Personal Monthly Expense Tracker API

This document describes the API currently implemented in `backend/main.py`.
The API is local-only and is consumed by the React frontend through the Vite
proxy.

## Runtime

- Backend: FastAPI on `http://127.0.0.1:8000`
- Frontend proxy: `http://localhost:3000/api/*` -> backend `/api/*`
- Database: MySQL database from `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and
  `DB_PASSWORD`; defaults are `127.0.0.1`, `3307`, `personal_expense_tracker`,
  `expense_app`, and `expense_secret`.
- Authentication is currently a demo login, not production authentication.

## Endpoints

### `POST /api/login`

Request:

```json
{"username":"admin","password":"password123"}
```

Successful response (`200`):

```json
{"token":"mock-jwt-token-xyz-123","username":"admin","role":"OWNER"}
```

Invalid credentials return `401`. The token is not currently required by the
other endpoints.

### `GET /api/dashboard?year={year}&month={month}`

Returns active expense rows applicable to the requested period, matching
payments by `expense_id`, `expense_year`, and `expense_month`.

```json
{
  "year": 2026,
  "month": 9,
  "monthly_total": 26444.0,
  "items": [
    {
      "expense_id": 1,
      "category_id": 1,
      "category_name": "Credit Cards",
      "expense_name": "TATA CC",
      "frequency_type": "MONTHLY",
      "applicable_months": [1, 2, 3],
      "payment_channel": "WEB",
      "payment_url": "https://example.test/pay",
      "account_reference": "Card ending 4812",
      "expected_due_day": 19,
      "estimated_amount": null,
      "payment_id": 10,
      "payment_date": "2026-09-19",
      "amount": 5551.0,
      "status": "PAID",
      "notes": null
    }
  ]
}
```

Recurrence behavior implemented by the backend:

- `MONTHLY`: included for every month.
- `BI_MONTHLY`, `QUARTERLY`, `SEMI_ANNUAL`, `ANNUAL`, and `CUSTOM_MONTHS`:
  included when the requested month is in `applicable_months`.
- `AD_HOC`: included only when a payment exists for the requested period.
- `active_flag = TRUE`: required. `valid_from_period` and `valid_to_period`
  are stored in the schema but are not yet applied by this query.

The monthly total includes only rows whose payment status is `PAID`.

### `POST /api/payments`

Creates or updates one payment for an expense period. The database unique key
`(expense_id, expense_year, expense_month)` makes this an upsert.

Request:

```json
{
  "expense_id": 1,
  "expense_year": 2026,
  "expense_month": 9,
  "payment_date": "2026-09-19",
  "amount": 5551.0,
  "reference_no": "UTR-123",
  "notes": "Paid from salary account"
}
```

Successful response (`200`):

```json
{"status":"success","monthly_total":26444.0}
```

The endpoint writes status `PAID`. Positive amount and date validation is
currently performed by the frontend and database constraints; API-level
Pydantic validation for ranges and date format is still recommended.

### `POST /api/master/expenses`

Creates a configurable expense row.

```json
{
  "category_id": null,
  "expense_name": "Broadband",
  "expense_code": null,
  "frequency_type": "MONTHLY",
  "applicable_months": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  "payment_channel": "WEB",
  "payment_url": "https://example.test/pay",
  "account_reference": "Account reference",
  "expected_due_day": 15,
  "estimated_amount": null,
  "display_order": 0
}
```

Successful response (`200`):

```json
{"status":"success","expense_id":44}
```

The current UI exposes this as “Configure Row”. Its form currently sends a
new row with a default monthly month set; full frequency/month editing is not
yet exposed in the UI.

### `DELETE /api/master/expenses/{expense_id}`

Sets `active_flag = FALSE` and returns:

```json
{"status":"success","message":"Expense item deactivated"}
```

This is a soft deactivation. Existing payment rows are retained. There is no
restore or master-row update endpoint yet.

## Frontend-only capabilities

The frontend currently adds these workflows without new backend routes:

- Search, category/frequency/status filters, amount filters, and sorting.
- Copying the displayed account reference.
- Payment notes, saved through `POST /api/payments`.
- Multi-month/year analytics by calling `GET /api/dashboard` repeatedly.
- Excel-compatible HTML export and print-to-PDF export in the browser.
- Light/dark theme toggle.

## Planned API work

The following are not implemented in the current generated code:

- Workbook import endpoint and importer service.
- Dedicated `GET /api/expenses`, `GET /api/payments`, and monthly-total routes.
- Master-row update, reorder, restore, and `valid_from_period` /
  `valid_to_period` operations.
- Server-side authentication, authorization, and token verification.
- API-level validation of year/month, dates, frequencies, month arrays, and
  payment ownership.