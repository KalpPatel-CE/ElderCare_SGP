-- Authentication System Database Migration
-- Run this SQL script in your PostgreSQL database

-- Step 1: Add new columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE,
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Step 2: Verify columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Step 3: (Optional) Create test users with hashed passwords
-- Note: These are example hashes. Use the signup API to create real users.
-- Password for all test users: "password123"

-- Test Family User
-- INSERT INTO users (full_name, user_code, email, password_hash, role)
-- VALUES ('John Doe', 'USR-F1', 'john@example.com', '$2b$10$example_hash_here', 'family')
-- ON CONFLICT (user_code) DO NOTHING;

-- Test Caretaker User
-- INSERT INTO users (full_name, user_code, email, password_hash, role)
-- VALUES ('Jane Smith', 'USR-C1', 'jane@example.com', '$2b$10$example_hash_here', 'caretaker')
-- ON CONFLICT (user_code) DO NOTHING;

-- Test Admin User
-- INSERT INTO users (full_name, user_code, email, password_hash, role)
-- VALUES ('Admin User', 'USR-A1', 'admin@example.com', '$2b$10$example_hash_here', 'admin')
-- ON CONFLICT (user_code) DO NOTHING;

-- Step 4: Verify migration
SELECT id, full_name, user_code, email, role
FROM users
ORDER BY created_at DESC;

-- Migration complete!
-- Now you can use the signup API to create users with secure passwords.
