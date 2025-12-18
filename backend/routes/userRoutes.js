import express from 'express';
import auth from '../middleware/auth.js';
import { getUsers } from '../controllers/userController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User endpoints
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Hakee kaikki käyttäjät
 *     description: Palauttaa listan käyttäjistä (vaatii JWT-tokenin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista käyttäjistä
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                     example: 1
 *                   email:
 *                     type: string
 *                     example: test@test.fi
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', auth, getUsers);

export default router;
