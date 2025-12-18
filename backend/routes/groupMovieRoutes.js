import { Router } from "express";
import auth from "../middleware/auth.js";
import GroupMovieController from "../controllers/groupMovieController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Group Movies
 *     description: Movies and comments inside groups
 */

/**
 * @swagger
 * /api/groups/{groupId}/movies:
 *   get:
 *     summary: Listaa ryhmän elokuvat
 *     tags: [Group Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ryhmän ID
 *     responses:
 *       200:
 *         description: Lista ryhmän elokuvista
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/groups/:groupId/movies", auth, GroupMovieController.listGroupMovies);

/**
 * @swagger
 * /api/groups/{groupId}/movies:
 *   post:
 *     summary: Lisää elokuvan ryhmään
 *     tags: [Group Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ryhmän ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tmdb_movie_id]
 *             properties:
 *               tmdb_movie_id:
 *                 type: integer
 *                 example: 550
 *     responses:
 *       201:
 *         description: Elokuva lisätty ryhmään
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/groups/:groupId/movies", auth, GroupMovieController.addMovieToGroup);

/**
 * @swagger
 * /api/groups/{groupId}/movies/{groupMovieId}:
 *   delete:
 *     summary: Poistaa elokuvan ryhmästä
 *     tags: [Group Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ryhmän ID
 *       - in: path
 *         name: groupMovieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ryhmä-elokuvan ID
 *     responses:
 *       200:
 *         description: Elokuva poistettu
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete(
  "/groups/:groupId/movies/:groupMovieId",
  auth,
  GroupMovieController.removeMovieFromGroup
);

/**
 * @swagger
 * /api/groups/{groupId}/movies/{groupMovieId}/comments:
 *   get:
 *     summary: Listaa kommentit ryhmän elokuvalle
 *     tags: [Group Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ryhmän ID
 *       - in: path
 *         name: groupMovieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ryhmä-elokuvan ID
 *     responses:
 *       200:
 *         description: Lista kommenteista
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get(
  "/groups/:groupId/movies/:groupMovieId/comments",
  auth,
  GroupMovieController.listComments
);

/**
 * @swagger
 * /api/groups/{groupId}/movies/{groupMovieId}/comments:
 *   post:
 *     summary: Lisää kommentin ryhmän elokuvalle
 *     tags: [Group Movies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ryhmän ID
 *       - in: path
 *         name: groupMovieId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ryhmä-elokuvan ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [comment]
 *             properties:
 *               comment:
 *                 type: string
 *                 example: "Tämä leffa oli yllättävän hyvä!"
 *     responses:
 *       201:
 *         description: Kommentti lisätty
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  "/groups/:groupId/movies/:groupMovieId/comments",
  auth,
  GroupMovieController.addComment
);

export default router;
