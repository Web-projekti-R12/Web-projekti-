import express from "express";
import { pool } from "../db.js";
import { authenticate } from "../middleware/auth.js"; // ✅ add auth middleware

const router = express.Router()

// Final endpoint: GET /api/my-reviews
router.get("/ratings", authenticate, async (req, res) => {
  const userId = req.user.user_id
  try {
    const result = await pool.query(
      `SELECT rating_id, tmdb_movie_id, rating, title, content, created_at
       FROM ratings
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    )
    res.json(result.rows)
  } catch (err) {
    console.error("DB ERROR:", err)
    res.status(500).json({ error: "Database error" })
  }
})

export default router
