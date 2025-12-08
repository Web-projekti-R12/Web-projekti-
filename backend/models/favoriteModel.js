// models/favoriteModel.js
import db from '../config/db.js';

const FavoriteModel = {
  // Hae vain tietyn käyttäjän suosikit
  getFavoritesByUser: async (userId) => {
    const result = await db.query(
      'SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  },

  // Lisää suosikki kirjautuneelle käyttäjälle
  addFavorite: async (userId, movieId) => {
    const result = await db.query(
      'INSERT INTO favorites (user_id, movie_id) VALUES ($1, $2) RETURNING *',
      [userId, movieId]
    );
    return result.rows[0];
  },

  // Poista suosikki – varmistetaan että kuuluu tälle käyttäjälle
  deleteFavorite: async (id, userId) => {
    await db.query(
      'DELETE FROM favorites WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return true;
  }
};

export default FavoriteModel;
