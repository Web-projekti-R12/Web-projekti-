import db from '../config/db.js';

const reviewModel = {
    getAllReviews: async () => {
        const result = await db.query('SELECT * FROM ratings');
        return result.rows;
    },

    addReview: async (user_id, tmdb_movie_id, rating, title, content) => {
        const result = await db.query(
            'INSERT INTO ratings(user_id, tmdb_movie_id,rating,title,content) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [user_id, tmdb_movie_id, rating, title, content]
        );
        return result.rows[0];
    }
};

export default reviewModel;