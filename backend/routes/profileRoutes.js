import { Router } from 'express';
import auth from '../middleware/auth.js';
import ProfileController from '../controllers/profileController.js';

const router = Router();

// Poistaa kirjautuneen käyttäjän tilin
router.delete('/', auth, ProfileController.deleteAccount);

export default router;
