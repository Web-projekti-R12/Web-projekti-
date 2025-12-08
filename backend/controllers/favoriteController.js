import FavoriteModel from '../models/favoriteModel.js';

const FavoriteController = {
  getFavorites: async (req, res) => {
    try {
      const userId = req.userId; // middlewaresta

      const favorites = await FavoriteModel.getFavoritesByUser(userId);
      res.json(favorites);
    } catch (err) {
      console.error('GET favorites error:', err);
      res.status(500).json({ error: 'Failed to fetch favorites' });
    }
  },

  addFavorite: async (req, res) => {
    try {
      const userId = req.userId;
      const { movie_id } = req.body;

      if (!movie_id) {
        return res.status(400).json({ error: 'movie_id puuttuu' });
      }

      const newFavorite = await FavoriteModel.addFavorite(userId, movie_id);
      res.status(201).json(newFavorite);
    } catch (err) {
      console.error('POST favorites error:', err);
      res.status(500).json({ error: 'Failed to add favorite' });
    }
  },

  deleteFavorite: async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.userId;

      await FavoriteModel.deleteFavorite(id, userId);
      res.status(204).end();
    } catch (err) {
      console.error('DELETE favorites error:', err);
      res.status(500).json({ error: 'Failed to delete favorite' });
    }
  }
};

export default FavoriteController;
