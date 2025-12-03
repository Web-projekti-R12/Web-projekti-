// routes/favoriteRoutes.js
import { Router } from 'express';
import FavoriteController from '../controllers/favoriteController.js';

const router = Router();

router.get('/', FavoriteController.getFavorites);
router.post('/', FavoriteController.addFavorite);
router.delete('/:id', FavoriteController.deleteFavorite);

export default router;
