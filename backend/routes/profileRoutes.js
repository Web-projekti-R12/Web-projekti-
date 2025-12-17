import { Router } from 'express';
import auth from '../middleware/auth.js';
import ProfileController from '../controllers/profileController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Profile
 *     description: Profile endpoints
 */

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Hakee kirjautuneen käyttäjän profiilin
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profiilitiedot
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/", auth, ProfileController.getProfile);

/**
 * @swagger
 * /api/profile:
 *   patch:
 *     summary: Päivittää kirjautuneen käyttäjän profiilia
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Lähetä vain ne kentät, joita haluat päivittää
 *             additionalProperties: true
 *           example:
 *             email: "testi@gmail.com"
 *             displayname: "Testaaja"
 *     responses:
 *       200:
 *         description: Profiili päivitetty
 *       400:
 *         description: Virheellinen pyyntö
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.patch("/", auth, ProfileController.updateProfile);

/**
 * @swagger
 * /api/profile:
 *   delete:
 *     summary: Poistaa käyttäjätilin (kirjautunut käyttäjä)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tili poistettu
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete("/", auth, ProfileController.deleteAccount);

export default router;
