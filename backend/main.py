import os
import json
from typing import Optional, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Personal Monthly Expense Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    try:
        return mysql.connector.connect(
            host=os.getenv("DB_HOST", "127.0.0.1"),
            port=int(os.getenv("DB_PORT", 3307)),
            user=os.getenv("DB_USER", "expense_app"),
            password=os.getenv("DB_PASSWORD", "expense_secret"),
            database=os.getenv("DB_NAME", "personal_expense_tracker")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection error: {str(e)}")

class LoginRequest(BaseModel):
    username: str
    password: str

class ExpenseMasterCreate(BaseModel):
    category_id: Optional[int] = None
    expense_name: str
    expense_code: Optional[str] = None
    frequency_type: str = "MONTHLY"
    applicable_months: Optional[List[int]] = [1,2,3,4,5,6,7,8,9,10,11,12]
    payment_channel: str = "NA"
    payment_url: Optional[str] = None
    account_reference: Optional[str] = None
    expected_due_day: Optional[int] = None
    estimated_amount: Optional[float] = None
    display_order: Optional[int] = 0

class PaymentRecord(BaseModel):
    expense_id: int
    expense_year: int
    expense_month: int
    payment_date: str
    amount: float
    reference_no: Optional[str] = None
    notes: Optional[str] = None

@app.post("/api/login")
def login(req: LoginRequest):
    if req.username == "admin" and req.password == "password123":
        return {"token": "mock-jwt-token-xyz-123", "username": "admin", "role": "OWNER"}
    raise HTTPException(status_code=401, detail="Invalid username or password")

@app.get("/api/dashboard")
def get_dashboard(year: int, month: int):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("""
            SELECT m.*, c.category_name,
                   p.payment_id, p.payment_date, p.amount, p.status as payment_status, p.reference_no, p.notes
            FROM expense_master m
            LEFT JOIN expense_category c ON m.category_id = c.category_id
            LEFT JOIN expense_payment p ON m.expense_id = p.expense_id 
                 AND p.expense_year = %s AND p.expense_month = %s
            WHERE m.active_flag = TRUE
            ORDER BY m.display_order ASC, m.expense_name ASC
        """, (year, month))
        rows = cursor.fetchall()
        
        applicable_rows = []
        monthly_total = 0.0

        for r in rows:
            freq = r['frequency_type']
            months = r['applicable_months']
            if isinstance(months, str):
                try:
                    months = json.loads(months)
                except Exception:
                    months = []
            elif months is None:
                months = []

            is_applicable = False
            if freq == 'MONTHLY':
                is_applicable = True
            elif freq in ('BI_MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL', 'CUSTOM_MONTHS'):
                is_applicable = (month in months)
            elif freq == 'AD_HOC':
                is_applicable = (r['payment_id'] is not None)
            
            if is_applicable:
                paid_amt = float(r['amount']) if r['amount'] is not None else 0.0
                status = r['payment_status'] if r['payment_status'] else "PENDING"
                if status == "PAID":
                    monthly_total += paid_amt

                applicable_rows.append({
                    "expense_id": r["expense_id"],
                    "category_id": r["category_id"],
                    "category_name": r["category_name"] or "General",
                    "expense_name": r["expense_name"],
                    "frequency_type": r["frequency_type"],
                    "applicable_months": months,
                    "payment_channel": r["payment_channel"],
                    "payment_url": r["payment_url"],
                    "account_reference": r["account_reference"],
                    "expected_due_day": r["expected_due_day"],
                    "estimated_amount": float(r["estimated_amount"]) if r["estimated_amount"] is not None else None,
                    "payment_id": r["payment_id"],
                    "payment_date": str(r["payment_date"]) if r["payment_date"] else None,
                    "amount": paid_amt if r['amount'] is not None else None,
                    "status": status,
                    "notes": r["notes"]
                })

        return {
            "year": year,
            "month": month,
            "monthly_total": round(monthly_total, 2),
            "items": applicable_rows
        }
    finally:
        cursor.close()
        conn.close()

@app.post("/api/payments")
def save_payment(p: PaymentRecord):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    try:
        query = """
            INSERT INTO expense_payment 
            (expense_id, expense_year, expense_month, payment_date, amount, reference_no, notes, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'PAID')
            ON DUPLICATE KEY UPDATE
            payment_date = VALUES(payment_date),
            amount = VALUES(amount),
            reference_no = VALUES(reference_no),
            notes = VALUES(notes),
            status = 'PAID'
        """
        cursor.execute(query, (p.expense_id, p.expense_year, p.expense_month, p.payment_date, p.amount, p.reference_no, p.notes))
        conn.commit()

        cursor.execute("""
            SELECT COALESCE(SUM(amount), 0) AS total
            FROM expense_payment
            WHERE expense_year = %s AND expense_month = %s AND status = 'PAID'
        """, (p.expense_year, p.expense_month))
        total_row = cursor.fetchone()
        return {"status": "success", "monthly_total": float(total_row["total"])}
    finally:
        cursor.close()
        conn.close()

@app.post("/api/master/expenses")
def create_master_expense(item: ExpenseMasterCreate):
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    try:
        months_json = json.dumps(item.applicable_months) if item.applicable_months else "[]"
        cursor.execute("""
            INSERT INTO expense_master 
            (category_id, expense_name, expense_code, frequency_type, applicable_months, payment_channel, payment_url, account_reference, expected_due_day, estimated_amount, display_order)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (item.category_id, item.expense_name, item.expense_code, item.frequency_type, months_json, item.payment_channel, item.payment_url, item.account_reference, item.expected_due_day, item.estimated_amount, item.display_order))
        conn.commit()
        return {"status": "success", "expense_id": cursor.lastrowid}
    finally:
        cursor.close()
        conn.close()

@app.delete("/api/master/expenses/{expense_id}")
def deactivate_expense(expense_id: int):
    conn = get_db()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE expense_master SET active_flag = FALSE WHERE expense_id = %s", (expense_id,))
        conn.commit()
        return {"status": "success", "message": "Expense item deactivated"}
    finally:
        cursor.close()
        conn.close()
