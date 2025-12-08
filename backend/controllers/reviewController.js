import reviewModel from '../models/reviewModel.js';

const reviewController = {
    getUserReviews: async (req, res) => {
        try {
            console.log("USER ID FROM TOKEN:", req.userId);
            const reviews = await reviewModel.getUserReviews(req.userId);
            res.status(200).json(reviews);
        } catch (err) {
            console.error("GET USER REVIEWS ERROR:", err);
            res.status(500).json({ message: 'Failed to fetch reviews' });
        }
    },

    getReviewsByMovie: async (req, res) => {
        try {
            const { tmdb_movie_id } = req.params;
            const reviews = await reviewModel.getReviewsByMovie(tmdb_movie_id);
            console.log("TMDB ID RECEIVED:", req.params.tmdbId);
            res.status(200).json(reviews);
        } catch (err) {
            res.status(500).json({ message: 'Failed to fetch reviews for this movie' });
        }
    },

    addReview: async (req, res) => {
        try {
            const user_id = req.userId;
            const { tmdb_movie_id, rating, title, content } = req.body;

            if (!tmdb_movie_id || !rating || !title || !content) {
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
    },

    updateReview: async (req, res) => {
        try {
            const updated = await reviewModel.updateReview(
                req.params.rating_id,
                req.userId,
                req.body.rating,
                req.body.title,
                req.body.content
            );

            if (!updated) {
                return res.status(403).json({ message: 'Not allowed' });
            }

            res.json(updated);
        } catch (err) {
            res.status(500).json({ message: 'Update failed' });
        }
    },

    deleteReview: async (req, res) => {
        try {
            await reviewModel.deleteReview(req.params.rating_id, req.userId);
            res.json({ message: 'Review deleted' });
        } catch (err) {
            res.status(500).json({ message: 'Delete failed' });
        }
    }
};

export default reviewController;
