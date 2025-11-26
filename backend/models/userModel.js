import pool from '../config/db.js'

export async function createUser({ email, passwordHash }) {
  const result = await pool.query(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING user_id, email, acc_status`,
    [email, passwordHash]
  )
  return result.rows[0]
}

export async function findUserByEmail(email) {
  const result = await pool.query(
    'SELECT user_id, email, password_hash, acc_status FROM users WHERE email = $1',
    [email]
  )
  return result.rows[0]
}

export async function getAllUsers() {
  const result = await pool.query(
    'SELECT user_id, email, acc_status FROM users'
  )
  return result.rows
}