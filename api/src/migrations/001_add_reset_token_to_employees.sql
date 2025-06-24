ALTER TABLE employees
ADD COLUMN password_reset_token TEXT,
ADD COLUMN password_reset_expires TIMESTAMPTZ;
