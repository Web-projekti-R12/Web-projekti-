// models/groupMovieModel.js
import db from "../config/db.js";

export async function isMember(groupId, userId) {
  const res = await db.query(
    `SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2`,
    [groupId, userId]
  );
  return res.rowCount > 0;
}

export async function isOwner(groupId, userId) {
  const res = await db.query(
    `SELECT 1 FROM groups WHERE group_id = $1 AND owner_id = $2`,
    [groupId, userId]
  );
  return res.rowCount > 0;
}

export async function listGroupMovies(groupId) {
  const res = await db.query(
    `
    SELECT 
      gm.group_movie_id,
      gm.group_id,
      gm.tmdb_movie_id,
      gm.added_by,
      gm.created_at,
      COALESCE(u.display_name, u.email) AS added_by_name,
      u.email AS added_by_email
    FROM group_movies gm
    LEFT JOIN users u ON u.user_id = gm.added_by
    WHERE gm.group_id = $1
    ORDER BY gm.created_at DESC;
    `,
    [groupId]
  );
  return res.rows;
}

export async function addMovieToGroup(groupId, tmdbMovieId, userId) {
  const res = await db.query(
    `
    INSERT INTO group_movies (group_id, tmdb_movie_id, added_by)
    VALUES ($1, $2, $3)
    ON CONFLICT (group_id, tmdb_movie_id) DO NOTHING
    RETURNING *;
    `,
    [groupId, tmdbMovieId, userId]
  );
  return res.rows[0] || null;
}

export async function removeMovieFromGroup(groupId, groupMovieId) {
  const res = await db.query(
    `DELETE FROM group_movies WHERE group_id = $1 AND group_movie_id = $2`,
    [groupId, groupMovieId]
  );
  return res.rowCount > 0;
}

export async function listComments(groupMovieId) {
  const res = await db.query(
    `
    SELECT 
      c.comment_id,
      c.group_movie_id,
      c.user_id,
      c.content,
      c.created_at,
      COALESCE(u.display_name, u.email) AS author_name,
      u.email
    FROM group_movie_comments c
    JOIN users u ON u.user_id = c.user_id
    WHERE c.group_movie_id = $1
    ORDER BY c.created_at ASC;
    `,
    [groupMovieId]
  );
  return res.rows;
}

export async function addComment(groupMovieId, userId, content) {
  // Palauta heti myös author_name + email (hyödyllinen jos joskus UI käyttää suoraan responsea)
  const res = await db.query(
    `
    INSERT INTO group_movie_comments (group_movie_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING comment_id, group_movie_id, user_id, content, created_at;
    `,
    [groupMovieId, userId, content]
  );

  const inserted = res.rows[0];

  const ures = await db.query(
    `
    SELECT COALESCE(display_name, email) AS author_name, email
    FROM users
    WHERE user_id = $1;
    `,
    [userId]
  );

  const user = ures.rows[0] || { author_name: null, email: null };

  return {
    ...inserted,
    author_name: user.author_name,
    email: user.email,
  };
}
