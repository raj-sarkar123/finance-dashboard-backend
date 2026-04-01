-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('viewer', 'analyst', 'admin')) DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Financial Records Table
CREATE TABLE IF NOT EXISTS financial_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount NUMERIC(12, 2) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('income', 'expense')) NOT NULL,
    category VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) SETUP
-- ==========================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;

-- Note: In a typical setup using custom JWTs for our own Node.js backend,
-- we'll bypass Supabase RLS by using the Service Role Key for Admin operations
-- and applying authorization logic in our Express middleware.
-- However, if using Supabase directly from frontend with Supabase Auth,
-- we would configure these policies (example below).

-- Policies for Users table
-- Admins can do everything
CREATE POLICY "Admins have full access to users" ON users
    USING ( (SELECT role FROM users WHERE id = auth.uid()) = 'admin' );

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
    FOR SELECT
    USING ( id = auth.uid() );


-- Policies for Financial Records table
-- Admins have full access
CREATE POLICY "Admins have full access to financial_records" ON financial_records
    USING ( (SELECT role FROM users WHERE id = auth.uid()) = 'admin' );

-- Analysts can select all records
CREATE POLICY "Analysts can read all records" ON financial_records
    FOR SELECT
    USING ( (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'analyst') );

-- Viewers can only select
CREATE POLICY "Viewers can read records" ON financial_records
    FOR SELECT
    USING ( (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'analyst', 'viewer') );
