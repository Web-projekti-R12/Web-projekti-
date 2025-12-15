import { Router } from 'express';
import auth from '../middleware/auth.js';
import ProfileController from '../controllers/profileController.js';

const router = Router();

router.get("/", auth, ProfileController.getProfile);
router.patch("/", auth, ProfileController.updateProfile);
router.delete("/", auth, ProfileController.deleteAccount);

export default router;
