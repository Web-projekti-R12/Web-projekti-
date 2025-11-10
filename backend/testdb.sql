CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL
);

INSERT INTO users (name, email) VALUES
('Test1', 'test1@example.com'),
('Test2', 'test2@example.com');
