import express from 'express';
import reviewController from '../controllers/reviewController.js';

const router = express.Router();

router.get('/', reviewController.getAllReviews);
router.post('/', reviewController.addReview);

export default router;
