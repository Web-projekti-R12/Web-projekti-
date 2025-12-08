// routes/favoriteRoutes.js
import { Router } from 'express';
import FavoriteController from '../controllers/favoriteController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/', auth, FavoriteController.getFavorites);
router.post('/', auth, FavoriteController.addFavorite);
router.delete('/:id', auth, FavoriteController.deleteFavorite);

export default router;
