# Personal Monthly Expense Tracker -- Current Requirements and Delivery Status

## 1. Purpose

Provide a local browser application for recording, reviewing, analyzing, and
exporting personal monthly expenses. The application replaces the active
monthly tracking workflow from the `Monthly-expenses` sheet while keeping
payment data normalized in MySQL.

This document is synchronized with the generated files:

- Backend: `backend/main.py`, `backend/schema.sql`
- Frontend: `frontend/src/App.jsx`, `frontend/src/index.css`
- Runtime: FastAPI on port 8000, Vite on port 3000

## 2. Delivered architecture

```text
Browser (React/Vite)
        |
        | /api proxy
        v
FastAPI backend
        |
        v
MySQL: personal_expense_tracker
```

The frontend does not connect directly to MySQL. The backend reads connection
settings from `.env` values (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and
`DB_PASSWORD`).

## 3. Delivered requirements

### Expense configuration

- 43 initial expense rows are seeded by `backend/schema.sql`.
- Each row supports category, name, frequency, applicable months, channel, URL,
  account reference, expected due day, active flag, and display order.
- Users can add a row through the Configure Row dialog.
- Users can deactivate a row; existing payment data remains in the database.

### Period and recurrence logic

- Dashboard period is selected by month and year and defaults to the generated
  UI's current seed period.
- Monthly, quarterly, semi-annual, annual, custom-month, and ad-hoc rules are
  evaluated in the backend.
- Only active rows are returned.
- Ad-hoc rows are returned once a payment exists for the selected period.
- `valid_from_period` and `valid_to_period` exist in the schema but are not yet
  included in the dashboard filter.

### Payments and totals

- Payments are saved through `POST /api/payments`.
- The unique expense/year/month key makes save behavior an upsert.
- Amount and payment date are captured; notes and reference number are stored.
- The UI shows `PAID` for a saved payment and `PENDING` otherwise.
- Monthly totals are calculated from paid database records in the dashboard and
  payment response.

### User experience

- Responsive monthly dashboard with search, filters, sorting, copy-reference,
  payment links, app labels, notes, and light/dark themes.
- Analytics for selected months and year ranges.
- Browser-side Excel-compatible and print-to-PDF exports.

## 4. Database model

The schema contains:

1. `expense_category` for optional grouping.
2. `expense_master` for configurable recurring rows.
3. `expense_payment` for normalized period payments.

The schema enforces foreign keys, positive amounts, valid months, and one
payment per expense period. See `er_diagram.md` for the synchronized ERD.

## 5. Source workbook rules

Historical source: `OjasBills(1).xls` / `OjasBills.xls`, sheet
`Monthly-expenses` only. Individual expense rows are in scope. Summary,
income, withdrawal, and investment rows are excluded from the expense master.

The current code does not yet import historical workbook data. A future
importer must match row names, read date/amount column pairs, skip blank pairs,
skip summary rows, preserve actual payment dates, and be idempotent.

## 6. API contract

Implemented routes:

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/login` | Demo login for `admin` / `password123` |
| GET | `/api/dashboard?year=YYYY&month=M` | Applicable rows, payments, and paid total |
| POST | `/api/payments` | Insert or update one payment period |
| POST | `/api/master/expenses` | Create an expense row |
| DELETE | `/api/master/expenses/{expense_id}` | Deactivate an expense row |

See `api_specifications.md` for request and response examples.

## 7. Known gaps before production use

- Replace demo login with real local authentication and enforce authorization.
- Move all credentials and demo secrets out of source/config defaults.
- Add server-side request validation and safe error responses.
- Apply `valid_from_period` and `valid_to_period` in dashboard queries.
- Add master update, reorder, restore, and explicit skip-status workflows.
- Implement the historical workbook importer and import summary.
- Add automated backend and frontend tests.
- Narrow CORS and database privileges for any deployment beyond local use.

## 8. Local run commands

```text
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` after starting both services.