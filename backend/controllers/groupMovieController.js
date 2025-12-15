// controllers/groupMovieController.js
import {
  isMember,
  isOwner,
  listGroupMovies,
  addMovieToGroup,
  removeMovieFromGroup,
  listComments,
  addComment,
} from "../models/groupMovieModel.js";

const GroupMovieController = {
  listGroupMovies: async (req, res) => {
    try {
      const userId = req.userId;
      const groupId = Number(req.params.groupId);

      const member = await isMember(groupId, userId);
      if (!member) return res.status(403).json({ msg: "Not a group member" });

      const movies = await listGroupMovies(groupId);
      res.json(movies);
    } catch (err) {
      console.error("listGroupMovies error:", err);
      res.status(500).json({ msg: "Failed to load group movies" });
    }
  },

  addMovieToGroup: async (req, res) => {
    try {
      const userId = req.userId;
      const groupId = Number(req.params.groupId);
      const { tmdb_movie_id } = req.body;

      if (!tmdb_movie_id) return res.status(400).json({ msg: "tmdb_movie_id is required" });

      const member = await isMember(groupId, userId);
      if (!member) return res.status(403).json({ msg: "Not a group member" });

      const row = await addMovieToGroup(groupId, Number(tmdb_movie_id), userId);

      // jos oli jo olemassa
      if (!row) return res.status(200).json({ msg: "Already added" });

      res.status(201).json(row);
    } catch (err) {
      console.error("addMovieToGroup error:", err);
      res.status(500).json({ msg: "Failed to add movie to group" });
    }
  },

  removeMovieFromGroup: async (req, res) => {
    try {
      const userId = req.userId;
      const groupId = Number(req.params.groupId);
      const groupMovieId = Number(req.params.groupMovieId);

      // sallitaan poisto ownerille (tai halutessa myös added_by:lle)
      const owner = await isOwner(groupId, userId);
      if (!owner) return res.status(403).json({ msg: "Only owner can remove group movies" });

      const ok = await removeMovieFromGroup(groupId, groupMovieId);
      if (!ok) return res.status(404).json({ msg: "Not found" });

      res.status(204).end();
    } catch (err) {
      console.error("removeMovieFromGroup error:", err);
      res.status(500).json({ msg: "Failed to remove movie" });
    }
  },

  listComments: async (req, res) => {
    try {
      const userId = req.userId;
      const groupId = Number(req.params.groupId);
      const groupMovieId = Number(req.params.groupMovieId);

      const member = await isMember(groupId, userId);
      if (!member) return res.status(403).json({ msg: "Not a group member" });

      const comments = await listComments(groupMovieId);
      res.json(comments);
    } catch (err) {
      console.error("listComments error:", err);
      res.status(500).json({ msg: "Failed to load comments" });
    }
  },

  addComment: async (req, res) => {
    try {
      const userId = req.userId;
      const groupId = Number(req.params.groupId);
      const groupMovieId = Number(req.params.groupMovieId);
      const { content } = req.body;

      if (!content || !content.trim()) return res.status(400).json({ msg: "content is required" });

      const member = await isMember(groupId, userId);
      if (!member) return res.status(403).json({ msg: "Not a group member" });

      const comment = await addComment(groupMovieId, userId, content.trim());
      res.status(201).json(comment);
    } catch (err) {
      console.error("addComment error:", err);
      res.status(500).json({ msg: "Failed to add comment" });
    }
  },
};

export default GroupMovieController;
