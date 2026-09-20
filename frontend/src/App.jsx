import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, CheckCircle, Clock, ExternalLink, ShieldCheck, 
  ChevronLeft, ChevronRight, PlusCircle, Settings, Moon, Sun, 
  TrendingDown, TrendingUp, AlertTriangle, Lightbulb, BarChart3, 
  LogOut, Lock, Search, Copy, Check, Trash2, SlidersHorizontal,
  ArrowUpDown, ArrowUp, ArrowDown, X, Download, FileSpreadsheet, FileText
} from 'lucide-react';

const INITIAL_EXPENSES = [
  { id: 1, name: 'TATA CC', cat: 'Credit Cards', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'WEB', url: 'https://www.tatacard.com/creditcards/app/user/login', ref: 'XXXX-4812', day: 19, active: true },
  { id: 2, name: 'HDFC CC', cat: 'Credit Cards', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'WEB', url: 'https://www.hdfc.bank.in/ways-to-bank/digital-banking/online-banking/netbanking', ref: 'XXXX-9012', day: 15, active: true },
  { id: 3, name: 'Gpay', cat: 'Utilities', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'APP', appName: 'GPay App', ref: 'UPI: self@okaxis', day: 30, active: true },
  { id: 4, name: 'Phone / data bill', cat: 'Utilities', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'WEB', url: 'https://www.hdfc.bank.in/ways-to-bank/digital-banking/online-banking/netbanking', ref: 'Acc: 9820123456', day: 18, active: true },
  { id: 5, name: 'Lodha power bill', cat: 'Utilities', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'NA', ref: 'Cons: 10293847', day: 5, active: true },
  { id: 6, name: 'SK home power bill', cat: 'Utilities', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'WEB', url: 'https://onlinesbi.sbi.bank.in/', ref: 'Cons: 90283719', day: 20, active: true },
  { id: 7, name: 'Ojas power', cat: 'Utilities', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'WEB', url: 'https://www.adanione.com/bill-payment', ref: 'Cons: 152839401', day: 15, active: true },
  { id: 8, name: 'SK MGL', cat: 'Utilities', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'WEB', url: 'https://onlinesbi.sbi.bank.in/', ref: 'CA: 902194821', day: 18, active: true },
  { id: 9, name: 'Ojas MGL', cat: 'Utilities', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'NA', ref: 'CA: 401928372', day: 18, active: true },
  { id: 10, name: 'Lodha FDS CMS', cat: 'Housing', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'APP', appName: 'MyGate App', ref: 'Flat 402', day: 23, active: true },
  { id: 11, name: 'SK Maintanance', cat: 'Housing', freq: 'QUARTERLY', months: [2, 5, 8, 11], channel: 'WEB', url: 'https://onlinesbi.sbi.bank.in/', ref: 'Society A/C', day: 10, active: true },
  { id: 12, name: 'Ojas Maintanance', cat: 'Housing', freq: 'QUARTERLY', months: [2, 5, 8, 11], channel: 'WEB', url: 'https://onlinesbi.sbi.bank.in/', ref: 'Society A/C', day: 10, active: true },
  { id: 13, name: 'Lodha Maintanance', cat: 'Housing', freq: 'QUARTERLY', months: [2, 5, 8, 11], channel: 'APP', appName: 'MyGate App', ref: 'Flat 402', day: 10, active: true },
  { id: 14, name: 'SK Property tax', cat: 'Taxes', freq: 'CUSTOM_MONTHS', months: [8, 9], channel: 'WEB', url: 'https://ptaxportal.mcgm.gov.in/CitizenPortal/#/login', ref: 'SAC: 90812390', day: 25, active: true },
  { id: 15, name: 'Ojas Property tax', cat: 'Taxes', freq: 'CUSTOM_MONTHS', months: [8, 9], channel: 'WEB', url: 'https://ptaxportal.mcgm.gov.in/CitizenPortal/#/login', ref: 'SAC: 40192831', day: 25, active: true },
  { id: 16, name: 'Lodha Property tax', cat: 'Taxes', freq: 'CUSTOM_MONTHS', months: [8, 9], channel: 'WEB', url: 'https://kdmc.gov.in/kdmc/CitizenHome.html', ref: 'Prop: 290182', day: 25, active: true },
  { id: 17, name: 'Food card', cat: 'Allowances', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'NA', ref: 'Zeta/Sodexo', day: 1, active: true },
  { id: 18, name: 'Sakshi PM', cat: 'Allowances', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'NA', ref: 'PM Allowance', day: 1, active: true },
  { id: 19, name: 'Pratham Pocket money', cat: 'Allowances', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'NA', ref: 'PM Allowance', day: 1, active: true },
  { id: 20, name: 'Jeetu sir', cat: 'Education', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'NA', ref: 'Tuition A/C', day: 5, active: true },
  { id: 21, name: 'Avnish sir', cat: 'Education', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'NA', ref: 'Tuition A/C', day: 5, active: true },
  { id: 22, name: 'Aniket sir', cat: 'Education', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'NA', ref: 'Tuition A/C', day: 5, active: true },
  { id: 23, name: 'Misc', cat: 'General', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'NA', ref: 'Cash / General', day: 28, active: true },
  { id: 24, name: 'MF -- SIP', cat: 'Investments', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'NA', ref: 'Auto-Debit Mandate', day: 10, active: true },
  { id: 25, name: 'HDFC Premium 1', cat: 'Insurance', freq: 'ANNUAL', months: [4], channel: 'NA', ref: 'Pol: 00293819', day: 15, active: true },
  { id: 26, name: 'HDFC Premium 2', cat: 'Insurance', freq: 'ANNUAL', months: [12], channel: 'NA', ref: 'Pol: 00819283', day: 15, active: true },
  { id: 27, name: 'LIC Premium 1', cat: 'Insurance', freq: 'AD_HOC', months: [], channel: 'NA', ref: 'Pol: 90182938', day: null, active: true },
  { id: 28, name: 'HSBC Insurance', cat: 'Insurance', freq: 'ANNUAL', months: [3], channel: 'NA', ref: 'Pol: 49201928', day: 20, active: true },
  { id: 29, name: 'LIC Premium 2', cat: 'Insurance', freq: 'ANNUAL', months: [7], channel: 'NA', ref: 'Pol: 89102938', day: 15, active: true },
  { id: 30, name: 'LIC Premium 3', cat: 'Insurance', freq: 'ANNUAL', months: [9], channel: 'NA', ref: 'Pol: 78192039', day: 14, active: true },
  { id: 31, name: 'Pulsar Insurance', cat: 'Insurance', freq: 'ANNUAL', months: [5], channel: 'NA', ref: 'MH02-XX-1234', day: 10, active: true },
  { id: 32, name: 'Activa Insurance', cat: 'Insurance', freq: 'ANNUAL', months: [6], channel: 'NA', ref: 'MH02-YY-5678', day: 10, active: true },
  { id: 33, name: 'Car Insurance', cat: 'Insurance', freq: 'ANNUAL', months: [8], channel: 'NA', ref: 'MH02-ZZ-9012', day: 15, active: true },
  { id: 34, name: 'PPF - Rupesh', cat: 'Investments', freq: 'ANNUAL', months: [1], channel: 'NA', ref: 'PPF A/C 1029', day: 5, active: true },
  { id: 35, name: 'PPF - Pratika', cat: 'Investments', freq: 'ANNUAL', months: [2], channel: 'NA', ref: 'PPF A/C 2039', day: 5, active: true },
  { id: 36, name: 'PPF - Sakshi', cat: 'Investments', freq: 'ANNUAL', months: [3], channel: 'NA', ref: 'PPF A/C 3948', day: 5, active: true },
  { id: 37, name: 'PPF - Pratham', cat: 'Investments', freq: 'ANNUAL', months: [3], channel: 'NA', ref: 'PPF A/C 4910', day: 5, active: true },
  { id: 38, name: 'Sakshi fees', cat: 'Education', freq: 'AD_HOC', months: [], channel: 'NA', ref: 'Academic Fee', day: null, active: true },
  { id: 39, name: 'Pratham fees', cat: 'Education', freq: 'SEMI_ANNUAL', months: [7, 12], channel: 'NA', ref: 'Academic Fee', day: 15, active: true },
  { id: 40, name: 'Phone claim', cat: 'Claims', freq: 'AD_HOC', months: [], channel: 'NA', ref: 'Reimbursement', day: null, active: true },
  { id: 41, name: 'Data claim', cat: 'Claims', freq: 'AD_HOC', months: [], channel: 'NA', ref: 'Reimbursement', day: null, active: true },
  { id: 42, name: 'SK power bill', cat: 'Utilities', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'WEB', url: 'https://pgi.billdesk.com/pgidsk/pgmerc/tatapwr/TATAPWRDetails.jsp', ref: 'Cons: 9000182736', day: 20, active: true },
  { id: 43, name: 'SK BMC Water', cat: 'Utilities', freq: 'MONTHLY', months: [1,2,3,4,5,6,7,8,9,10,11,12], channel: 'WEB', url: 'https://aquaptax.mcgm.gov.in/aqua/CitizenHome.html', ref: 'CCN: KW091823', day: 25, active: true },
];

const INITIAL_PAYMENTS = {
  '2026-09': {
    1: { amount: 5551.00, date: '2026-09-19', status: 'PAID' },
    4: { amount: 1464.00, date: '2026-09-19', status: 'PAID' },
    6: { amount: 1693.00, date: '2026-09-19', status: 'PAID' },
    8: { amount: 1670.00, date: '2026-09-19', status: 'PAID' },
    30: { amount: 12500.00, date: '2026-09-14', status: 'PAID' }
  }
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123');
  const [authError, setAuthError] = useState('');
  
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(9);
  
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  
  const [editingRow, setEditingRow] = useState(null);
  const [inputAmount, setInputAmount] = useState('');
  const [inputDate, setInputDate] = useState('');
  const [notesExpense, setNotesExpense] = useState(null);
  const [notesInput, setNotesInput] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [copiedRef, setCopiedRef] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [frequencyFilter, setFrequencyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  
  const [showMasterModal, setShowMasterModal] = useState(false);
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseCat, setNewExpenseCat] = useState('Utilities');
  const [newExpenseFreq, setNewExpenseFreq] = useState('MONTHLY');
  const [newExpenseChannel, setNewExpenseChannel] = useState('WEB');
  const [newExpenseUrl, setNewExpenseUrl] = useState('');
  const [newExpenseRef, setNewExpenseRef] = useState('');
  const [newExpenseDay, setNewExpenseDay] = useState(15);
  const [dataError, setDataError] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportYear, setExportYear] = useState(selectedYear);
  const [exportMonths, setExportMonths] = useState([selectedMonth]);
  const [exporting, setExporting] = useState(false);
  const [analyticsStartYear, setAnalyticsStartYear] = useState(selectedYear);
  const [analyticsEndYear, setAnalyticsEndYear] = useState(selectedYear);
  const [analyticsMonths, setAnalyticsMonths] = useState([selectedMonth]);
  const [analyticsRows, setAnalyticsRows] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');

  const periodKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const loadDashboard = async (year = selectedYear, month = selectedMonth) => {
    const response = await fetch(`/api/dashboard?year=${year}&month=${month}`);
    if (!response.ok) {
      throw new Error('Unable to load expense data. Is the backend running?');
    }

    const data = await response.json();
    const loadedExpenses = data.items.map(item => ({
      id: item.expense_id,
      name: item.expense_name,
      cat: item.category_name,
      freq: item.frequency_type,
      months: item.applicable_months || [],
      channel: item.payment_channel,
      url: item.payment_url,
      appName: item.payment_channel === 'APP' ? 'App' : null,
      ref: item.account_reference,
      day: item.expected_due_day,
      active: true
    }));
    const loadedPayments = {};
    data.items.forEach(item => {
      if (item.payment_id) {
        loadedPayments[periodKey] = {
          ...(loadedPayments[periodKey] || {}),
          [item.expense_id]: {
            amount: item.amount,
            date: item.payment_date,
            status: item.status,
            notes: item.notes || ''
          }
        };
      }
    });

    setExpenses(loadedExpenses);
    setPayments(prev => ({ ...prev, ...loadedPayments }));
    setDataError('');
  };

  useEffect(() => {
    if (!isAuth) return;
    loadDashboard().catch(error => setDataError(error.message));
  }, [isAuth, selectedYear, selectedMonth]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password123') {
      setIsAuth(true);
      setAuthError('');
    } else {
      setAuthError('Invalid credentials. Use admin / password123');
    }
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(y => y - 1);
    } else {
      setSelectedMonth(m => m - 1);
    }
    setEditingRow(null);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(y => y + 1);
    } else {
      setSelectedMonth(m => m + 1);
    }
    setEditingRow(null);
  };

  const handlePeriodChange = (event) => {
    if (!event.target.value) return;
    const [year, month] = event.target.value.split('-').map(Number);
    setSelectedYear(year);
    setSelectedMonth(month);
    setEditingRow(null);
  };

  const isExpenseApplicable = (expense, month, period) => {
    if (!expense.active) return false;
    const { freq, months } = expense;
    if (freq === 'MONTHLY') return true;
    if (['BI_MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL', 'CUSTOM_MONTHS'].includes(freq)) {
      return months.includes(month);
    }
    if (freq === 'AD_HOC') {
      return payments[period] && payments[period][expense.id];
    }
    return false;
  };

  const currentMonthExpenses = useMemo(() => {
    const filteredExpenses = expenses.filter(exp => {
      const matchSearch = exp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          exp.cat.toLowerCase().includes(searchQuery.toLowerCase());
      const payRecord = payments[periodKey]?.[exp.id];
      const amount = payRecord ? Number(payRecord.amount) : 0;
      const status = payRecord?.status || 'PENDING';
      const matchesCategory = categoryFilter === 'ALL' || exp.cat === categoryFilter;
      const matchesFrequency = frequencyFilter === 'ALL' || exp.freq === frequencyFilter;
      const matchesStatus = statusFilter === 'ALL' || status === statusFilter;
      const matchesMinAmount = minAmount === '' || amount >= Number(minAmount);
      const matchesMaxAmount = maxAmount === '' || amount <= Number(maxAmount);

      return matchSearch && matchesCategory && matchesFrequency && matchesStatus &&
        matchesMinAmount && matchesMaxAmount && isExpenseApplicable(exp, selectedMonth, periodKey);
    });

    return [...filteredExpenses].sort((first, second) => {
      const firstPayment = payments[periodKey]?.[first.id];
      const secondPayment = payments[periodKey]?.[second.id];
      const values = {
        name: [first.name, second.name],
        category: [first.cat, second.cat],
        frequency: [first.freq, second.freq],
        amount: [Number(firstPayment?.amount || 0), Number(secondPayment?.amount || 0)],
        date: [firstPayment?.date || '', secondPayment?.date || ''],
        status: [firstPayment?.status || 'PENDING', secondPayment?.status || 'PENDING']
      }[sortConfig.key];
      const [firstValue, secondValue] = values;
      const comparison = typeof firstValue === 'number'
        ? firstValue - secondValue
        : String(firstValue).localeCompare(String(secondValue));
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [expenses, selectedMonth, periodKey, searchQuery, payments, categoryFilter, frequencyFilter, statusFilter, minAmount, maxAmount, sortConfig]);

  const categories = useMemo(() => [...new Set(expenses.map(exp => exp.cat))].sort(), [expenses]);

  const setSort = (key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const resetTableFilters = () => {
    setSearchQuery('');
    setCategoryFilter('ALL');
    setFrequencyFilter('ALL');
    setStatusFilter('ALL');
    setMinAmount('');
    setMaxAmount('');
    setSortConfig({ key: 'name', direction: 'asc' });
  };

  const toggleExportMonth = (month) => {
    setExportMonths(current => current.includes(month)
      ? current.filter(item => item !== month)
      : [...current, month].sort((first, second) => first - second));
  };

  const openExportModal = () => {
    setExportYear(selectedYear);
    setExportMonths([selectedMonth]);
    setShowExportModal(true);
  };

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const loadExportRows = async () => {
    if (!exportMonths.length) throw new Error('Select at least one month.');
    const responses = await Promise.all(exportMonths.map(async month => {
      const response = await fetch(`/api/dashboard?year=${exportYear}&month=${month}`);
      if (!response.ok) throw new Error(`Could not load ${MONTH_NAMES[month - 1]} ${exportYear}.`);
      return { month, data: await response.json() };
    }));

    return responses.flatMap(({ month, data }) => data.items.map(item => ({
      month: MONTH_NAMES[month - 1],
      name: item.expense_name,
      category: item.category_name || 'General',
      frequency: item.frequency_type,
      amount: item.amount ?? '',
      paymentDate: item.payment_date || '',
      status: item.status || 'PENDING',
      reference: item.account_reference || ''
    })));
  };

  const downloadExcel = (rows) => {
    const headers = ['Month', 'Expense', 'Category', 'Frequency', 'Amount', 'Payment Date', 'Status', 'Reference'];
    const table = `<table border="1"><thead><tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${[row.month, row.name, row.category, row.frequency, row.amount, row.paymentDate, row.status, row.reference].map(escapeHtml).map(value => `<td>${value}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    const blob = new Blob([`<html><head><meta charset="UTF-8"></head><body><h2>Expense Report - ${exportYear}</h2>${table}</body></html>`], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expense-report-${exportYear}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const openPdfReport = (rows) => {
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) throw new Error('Allow pop-ups to generate the PDF report.');
    const headers = ['Month', 'Expense', 'Category', 'Frequency', 'Amount', 'Payment Date', 'Status', 'Reference'];
    reportWindow.document.write(`<html><head><title>Expense Report ${exportYear}</title><style>body{font-family:Arial,sans-serif;color:#172033;padding:24px}h1{font-size:22px}table{border-collapse:collapse;width:100%;font-size:11px}th,td{border:1px solid #cbd5e1;padding:7px;text-align:left}th{background:#e2e8f0}td:nth-child(5){text-align:right}@media print{button{display:none}}</style></head><body><h1>Personal Expense Report - ${exportYear}</h1><p>Months: ${exportMonths.map(month => MONTH_NAMES[month - 1]).join(', ')}</p><table><thead><tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${[row.month, row.name, row.category, row.frequency, row.amount, row.paymentDate, row.status, row.reference].map(escapeHtml).map(value => `<td>${value}</td>`).join('')}</tr>`).join('')}</tbody></table><script>window.onload=function(){window.print()}</script></body></html>`);
    reportWindow.document.close();
  };

  const handleExport = async (format) => {
    setExporting(true);
    try {
      const rows = await loadExportRows();
      if (format === 'excel') downloadExcel(rows);
      else openPdfReport(rows);
      setShowExportModal(false);
    } catch (error) {
      alert(error.message);
    } finally {
      setExporting(false);
    }
  };

  const toggleAnalyticsMonth = (month) => {
    setAnalyticsMonths(current => current.includes(month)
      ? current.filter(item => item !== month)
      : [...current, month].sort((first, second) => first - second));
  };

  const loadAnalytics = async () => {
    const firstYear = Math.min(Number(analyticsStartYear), Number(analyticsEndYear));
    const lastYear = Math.max(Number(analyticsStartYear), Number(analyticsEndYear));
    if (!analyticsMonths.length) {
      setAnalyticsError('Select at least one month.');
      return;
    }
    if (firstYear < 2000 || lastYear > 2100) {
      setAnalyticsError('Choose years between 2000 and 2100.');
      return;
    }

    setAnalyticsLoading(true);
    setAnalyticsError('');
    try {
      const responses = await Promise.all(
        Array.from({ length: lastYear - firstYear + 1 }, (_, offset) => firstYear + offset)
          .flatMap(year => analyticsMonths.map(async month => {
            const response = await fetch(`/api/dashboard?year=${year}&month=${month}`);
            if (!response.ok) throw new Error(`Could not load ${MONTH_NAMES[month - 1]} ${year}.`);
            const data = await response.json();
            return data.items.map(item => ({
              year,
              month,
              monthLabel: `${MONTH_NAMES[month - 1]} ${year}`,
              category: item.category_name || 'General',
              name: item.expense_name,
              amount: item.status === 'PAID' ? Number(item.amount || 0) : 0,
              status: item.status
            }));
          }))
      );
      setAnalyticsRows(responses.flat());
    } catch (error) {
      setAnalyticsRows([]);
      setAnalyticsError(error.message);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const analyticsSummary = useMemo(() => {
    const byMonth = {};
    const byCategory = {};
    analyticsRows.forEach(row => {
      byMonth[row.monthLabel] = (byMonth[row.monthLabel] || 0) + row.amount;
      byCategory[row.category] = (byCategory[row.category] || 0) + row.amount;
    });
    const monthEntries = Object.entries(byMonth);
    const categoryEntries = Object.entries(byCategory).sort((first, second) => second[1] - first[1]);
    const total = analyticsRows.reduce((sum, row) => sum + row.amount, 0);
    return {
      total,
      paidCount: analyticsRows.filter(row => row.status === 'PAID').length,
      average: monthEntries.length ? total / monthEntries.length : 0,
      monthEntries,
      categoryEntries,
      maxMonth: Math.max(...monthEntries.map(entry => entry[1]), 0),
      maxCategory: Math.max(...categoryEntries.map(entry => entry[1]), 0)
    };
  }, [analyticsRows]);

  const sortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-3 h-3 opacity-50" />;
    return sortConfig.direction === 'asc'
      ? <ArrowUp className="w-3 h-3 text-blue-400" />
      : <ArrowDown className="w-3 h-3 text-blue-400" />;
  };

  const monthlyTotal = useMemo(() => {
    const currentMonthPayments = payments[periodKey] || {};
    return Object.values(currentMonthPayments).reduce((sum, p) => {
      return p.status === 'PAID' ? sum + Number(p.amount) : sum;
    }, 0);
  }, [payments, periodKey]);

  const handleStartEdit = (exp) => {
    const existing = (payments[periodKey] && payments[periodKey][exp.id]) || {};
    setEditingRow(exp.id);
    setInputAmount(existing.amount ? String(existing.amount) : '');
    const defaultDate = existing.date || `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(exp.day || 15).padStart(2, '0')}`;
    setInputDate(defaultDate);
  };

  const handleOpenNotes = (exp) => {
    const payment = payments[periodKey]?.[exp.id];
    if (!payment) {
      alert('Record the payment before adding notes.');
      return;
    }
    setNotesExpense(exp);
    setNotesInput(payment.notes || '');
  };

  const handleSaveNotes = async () => {
    if (!notesExpense) return;
    const payment = payments[periodKey]?.[notesExpense.id];
    if (!payment) return;

    setSavingNotes(true);
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expense_id: notesExpense.id,
          expense_year: selectedYear,
          expense_month: selectedMonth,
          payment_date: payment.date,
          amount: Number(payment.amount),
          notes: notesInput.trim() || null
        })
      });
      if (!response.ok) throw new Error('Notes could not be saved.');
      await loadDashboard();
      setNotesExpense(null);
    } catch (error) {
      alert(error.message);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleSavePayment = async (expId) => {
    const amt = parseFloat(inputAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }
    if (!inputDate) {
      alert('Please select a payment date.');
      return;
    }
    const existingPayment = payments[periodKey]?.[expId];
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expense_id: expId,
          expense_year: selectedYear,
          expense_month: selectedMonth,
          payment_date: inputDate,
          amount: amt,
          notes: existingPayment?.notes || null
        })
      });
      if (!response.ok) throw new Error('Payment could not be saved.');
      await loadDashboard();
      setEditingRow(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(text);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  const handleAddNewExpense = async (e) => {
    e.preventDefault();
    if (!newExpenseName.trim()) return;
    try {
      const response = await fetch('/api/master/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expense_name: newExpenseName.trim(),
          category_id: null,
          frequency_type: newExpenseFreq,
          applicable_months: [1,2,3,4,5,6,7,8,9,10,11,12],
          payment_channel: newExpenseChannel,
          payment_url: newExpenseUrl || null,
          account_reference: newExpenseRef || 'Ref N/A',
          expected_due_day: parseInt(newExpenseDay) || 15
        })
      });
      if (!response.ok) throw new Error('Expense row could not be saved.');
      await loadDashboard();
      setShowMasterModal(false);
      setNewExpenseName('');
      setNewExpenseUrl('');
      setNewExpenseRef('');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (confirm('Deactivate this item from future months? Past historical records are preserved.')) {
      try {
        const response = await fetch(`/api/master/expenses/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Expense row could not be deactivated.');
        await loadDashboard();
      } catch (error) {
        alert(error.message);
      }
    }
  };

  if (!isAuth) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
        <div className={`w-full max-w-md p-8 rounded-2xl shadow-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-500 mr-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Personal Expense Tracker</h1>
              <p className="text-xs text-slate-500">Local & Secure Gateway</p>
            </div>
          </div>
          {authError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> {authError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-400">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-400">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" /> Sign In to Expense Portal
            </button>
          </form>
          <div className="mt-6 pt-4 border-t border-slate-800/20 text-center text-xs text-slate-500">
            Demo Credentials: <span className="text-blue-500 font-mono">admin / password123</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'} transition-colors`}>
      <header className={`border-b ${theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'} backdrop-blur-md sticky top-0 z-40`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight">Personal Monthly Expense Tracker</span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-medium">
                Local Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex rounded-lg p-1 border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
              <button 
                onClick={() => setActiveTab('dashboard')} 
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Monthly Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('analytics')} 
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${activeTab === 'analytics' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Analytics & Optimization
              </button>
            </div>

            <button 
              onClick={toggleTheme} 
              className={`p-2 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button 
              onClick={() => setIsAuth(false)} 
              className="p-2 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' ? (
          <>
            <div className={`p-4 rounded-2xl border mb-6 flex flex-wrap items-center justify-between gap-4 ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center gap-2">
                <button onClick={handlePrevMonth} className={`p-2 rounded-lg border transition-colors ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="text-center min-w-[200px]">
                  <h2 className="text-lg font-bold tracking-tight">
                    {MONTH_NAMES[selectedMonth - 1]} {selectedYear}
                  </h2>
                  <p className="text-xs text-slate-500">Period: {periodKey}</p>
                </div>
                <label className={`flex items-center gap-1.5 px-2 py-2 rounded-lg border cursor-pointer ${theme === 'dark' ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-50'}`} title="Jump to month">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <input
                    type="month"
                    value={`${selectedYear}-${String(selectedMonth).padStart(2, '0')}`}
                    onChange={handlePeriodChange}
                    aria-label="Select month and year"
                    className="bg-transparent text-xs font-semibold focus:outline-none"
                  />
                </label>
                <button onClick={handleNextMonth} className={`p-2 rounded-lg border transition-colors ${theme === 'dark' ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'}`}>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3 flex-1 max-w-md justify-end">
                <div className="relative w-full max-w-xs">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search expenses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                  />
                </div>
                <button 
                  onClick={() => setShowMasterModal(true)} 
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Configure Row
                </button>
                <button
                  onClick={openExportModal}
                  className="px-3 py-2 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
              </div>
              <div className="basis-full flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/40">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </div>
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className={`px-2.5 py-2 text-xs rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                >
                  <option value="ALL">All categories</option>
                  {categories.map(category => <option key={category} value={category}>{category}</option>)}
                </select>
                <select
                  value={frequencyFilter}
                  onChange={e => setFrequencyFilter(e.target.value)}
                  className={`px-2.5 py-2 text-xs rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                >
                  <option value="ALL">All frequencies</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="BI_MONTHLY">Bi-monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="SEMI_ANNUAL">Semi-annual</option>
                  <option value="ANNUAL">Annual</option>
                  <option value="CUSTOM_MONTHS">Custom months</option>
                  <option value="AD_HOC">Ad hoc</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className={`px-2.5 py-2 text-xs rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                >
                  <option value="ALL">All statuses</option>
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                </select>
                <input
                  type="number"
                  min="0"
                  placeholder="Min amount"
                  value={minAmount}
                  onChange={e => setMinAmount(e.target.value)}
                  className={`w-28 px-2.5 py-2 text-xs rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Max amount"
                  value={maxAmount}
                  onChange={e => setMaxAmount(e.target.value)}
                  className={`w-28 px-2.5 py-2 text-xs rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                />
                <button
                  type="button"
                  onClick={resetTableFilters}
                  className="ml-auto px-2.5 py-2 text-xs text-slate-400 hover:text-blue-400 flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Reset
                </button>
              </div>
            </div>

            <div className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'bg-slate-800/50 border-slate-800 text-slate-400' : 'bg-slate-100/70 border-slate-200 text-slate-600'}`}>
                      <th className="py-3 px-4 uppercase">#</th>
                      <th className="py-3 px-4 uppercase">
                        <button onClick={() => setSort('name')} className="flex items-center gap-1 hover:text-blue-400">Expense Item {sortIcon('name')}</button>
                      </th>
                      <th className="py-3 px-4 uppercase">
                        <button onClick={() => setSort('category')} className="flex items-center gap-1 hover:text-blue-400">Category {sortIcon('category')}</button>
                      </th>
                      <th className="py-3 px-4 uppercase">
                        <button onClick={() => setSort('frequency')} className="flex items-center gap-1 hover:text-blue-400">Frequency {sortIcon('frequency')}</button>
                      </th>
                      <th className="py-3 px-4 uppercase">Payment Link</th>
                      <th className="py-3 px-4 uppercase">
                        <button onClick={() => setSort('amount')} className="flex items-center gap-1 hover:text-blue-400">Amount (₹) {sortIcon('amount')}</button>
                      </th>
                      <th className="py-3 px-4 uppercase">
                        <button onClick={() => setSort('date')} className="flex items-center gap-1 hover:text-blue-400">Date {sortIcon('date')}</button>
                      </th>
                      <th className="py-3 px-4 uppercase">
                        <button onClick={() => setSort('status')} className="flex items-center gap-1 hover:text-blue-400">Status {sortIcon('status')}</button>
                      </th>
                      <th className="py-3 px-4 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/10 dark:divide-slate-800">
                    {currentMonthExpenses.map((exp, idx) => {
                      const payRecord = (payments[periodKey] && payments[periodKey][exp.id]) || null;
                      const isPaid = payRecord && payRecord.status === 'PAID';
                      const isEditing = editingRow === exp.id;

                      return (
                        <tr key={exp.id} className={`${isPaid ? (theme === 'dark' ? 'bg-emerald-950/10' : 'bg-emerald-50/40') : ''} hover:bg-slate-800/20`}>
                          <td className="py-3 px-4 text-slate-400">{idx + 1}</td>
                          <td className="py-3 px-4">
                            <div className="font-semibold flex items-center gap-1.5">
                              {exp.name}
                              {exp.ref && (
                                <button onClick={() => handleCopy(exp.ref)} className="text-slate-400 hover:text-blue-500">
                                  {copiedRef === exp.ref ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500">{exp.ref}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-400">{exp.cat}</td>
                          <td className="py-3 px-4 text-slate-400">{exp.freq}</td>
                          <td className="py-3 px-4">
                            {exp.channel === 'WEB' && exp.url ? (
                              <a href={exp.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline flex items-center gap-1">
                                Pay <ExternalLink className="w-3 h-3" />
                              </a>
                            ) : exp.channel === 'APP' ? (
                              <span className="text-purple-400 font-medium">{exp.appName || 'App'}</span>
                            ) : (
                              <span className="text-slate-500">NA</span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono font-medium">
                            {isEditing ? (
                              <input 
                                type="number" 
                                value={inputAmount} 
                                onChange={e => setInputAmount(e.target.value)} 
                                className="w-24 px-2 py-1 rounded border bg-slate-800 border-slate-700"
                              />
                            ) : (
                              isPaid ? `₹${Number(payRecord.amount).toLocaleString('en-IN')}` : '—'
                            )}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px]">
                            {isEditing ? (
                              <input 
                                type="date" 
                                value={inputDate} 
                                onChange={e => setInputDate(e.target.value)} 
                                className="px-2 py-1 rounded border bg-slate-800 border-slate-700"
                              />
                            ) : (
                              isPaid ? payRecord.date : '—'
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {isPaid ? (
                              <span className="text-emerald-500 font-bold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> PAID
                              </span>
                            ) : (
                              <span className="text-amber-500 font-bold flex items-center gap-1">
                                <Clock className="w-3 h-3" /> PENDING
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {isEditing ? (
                              <div className="flex justify-end gap-1">
                                <button onClick={() => handleSavePayment(exp.id)} className="px-2 py-1 bg-emerald-600 text-white rounded">Save</button>
                                <button onClick={() => setEditingRow(null)} className="px-2 py-1 border border-slate-700 text-slate-400 rounded">Cancel</button>
                              </div>
                            ) : (
                              <div className="flex justify-end gap-2">
                                <button onClick={() => handleStartEdit(exp)} className="text-blue-500 hover:underline">{isPaid ? 'Edit' : 'Record'}</button>
                                <button onClick={() => handleOpenNotes(exp)} className="text-slate-400 hover:text-blue-400">Notes</button>
                                <button onClick={() => handleDeleteExpense(exp.id)} className="text-slate-500 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className={`p-4 border-t flex items-center justify-between ${theme === 'dark' ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                <span className="text-xs text-slate-500">Rows: {currentMonthExpenses.length} items</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase text-slate-400">Total Expenses:</span>
                  <span className="text-xl font-bold font-mono text-emerald-500">
                    ₹{monthlyTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className={`p-6 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-purple-500" />
              <div>
                <h3 className="font-bold">Expense Analytics & Run-Rate</h3>
                <p className="text-xs text-slate-500">Compare paid expenses across selected months and years</p>
              </div>
            </div>
            <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'border-slate-800 bg-slate-800/30' : 'border-slate-200 bg-slate-50'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <label className="text-xs text-slate-400">From year
                  <input type="number" min="2000" max="2100" value={analyticsStartYear} onChange={event => setAnalyticsStartYear(Number(event.target.value))} className={`block w-full mt-1 px-3 py-2 rounded-lg border text-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} />
                </label>
                <label className="text-xs text-slate-400">To year
                  <input type="number" min="2000" max="2100" value={analyticsEndYear} onChange={event => setAnalyticsEndYear(Number(event.target.value))} className={`block w-full mt-1 px-3 py-2 rounded-lg border text-sm ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`} />
                </label>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs text-slate-400 mr-1">Months</span>
                {MONTH_NAMES.map((month, index) => {
                  const monthNumber = index + 1;
                  const selected = analyticsMonths.includes(monthNumber);
                  return (
                    <label key={month} className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md border text-xs cursor-pointer ${selected ? 'border-blue-500 bg-blue-500/10 text-blue-300' : 'border-slate-700 text-slate-400'}`}>
                      <input type="checkbox" checked={selected} onChange={() => toggleAnalyticsMonth(monthNumber)} className="accent-blue-600" />
                      {month.slice(0, 3)}
                    </label>
                  );
                })}
                <button onClick={loadAnalytics} disabled={analyticsLoading} className="ml-auto px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold">
                  {analyticsLoading ? 'Loading...' : 'Generate report'}
                </button>
              </div>
              {analyticsError && <p className="mt-3 text-xs text-red-400">{analyticsError}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'border-slate-800 bg-slate-800/30' : 'border-slate-200 bg-slate-50'}`}>
                <span className="text-xs text-slate-400">Total paid</span>
                <p className="text-xl font-bold font-mono mt-1">₹{analyticsSummary.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'border-slate-800 bg-slate-800/30' : 'border-slate-200 bg-slate-50'}`}>
                <span className="text-xs text-slate-400">Average per selected month</span>
                <p className="text-xl font-bold font-mono mt-1">₹{analyticsSummary.average.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'border-slate-800 bg-slate-800/30' : 'border-slate-200 bg-slate-50'}`}>
                <span className="text-xs text-slate-400">Paid records</span>
                <p className="text-xl font-bold font-mono mt-1">{analyticsSummary.paidCount}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="text-sm font-semibold mb-3">Spend by month</h4>
                <div className="space-y-3">
                  {analyticsSummary.monthEntries.length ? analyticsSummary.monthEntries.map(([label, amount]) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1"><span>{label}</span><span className="font-mono">₹{amount.toLocaleString('en-IN')}</span></div>
                      <div className="h-2 rounded bg-slate-800 overflow-hidden"><div className="h-full rounded bg-blue-500" style={{ width: `${analyticsSummary.maxMonth ? (amount / analyticsSummary.maxMonth) * 100 : 0}%` }} /></div>
                    </div>
                  )) : <p className="text-xs text-slate-500">Choose a period and generate a report.</p>}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3">Spend by category</h4>
                <div className="space-y-3">
                  {analyticsSummary.categoryEntries.length ? analyticsSummary.categoryEntries.map(([category, amount]) => (
                    <div key={category}>
                      <div className="flex justify-between text-xs mb-1"><span>{category}</span><span className="font-mono">₹{amount.toLocaleString('en-IN')}</span></div>
                      <div className="h-2 rounded bg-slate-800 overflow-hidden"><div className="h-full rounded bg-emerald-500" style={{ width: `${analyticsSummary.maxCategory ? (amount / analyticsSummary.maxCategory) * 100 : 0}%` }} /></div>
                    </div>
                  )) : <p className="text-xs text-slate-500">No paid category data for this selection.</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {showMasterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl border bg-slate-900 border-slate-800 text-slate-100">
            <h3 className="font-bold text-sm mb-4">Add / Configure Dynamic Expense Row</h3>
            <form onSubmit={handleAddNewExpense} className="space-y-3 text-xs">
              <input 
                type="text" 
                placeholder="Expense Name (e.g., Broadband)"
                value={newExpenseName}
                onChange={e => setNewExpenseName(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
              />
              <input 
                type="url" 
                placeholder="Payment Portal URL"
                value={newExpenseUrl}
                onChange={e => setNewExpenseUrl(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
              />
              <input 
                type="text" 
                placeholder="Reference / Consumer ID"
                value={newExpenseRef}
                onChange={e => setNewExpenseRef(e.target.value)}
                className="w-full px-3 py-2 rounded bg-slate-800 border border-slate-700"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowMasterModal(false)} className="px-3 py-1.5 border border-slate-700 rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-600 text-white rounded font-bold">Save Row</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {notesExpense && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl border bg-slate-900 border-slate-800 text-slate-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm">Payment Notes</h3>
                <p className="text-xs text-slate-500 mt-1">{notesExpense.name} · {periodKey}</p>
              </div>
              <button onClick={() => setNotesExpense(null)} className="text-slate-400 hover:text-white" aria-label="Close notes dialog">
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={notesInput}
              onChange={event => setNotesInput(event.target.value)}
              maxLength={500}
              rows={5}
              placeholder="Add a receipt number, reminder, or payment detail..."
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-slate-500">{notesInput.length}/500</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => setNotesExpense(null)} className="px-3 py-1.5 border border-slate-700 rounded-lg text-xs text-slate-400">Cancel</button>
                <button type="button" disabled={savingNotes} onClick={handleSaveNotes} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold">
                  {savingNotes ? 'Saving...' : 'Save notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-2xl border bg-slate-900 border-slate-800 text-slate-100">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-bold text-sm">Export Expense Report</h3>
                <p className="text-xs text-slate-500 mt-1">Choose a year and one or more months.</p>
              </div>
              <button onClick={() => setShowExportModal(false)} className="text-slate-400 hover:text-white" aria-label="Close export dialog">
                <X className="w-4 h-4" />
              </button>
            </div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Year</label>
            <input
              type="number"
              min="2000"
              max="2100"
              value={exportYear}
              onChange={event => setExportYear(Number(event.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm mb-4"
            />
            <label className="block text-xs font-semibold text-slate-400 mb-2">Months</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {MONTH_NAMES.map((month, index) => {
                const monthNumber = index + 1;
                const selected = exportMonths.includes(monthNumber);
                return (
                  <label key={month} className={`flex items-center gap-2 px-2.5 py-2 rounded-lg border text-xs cursor-pointer ${selected ? 'border-blue-500 bg-blue-500/10 text-blue-300' : 'border-slate-700 text-slate-400'}`}>
                    <input type="checkbox" checked={selected} onChange={() => toggleExportMonth(monthNumber)} className="accent-blue-600" />
                    {month.slice(0, 3)}
                  </label>
                );
              })}
            </div>
            <div className="flex justify-end gap-2 pt-6">
              <button type="button" onClick={() => setShowExportModal(false)} className="px-3 py-2 border border-slate-700 rounded-lg text-xs text-slate-400">Cancel</button>
              <button type="button" disabled={exporting} onClick={() => handleExport('excel')} className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
              </button>
              <button type="button" disabled={exporting} onClick={() => handleExport('pdf')} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
