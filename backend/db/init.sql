CREATE TYPE acc_status AS ENUM ('active', 'passive');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    acc_status acc_status DEFAULT 'active' NOT NULL,
    
);
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  movie_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings(
rating_id SERIAL PRIMARY KEY,
user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
tmdb_movie_id INTEGER NOT NULL,
rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
title VARCHAR(255),
content TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP,
UNIQUE (user_id, tmdb_movie_id)
);