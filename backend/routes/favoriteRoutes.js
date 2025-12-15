import { Router } from "express";
import FavoriteController from "../controllers/favoriteController.js";
import FavoriteShareController from "../controllers/favoriteShareController.js";
import auth from "../middleware/auth.js";

const router = Router();

router.get("/", auth, FavoriteController.getFavorites);
router.post("/", auth, FavoriteController.addFavorite);
router.delete("/:id", auth, FavoriteController.deleteFavorite);

router.post("/share", auth, FavoriteShareController.createShareLink);

router.get("/:userId", FavoriteShareController.getSharedFavorites);

export default router;
