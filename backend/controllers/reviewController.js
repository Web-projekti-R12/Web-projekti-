import reviewModel from '../models/reviewModel.js';

const reviewController = {
    getAllReviews: async (req, res) => {
        try {
            const reviews = await reviewModel.getAllReviews();
            res.status(200).json(reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({ message: 'Failed to fetch reviews' });
        }
    },

    addReview: async (req, res) => {
        try {
            const { user_id, tmdb_movie_id, rating, title, content } = req.body;

            if (!user_id || !tmdb_movie_id || !rating || !title || !content) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const newReview = await reviewModel.addReview(
                user_id,
                tmdb_movie_id,
                rating,
                title,
                content
            );

            res.status(201).json(newReview);
        } catch (error) {
            console.error('Error adding review:', error);
            res.status(500).json({ message: 'Failed to add review' });
        }
    }
};

export default reviewController;
