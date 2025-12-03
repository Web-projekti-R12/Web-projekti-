import db from '../config/db.js';

const reviewModel = {
    getUserReviews: async (user_id) => {
        const result = await db.query(
            'SELECT * FROM ratings WHERE user_id = $1 ORDER BY rating_id DESC',
            [user_id]
        );
        return result.rows;
    },

    addReview: async (user_id, tmdb_movie_id, rating, title, content) => {
        const result = await db.query(
            'INSERT INTO ratings(user_id, tmdb_movie_id,rating,title,content) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [user_id, tmdb_movie_id, rating, title, content]
        );
        return result.rows[0];
    },

    updateReview: async (rating_id, user_id, rating, title, content) => {
        const result = await db.query(
            `UPDATE ratings
            SET rating = $1, title = $2, content = $3, updated_at = NOW()
            WHERE rating_id = $4 AND user_id = $5
            RETURNING *`,
            [rating, title, content, rating_id, user_id]
        );
        return result.rows[0];
    },

    deleteReview: async (rating_id, user_id) => {
        await db.query(
            'DELETE FROM ratings WHERE rating_id = $1 AND user_id = $2',
            [rating_id, user_id]
        );
    }
};

export default reviewModel;