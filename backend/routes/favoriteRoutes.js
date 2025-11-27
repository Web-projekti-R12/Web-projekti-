import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

// Hae kaikki suosikit (voit rajata user_id:llä jos haluat)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM favorites');
    res.json(result.rows);
  } catch (err) {
    console.error('GET error:', err);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Lisää suosikki
router.post('/', async (req, res) => {
  try {
    const { user_id, movie_id } = req.body;
    const result = await db.query(
      'INSERT INTO favorites (user_id, movie_id) VALUES ($1, $2) RETURNING *',
      [user_id, movie_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST error:', err);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

// Poista suosikki
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM favorites WHERE id = $1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error('DELETE error:', err);
    res.status(500).json({ error: 'Failed to delete favorite' });
  }
});

export default router;
