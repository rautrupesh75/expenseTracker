# Personal Monthly Expense Tracker -- Functional Requirements

This document describes the behavior delivered by the current generated
frontend and backend. The application is a local personal-use tracker, not a
banking automation tool.

## 1. User workflow

1. Open the Vite frontend at `http://localhost:3000`.
2. Sign in with the current demo credentials: `admin` / `password123`.
3. Select a month with previous/next controls or the month picker.
4. Review applicable expenses and their payment channel/reference.
5. Record or edit a positive amount and actual payment date.
6. Add optional notes and review the paid total at the bottom.

The backend must be running at `http://127.0.0.1:8000` and MySQL must contain
the schema from `backend/schema.sql`.

## 2. Delivered dashboard behavior

### FR-001 -- Period dashboard

The dashboard displays active expenses applicable to the selected year/month:
expense name, category, frequency, payment link/channel, amount, payment date,
status, account reference, notes, and actions.

### FR-002 -- Recurrence logic

- `MONTHLY` rows appear in every month.
- Other scheduled frequencies appear when the selected month is in their JSON
  `applicable_months` array.
- `AD_HOC` rows appear after a payment exists for that period.
- Inactive rows are excluded.
- The current implementation does not yet filter by `valid_from_period` or
  `valid_to_period`.

### FR-003 -- Payment capture

- Amount must be a positive number in the current UI.
- Payment date is entered with a date picker.
- Save creates or updates one record for the selected expense period.
- Saved records display `PAID`; rows without a record display `PENDING`.
- The monthly total includes only saved records with status `PAID`.
- Notes up to 500 characters are supported.

### FR-004 -- Payment links and references

- `WEB` rows with a URL open in a new tab using `noopener noreferrer`.
- `APP` rows show an app label without inventing a web URL.
- `NA`/offline rows show no payment link.
- Account references can be copied from the dashboard.
- The application never enters banking passwords, PINs, CVVs, OTPs, or submits
  payments.

### FR-005 -- Search, filtering, and sorting

The dashboard supports text search, category, frequency, and status filters,
minimum/maximum amount filters, and sorting by name, category, frequency,
amount, date, or status.

### FR-006 -- Expense master actions

The current UI can create a new expense row and deactivate an existing row.
Deactivation preserves historical payment rows. Full master editing, reorder,
restore, and configurable month selection are not yet exposed.

### FR-007 -- Analytics and reports

The analytics tab can query selected months across a year range and shows total
paid, average per selected month, paid-record count, spend by month, and spend
by category. The dashboard can export selected periods as an Excel-compatible
`.xls` file or a browser print-to-PDF report.

## 3. Initial catalog

The database seeds 43 rows from the `Monthly-expenses` sheet:

| Group | Items |
|---|---|
| Monthly | TATA CC; HDFC CC; Gpay; Phone / data bill; Lodha power bill; SK home power bill; Ojas power; SK MGL; Ojas MGL; Lodha FDS CMS; Food card; Sakshi PM; Pratham Pocket money; Jeetu sir; Avnish sir; Aniket sir; Misc; MF -- SIP; SK power bill; SK BMC Water |
| Feb/May/Aug/Nov | SK Maintanance; Ojas Maintanance; Lodha Maintanance |
| Aug/Sep | SK Property tax; Ojas Property tax; Lodha Property tax |
| Annual | HDFC Premium 1 (Apr); HDFC Premium 2 (Dec); HSBC Insurance (Mar); LIC Premium 2 (Jul); LIC Premium 3 (Sep); Pulsar Insurance (May); Activa Insurance (Jun); Car Insurance (Aug); PPF - Rupesh (Jan); PPF - Pratika (Feb); PPF - Sakshi (Mar); PPF - Pratham (Mar) |
| Semi-annual | Pratham fees (Jul/Dec) |
| Ad hoc | LIC Premium 1; Sakshi fees; Phone claim; Data claim |

The supplied spelling `Maintanance` is retained in the seeded logical names.

## 4. Source workbook scope

The source is `OjasBills(1).xls` / `OjasBills.xls`, sheet
`Monthly-expenses` only. Summary, income, withdrawal, and investment rows such
as `SubTotal`, `Grand total`, `Withdrawals`, `Rental income`, `Gross Income`,
`Net income`, and `Investments` are not expense rows.

Historical workbook import is a documented requirement but is not present in
the current generated code. The Python dependencies include spreadsheet
libraries, but no importer command or API has been implemented.

## 5. Validation and security requirements

- Browser calls go through the backend; the browser never connects directly to
  MySQL.
- Database settings are loaded from local environment variables.
- The schema uses foreign keys, positive-amount checks, valid-month checks, and
  one payment per expense period.
- Current gaps: API-level validation is incomplete, demo credentials are in
  source, CORS is permissive, and authentication tokens are not enforced.