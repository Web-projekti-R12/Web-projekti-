// routes/groupRoutes.js
import { Router } from "express";
import GroupController from "../controllers/groupController.js";
import auth from "../middleware/auth.js";
import GroupRequestController from '../controllers/groupRequestController.js';

const router = Router();

router.get("/", GroupController.listGroups);           // public
router.post("/", auth, GroupController.createGroup);   // auth
router.get("/:id", auth, GroupController.getGroup);

router.delete("/:id", auth, GroupController.deleteGroup);

// join request
router.post('/:id/requests', auth, GroupRequestController.requestToJoin);

// owner request management
router.get('/:id/requests', auth, GroupRequestController.listPending);
router.post('/:id/requests/:requestId/approve', auth, GroupRequestController.approve);
router.post('/:id/requests/:requestId/reject', auth, GroupRequestController.reject);

// leave / kick
router.delete('/:id/leave', auth, GroupRequestController.leaveGroup);
router.delete('/:id/members/:userId', auth, GroupRequestController.kickMember);

// optional
router.get('/:id/members', auth, GroupRequestController.listMembers);

export default router;
