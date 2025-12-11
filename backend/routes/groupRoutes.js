// routes/groupRoutes.js
import { Router } from "express";
import GroupController from "../controllers/groupController.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", GroupController.listGroups);           // public
router.post("/", auth, GroupController.createGroup);   // auth
router.get("/:id", auth, GroupController.getGroup);
router.post("/:id/join", auth, GroupController.joinGroup);
router.delete("/:id", auth, GroupController.deleteGroup);

export default router;
