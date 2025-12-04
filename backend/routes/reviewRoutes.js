import express from 'express';
import reviewController from '../controllers/reviewController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, reviewController.getUserReviews);
router.post('/', auth, reviewController.addReview);
router.put('/:rating_id', auth, reviewController.updateReview);
router.delete('/:rating_id', auth, reviewController.deleteReview);

export default router;
