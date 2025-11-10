CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL
);

INSERT INTO users (name, email) VALUES
('Docker_Test1', 'docker_test1@example.com'),
('Docker_Test2', 'docker_test2@example.com');
