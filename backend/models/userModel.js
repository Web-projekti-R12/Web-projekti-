import db from '../config/db.js'

export async function createUser({ email, passwordHash }) {
  const result = await db.query(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING user_id, email, acc_status`,
    [email, passwordHash]
  )
  return result.rows[0]
}

export async function findUserByEmail(email) {
  const result = await db.query(
    'SELECT user_id, email, password_hash, acc_status FROM users WHERE email = $1',
    [email]
  )
  return result.rows[0]
}
// jos halutaan "piilottaa"
export async function getAllUsers() {
  const result = await db.query(
    'SELECT user_id, email, acc_status FROM users'
  )
  return result.rows
}

export async function deleteUserById(userId) {
  // tätä logiikkaa voidaan muuttaa, halutaanko säilyttää dataa kuinka kauan tms.
  await db.query('DELETE FROM favorites WHERE user_id = $1', [userId]);
  await db.query('DELETE FROM ratings  WHERE user_id = $1', [userId]);

  // lopuksi poistetaan käyttäjä
  const result = await db.query(
    'DELETE FROM users WHERE user_id = $1',
    [userId]
  );

  // montako riviä poistettu 0 > onnistui
  return result.rowCount > 0;
}


export async function getUserProfile(userId) {
  const res = await db.query(
    `SELECT user_id, email, display_name FROM users WHERE user_id = $1`,
    [userId]
  );
  return res.rows[0] || null;
}

export async function updateDisplayName(userId, displayName) {
  const res = await db.query(
    `UPDATE users
     SET display_name = $1
     WHERE user_id = $2
     RETURNING user_id, email, display_name`,
    [displayName, userId]
  );
  return res.rows[0] || null;
}