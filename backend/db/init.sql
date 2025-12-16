CREATE TYPE acc_status AS ENUM ('active', 'passive');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(50) UNIQUE,
    acc_status acc_status DEFAULT 'active' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings (
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

CREATE TABLE groups (
  group_id   SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  description TEXT,
  owner_id   INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE group_members (
  id        SERIAL PRIMARY KEY,
  group_id  INTEGER NOT NULL REFERENCES groups(group_id) ON DELETE CASCADE,
  user_id   INTEGER NOT NULL REFERENCES users(user_id)   ON DELETE CASCADE,
  role      VARCHAR(20) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (group_id, user_id)
);

CREATE TABLE group_join_requests (
  request_id SERIAL PRIMARY KEY,
  group_id   INTEGER NOT NULL REFERENCES groups(group_id) ON DELETE CASCADE,
  user_id    INTEGER NOT NULL REFERENCES users(user_id)   ON DELETE CASCADE,
  status     VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  decided_at TIMESTAMP,
  decided_by INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
  UNIQUE (group_id, user_id)
);

CREATE TABLE group_movies (
  group_movie_id SERIAL PRIMARY KEY,
  group_id       INTEGER NOT NULL REFERENCES groups(group_id) ON DELETE CASCADE,
  tmdb_movie_id  INTEGER NOT NULL,
  added_by       INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (group_id, tmdb_movie_id)
);

CREATE TABLE group_movie_comments (
  comment_id     SERIAL PRIMARY KEY,
  group_movie_id INTEGER NOT NULL REFERENCES group_movies(group_movie_id) ON DELETE CASCADE,
  user_id        INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  content        TEXT NOT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favorite_shares (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
  share_sig VARCHAR(120) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
