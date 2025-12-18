import { Router } from "express";
import GroupController from "../controllers/groupController.js";
import auth from "../middleware/auth.js";
import GroupRequestController from "../controllers/groupRequestController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Groups
 *     description: Groups endpoints
 */

/**
 * @swagger
 * /api/groups:
 *   get:
 *     summary: Listaa kaikki ryhmät
 *     tags: [Groups]
 *     responses:
 *       200:
 *         description: Lista ryhmistä
 */
router.get("/", GroupController.listGroups);

/**
 * @swagger
 * /api/groups:
 *   post:
 *     summary: Luo uuden ryhmän
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Leffakerho"
 *               description:
 *                 type: string
 *                 example: "Katsotaan ja arvostellaan leffoja yhdessä"
 *             additionalProperties: true
 *     responses:
 *       201:
 *         description: Ryhmä luotu
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/", auth, GroupController.createGroup);

/**
 * @swagger
 * /api/groups/{id}:
 *   get:
 *     summary: Hakee ryhmän tiedot
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ryhmän ID
 *     responses:
 *       200:
 *         description: Ryhmän tiedot
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Ryhmää ei löydy
 */
router.get("/:id", auth, GroupController.getGroup);

/**
 * @swagger
 * /api/groups/{id}:
 *   delete:
 *     summary: Poistaa ryhmän
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ryhmän ID
 *     responses:
 *       200:
 *         description: Ryhmä poistettu
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Ryhmää ei löydy
 */
router.delete("/:id", auth, GroupController.deleteGroup);

/**
 * @swagger
 * /api/groups/{id}/requests:
 *   post:
 *     summary: Lähettää liittymispyynnön ryhmään
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ryhmän ID
 *     responses:
 *       201:
 *         description: Liittymispyyntö luotu
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post("/:id/requests", auth, GroupRequestController.requestToJoin);

/**
 * @swagger
 * /api/groups/{id}/requests:
 *   get:
 *     summary: Listaa odottavat liittymispyynnöt ryhmään
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ryhmän ID
 *     responses:
 *       200:
 *         description: Lista odottavista pyynnöistä
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/:id/requests", auth, GroupRequestController.listPending);

/**
 * @swagger
 * /api/groups/{id}/requests/{requestId}/approve:
 *   post:
 *     summary: Hyväksyy liittymispyynnön
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ryhmän ID
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Pyynnön ID
 *     responses:
 *       200:
 *         description: Pyyntö hyväksytty
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Pyyntöä ei löydy
 */
router.post("/:id/requests/:requestId/approve", auth, GroupRequestController.approve);

/**
 * @swagger
 * /api/groups/{id}/requests/{requestId}/reject:
 *   post:
 *     summary: Hylkää liittymispyynnön
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ryhmän ID
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Pyynnön ID
 *     responses:
 *       200:
 *         description: Pyyntö hylätty
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: Pyyntöä ei löydy
 */
router.post("/:id/requests/:requestId/reject", auth, GroupRequestController.reject);

/**
 * @swagger
 * /api/groups/{id}/leave:
 *   delete:
 *     summary: Poistuu ryhmästä
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ryhmän ID
 *     responses:
 *       200:
 *         description: Poistuttu ryhmästä
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete("/:id/leave", auth, GroupRequestController.leaveGroup);

/**
 * @swagger
 * /api/groups/{id}/members/{userId}:
 *   delete:
 *     summary: Poistaa jäsenen ryhmästä (kick)
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ryhmän ID
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Käyttäjän ID
 *     responses:
 *       200:
 *         description: Jäsen poistettu
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete("/:id/members/:userId", auth, GroupRequestController.kickMember);

/**
 * @swagger
 * /api/groups/{id}/members:
 *   get:
 *     summary: Listaa ryhmän jäsenet
 *     tags: [Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Ryhmän ID
 *     responses:
 *       200:
 *         description: Lista jäsenistä
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get("/:id/members", auth, GroupRequestController.listMembers);

export default router;
