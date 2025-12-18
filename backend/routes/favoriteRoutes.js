import { Router } from "express";
import FavoriteController from "../controllers/favoriteController.js";
import FavoriteShareController from "../controllers/favoriteShareController.js";
import auth from "../middleware/auth.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Favorites
 *     description: Favorites endpoints
 */

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Hakee kirjautuneen käyttäjän suosikit
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista suosikeista
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/", auth, FavoriteController.getFavorites);

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: Lisää uusi suosikki
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [movieId]
 *             properties:
 *               movieId:
 *                 type: string
 *                 example: "tt0111161"
 *     responses:
 *       201:
 *         description: Suosikki lisätty
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/", auth, FavoriteController.addFavorite);

/**
 * @swagger
 * /api/favorites/{id}:
 *   delete:
 *     summary: Poistaa suosikin
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Suosikin ID
 *     responses:
 *       200:
 *         description: Suosikki poistettu
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete("/:id", auth, FavoriteController.deleteFavorite);

/**
 * @swagger
 * /api/favorites/share:
 *   post:
 *     summary: Luo jakolinkki suosikeille
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Jakolinkki luotu
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/share", auth, FavoriteShareController.createShareLink);

/**
 * @swagger
 * /api/favorites/{userId}:
 *   get:
 *     summary: Hakee jaetut suosikit käyttäjän ID:n perusteella
 *     description: Tämä endpoint EI vaadi JWT-tokenia
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: Käyttäjän ID tai share-token
 *     responses:
 *       200:
 *         description: Jaetut suosikit
 *       404:
 *         description: Ei löydy
 */
router.get("/:userId", FavoriteShareController.getSharedFavorites);

export default router;
