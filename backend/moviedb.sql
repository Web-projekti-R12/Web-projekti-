CREATE TYPE acc_status AS ENUM ('active', 'passive');

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    acc_status acc_status DEFAULT 'active' NOT NULL
);