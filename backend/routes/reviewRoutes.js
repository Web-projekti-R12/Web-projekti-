import express from 'express';
import reviewController from '../controllers/reviewController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Reviews endpoints
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Hakee kirjautuneen käyttäjän arvostelut
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista arvosteluista
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', auth, reviewController.getUserReviews);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Lisää uusi arvostelu
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tmdb_movie_id, rating]
 *             properties:
 *               tmdb_movie_id:
 *                 type: integer
 *                 example: 550
 *               rating:
 *                 type: integer
 *                 example: 8
 *               review:
 *                 type: string
 *                 example: "Todella hyvä elokuva!"
 *     responses:
 *       201:
 *         description: Arvostelu lisätty
 *       400:
 *         description: Virheellinen pyyntö
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post('/', auth, reviewController.addReview);

/**
 * @swagger
 * /api/reviews/{rating_id}:
 *   put:
 *     summary: Päivittää arvostelun
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rating_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Arvostelun ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 9
 *               review:
 *                 type: string
 *                 example: "Päivitin arvostelun – vielä parempi!"
 *     responses:
 *       200:
 *         description: Arvostelu päivitetty
 *       400:
 *         description: Virheellinen pyyntö
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Arvostelua ei löydy
 */
router.put('/:rating_id', auth, reviewController.updateReview);

/**
 * @swagger
 * /api/reviews/{rating_id}:
 *   delete:
 *     summary: Poistaa arvostelun
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rating_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Arvostelun ID
 *     responses:
 *       200:
 *         description: Arvostelu poistettu
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Arvostelua ei löydy
 */
router.delete('/:rating_id', auth, reviewController.deleteReview);

/**
 * @swagger
 * /api/reviews/movie/{tmdb_movie_id}:
 *   get:
 *     summary: Hakee arvostelut tietylle elokuvalle
 *     description: Julkinen endpoint (ei vaadi JWT-tokenia)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: tmdb_movie_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: TMDB elokuvan ID
 *     responses:
 *       200:
 *         description: Lista arvosteluista elokuvan mukaan
 */
router.get('/movie/:tmdb_movie_id', reviewController.getReviewsByMovie);

export default router;
