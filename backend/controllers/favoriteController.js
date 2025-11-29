// controllers/favoriteController.js
import FavoriteModel from '../models/favoriteModel.js';

const FavoriteController = {
  getFavorites: async (req, res) => {
    try {
      const favorites = await FavoriteModel.getAllFavorites();
      res.json(favorites);
    } catch (err) {
      console.error('GET error:', err);
      res.status(500).json({ error: 'Failed to fetch favorites' });
    }
  },

  addFavorite: async (req, res) => {
    try {
      const { user_id, movie_id } = req.body;

      const newFavorite = await FavoriteModel.addFavorite(user_id, movie_id);
      res.status(201).json(newFavorite);

    } catch (err) {
      console.error('POST error:', err);
      res.status(500).json({ error: 'Failed to add favorite' });
    }
  },

  deleteFavorite: async (req, res) => {
    try {
      const { id } = req.params;

      await FavoriteModel.deleteFavorite(id);
      res.status(204).end();

    } catch (err) {
      console.error('DELETE error:', err);
      res.status(500).json({ error: 'Failed to delete favorite' });
    }
  }
};

export default FavoriteController;
