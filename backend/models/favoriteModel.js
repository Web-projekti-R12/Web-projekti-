import db from '../config/db.js';

const FavoriteModel = {
  getAllFavorites: async () => {
    const result = await db.query('SELECT * FROM favorites');
    return result.rows;
  },

  addFavorite: async (user_id, movie_id) => {
    const result = await db.query(
      'INSERT INTO favorites (user_id, movie_id) VALUES ($1, $2) RETURNING *',
      [user_id, movie_id]
    );
    return result.rows[0];
  },

  deleteFavorite: async (id) => {
    await db.query('DELETE FROM favorites WHERE id = $1', [id]);
    return true;
  }
};

export default FavoriteModel;
