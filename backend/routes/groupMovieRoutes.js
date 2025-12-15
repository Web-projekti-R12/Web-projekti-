// routes/groupMovieRoutes.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import GroupMovieController from "../controllers/groupMovieController.js";

const router = Router();

// group movies
router.get("/groups/:groupId/movies", auth, GroupMovieController.listGroupMovies);
router.post("/groups/:groupId/movies", auth, GroupMovieController.addMovieToGroup);
router.delete("/groups/:groupId/movies/:groupMovieId", auth, GroupMovieController.removeMovieFromGroup);

// comments
router.get("/groups/:groupId/movies/:groupMovieId/comments", auth, GroupMovieController.listComments);
router.post("/groups/:groupId/movies/:groupMovieId/comments", auth, GroupMovieController.addComment);

export default router;
