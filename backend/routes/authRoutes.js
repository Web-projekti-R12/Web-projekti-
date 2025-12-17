import express from 'express'
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Rekisteröi uuden käyttäjän
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@test.fi
 *               password:
 *                 type: string
 *                 example: Salasana1
 *     responses:
 *       201:
 *         description: Käyttäjä luotu
 *       400:
 *         description: Virheellinen pyyntö
 */
router.post('/register', registerUser)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Kirjautuu sisään ja palauttaa JWT-tokenin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: test@test.fi
 *               password:
 *                 type: string
 *                 example: Salasana1
 *     responses:
 *       200:
 *         description: JWT-token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Väärät tunnukset
 */
router.post('/login', loginUser)

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Kirjaa käyttäjän ulos
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Uloskirjautuminen onnistui
 */
router.post('/logout', logoutUser)

export default router
