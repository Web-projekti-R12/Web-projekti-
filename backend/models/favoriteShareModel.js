// backend/src/models/favoriteShareModel.js
import db from "../config/db.js";

// CREATE or UPDATE share_sig for a user
export async function upsertShareSig(userId, sig) {
  const res = await db.query(
    `
    INSERT INTO favorite_shares (user_id, share_sig)
    VALUES ($1, $2)
    ON CONFLICT (user_id)
    DO UPDATE SET share_sig = EXCLUDED.share_sig
    RETURNING *;
    `,
    [userId, sig]
  );

  return res.rows[0] || null;
}

// Find share row by userId
export async function findShareByUserId(userId) {
  const res = await db.query(
    `
    SELECT id, user_id, share_sig, created_at
    FROM favorite_shares
    WHERE user_id = $1;
    `,
    [userId]
  );

  return res.rows[0] || null;
}

// Get favorites for a specific user (public read when sig is valid)
export async function getFavoritesByUserId(userId) {
  const res = await db.query(
    `
    SELECT id, user_id, movie_id, created_at
    FROM favorites
    WHERE user_id = $1
    ORDER BY created_at DESC;
    `,
    [userId]
  );

  return res.rows;
}
