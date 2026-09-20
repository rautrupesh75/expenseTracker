-- Database Schema Initialization for Personal Monthly Expense Tracker
CREATE DATABASE IF NOT EXISTS personal_expense_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE personal_expense_tracker;

-- Application database user (run this script with an administrator account)
CREATE USER IF NOT EXISTS 'expense_app'@'localhost' IDENTIFIED BY 'expense_secret';
CREATE USER IF NOT EXISTS 'expense_app'@'127.0.0.1' IDENTIFIED BY 'expense_secret';
GRANT ALL PRIVILEGES ON personal_expense_tracker.* TO 'expense_app'@'localhost';
GRANT ALL PRIVILEGES ON personal_expense_tracker.* TO 'expense_app'@'127.0.0.1';
FLUSH PRIVILEGES;

-- Category Master
CREATE TABLE IF NOT EXISTS expense_category (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    display_order INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Expense Master
CREATE TABLE IF NOT EXISTS expense_master (
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
) ENGINE=InnoDB;

-- Transaction Ledger
CREATE TABLE IF NOT EXISTS expense_payment (
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
    UNIQUE KEY uq_expense_period (expense_id, expense_year, expense_month),
    INDEX idx_period_status (expense_year, expense_month, status)
) ENGINE=InnoDB;

-- Initial Seed Data: Categories
INSERT IGNORE INTO expense_category (category_id, category_name, display_order) VALUES
(1, 'Credit Cards', 1),
(2, 'Utilities', 2),
(3, 'Housing & Maintenance', 3),
(4, 'Taxes', 4),
(5, 'Allowances & Salaries', 5),
(6, 'Savings & Investments', 6),
(7, 'Insurance', 7),
(8, 'Education', 8),
(9, 'Claims & Ad-hoc', 9);

-- Initial 43 Seed Items
INSERT IGNORE INTO expense_master (expense_id, category_id, expense_name, frequency_type, applicable_months, payment_channel, payment_url, account_reference, display_order) VALUES
(1, 1, 'TATA CC', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'WEB', 'https://www.tatacard.com/creditcards/app/user/login', 'Card ending 4812', 1),
(2, 1, 'HDFC CC', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'WEB', 'https://www.hdfc.bank.in/ways-to-bank/digital-banking/online-banking/netbanking', 'Card ending 9012', 2),
(3, 2, 'Gpay', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'APP', NULL, 'GPay UPI', 3),
(4, 2, 'Phone / data bill', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'WEB', 'https://www.hdfc.bank.in/ways-to-bank/digital-banking/online-banking/netbanking', 'Account 9820123456', 4),
(5, 2, 'Lodha power bill', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'NA', NULL, 'Consumer 10293847', 5),
(6, 2, 'SK home power bill', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'WEB', 'https://onlinesbi.sbi.bank.in/', 'Consumer 90283719', 6),
(7, 2, 'Ojas power', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'WEB', 'https://www.adanione.com/bill-payment', 'Consumer 152839401', 7),
(8, 2, 'SK MGL', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'WEB', 'https://onlinesbi.sbi.bank.in/', 'CA 902194821', 8),
(9, 2, 'Ojas MGL', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'NA', NULL, 'CA 401928372', 9),
(10, 3, 'Lodha FDS CMS', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'APP', NULL, 'MyGate App', 10),
(11, 3, 'SK Maintanance', 'QUARTERLY', '[2, 5, 8, 11]', 'WEB', 'https://onlinesbi.sbi.bank.in/', 'Society A/C 981203', 11),
(12, 3, 'Ojas Maintanance', 'QUARTERLY', '[2, 5, 8, 11]', 'WEB', 'https://onlinesbi.sbi.bank.in/', 'Society A/C 451029', 12),
(13, 3, 'Lodha Maintanance', 'QUARTERLY', '[2, 5, 8, 11]', 'APP', NULL, 'MyGate App', 13),
(14, 4, 'SK Property tax', 'CUSTOM_MONTHS', '[8, 9]', 'WEB', 'https://ptaxportal.mcgm.gov.in/CitizenPortal/#/login', 'SAC 90812390', 14),
(15, 4, 'Ojas Property tax', 'CUSTOM_MONTHS', '[8, 9]', 'WEB', 'https://ptaxportal.mcgm.gov.in/CitizenPortal/#/login', 'SAC 40192831', 15),
(16, 4, 'Lodha Property tax', 'CUSTOM_MONTHS', '[8, 9]', 'WEB', 'https://kdmc.gov.in/kdmc/CitizenHome.html', 'Property 290182', 16),
(17, 5, 'Food card', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'NA', NULL, 'Sodexo/Zeta', 17),
(18, 5, 'Sakshi PM', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'NA', NULL, 'Pocket Money', 18),
(19, 5, 'Pratham Pocket money', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'NA', NULL, 'Pocket Money', 19),
(20, 5, 'Jeetu sir', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'NA', NULL, 'Tuition Fees', 20),
(21, 5, 'Avnish sir', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'NA', NULL, 'Tuition Fees', 21),
(22, 5, 'Aniket sir', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'NA', NULL, 'Tuition Fees', 22),
(23, 5, 'Misc', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'NA', NULL, 'Household Misc', 23),
(24, 6, 'MF -- SIP', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'NA', NULL, 'Auto-debit mandate', 24),
(25, 7, 'HDFC Premium 1', 'ANNUAL', '[4]', 'NA', NULL, 'Policy 00293819', 25),
(26, 7, 'HDFC Premium 2', 'ANNUAL', '[12]', 'NA', NULL, 'Policy 00819283', 26),
(27, 7, 'LIC Premium 1', 'AD_HOC', '[]', 'NA', NULL, 'Policy 90182938', 27),
(28, 7, 'HSBC Insurance', 'ANNUAL', '[3]', 'NA', NULL, 'Policy 49201928', 28),
(29, 7, 'LIC Premium 2', 'ANNUAL', '[7]', 'NA', NULL, 'Policy 89102938', 29),
(30, 7, 'LIC Premium 3', 'ANNUAL', '[9]', 'NA', NULL, 'Policy 78192039', 30),
(31, 7, 'Pulsar Insurance', 'ANNUAL', '[5]', 'NA', NULL, 'Reg MH02-XX-1234', 31),
(32, 7, 'Activa Insurance', 'ANNUAL', '[6]', 'NA', NULL, 'Reg MH02-YY-5678', 32),
(33, 7, 'Car Insurance', 'ANNUAL', '[8]', 'NA', NULL, 'Reg MH02-ZZ-9012', 33),
(34, 6, 'PPF - Rupesh', 'ANNUAL', '[1]', 'NA', NULL, 'A/C 1029381029', 34),
(35, 6, 'PPF - Pratika', 'ANNUAL', '[2]', 'NA', NULL, 'A/C 2039481920', 35),
(36, 6, 'PPF - Sakshi', 'ANNUAL', '[3]', 'NA', NULL, 'A/C 3948102938', 36),
(37, 6, 'PPF - Pratham', 'ANNUAL', '[3]', 'NA', NULL, 'A/C 4910293847', 37),
(38, 8, 'Sakshi fees', 'AD_HOC', '[]', 'NA', NULL, 'College/School Fees', 38),
(39, 8, 'Pratham fees', 'SEMI_ANNUAL', '[7, 12]', 'NA', NULL, 'College/School Fees', 39),
(40, 9, 'Phone claim', 'AD_HOC', '[]', 'NA', NULL, 'Corporate reimbursement', 40),
(41, 9, 'Data claim', 'AD_HOC', '[]', 'NA', NULL, 'Corporate reimbursement', 41),
(42, 2, 'SK power bill', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'WEB', 'https://pgi.billdesk.com/pgidsk/pgmerc/tatapwr/TATAPWRDetails.jsp', 'Consumer 9000182736', 42),
(43, 2, 'SK BMC Water', 'MONTHLY', '[1,2,3,4,5,6,7,8,9,10,11,12]', 'WEB', 'https://aquaptax.mcgm.gov.in/aqua/CitizenHome.html', 'CCN KW091823', 43);

-- Default due days used when recording payments for any future applicable month.
UPDATE expense_master
SET expected_due_day = CASE expense_id
    WHEN 1 THEN 19 WHEN 2 THEN 15 WHEN 3 THEN 30 WHEN 4 THEN 18
    WHEN 5 THEN 5 WHEN 6 THEN 20 WHEN 7 THEN 15 WHEN 8 THEN 18
    WHEN 9 THEN 18 WHEN 10 THEN 23 WHEN 11 THEN 10 WHEN 12 THEN 10
    WHEN 13 THEN 10 WHEN 14 THEN 25 WHEN 15 THEN 25 WHEN 16 THEN 25
    WHEN 17 THEN 1 WHEN 18 THEN 1 WHEN 19 THEN 1 WHEN 20 THEN 5
    WHEN 21 THEN 5 WHEN 22 THEN 5 WHEN 23 THEN 28 WHEN 24 THEN 10
    WHEN 25 THEN 15 WHEN 26 THEN 15 WHEN 28 THEN 20 WHEN 29 THEN 15
    WHEN 30 THEN 14 WHEN 31 THEN 10 WHEN 32 THEN 10 WHEN 33 THEN 15
    WHEN 34 THEN 5 WHEN 35 THEN 5 WHEN 36 THEN 5 WHEN 37 THEN 5
    WHEN 39 THEN 15 WHEN 42 THEN 20 WHEN 43 THEN 25
    ELSE expected_due_day
END
WHERE expense_id BETWEEN 1 AND 43;
