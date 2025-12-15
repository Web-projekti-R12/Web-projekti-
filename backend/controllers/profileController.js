import db from "../config/db.js";
import { getUserProfile, updateDisplayName } from "../models/userModel.js";

const ProfileController = {
  getProfile: async (req, res) => {
    try {
      const userId = req.userId;
      const profile = await getUserProfile(userId);

      if (!profile) return res.status(404).json({ msg: "User not found" });
      res.json(profile);
    } catch (err) {
      console.error("GET profile error:", err.stack || err);
      res.status(500).json({ msg: "Failed to load profile" });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.userId;
      const { display_name } = req.body;

      const value = (display_name || "").trim();

      if (!value) {
        return res.status(400).json({ msg: "display_name is required" });
      }

      if (value.length < 2 || value.length > 50) {
        return res
          .status(400)
          .json({ msg: "display_name must be 2-50 characters" });
      }

      const updated = await updateDisplayName(userId, value);
      if (!updated) return res.status(404).json({ msg: "User not found" });

      res.json(updated);
    } catch (err) {
      if (err.code === "23505") {
        return res.status(409).json({ msg: "Display name is already taken" });
      }
      console.error("PATCH profile error:", err.stack || err);
      res.status(500).json({ msg: "Failed to update profile" });
    }
  },

  deleteAccount: async (req, res) => {
    try {
      const userId = req.userId;
      await db.query(`DELETE FROM users WHERE user_id = $1`, [userId]);
      return res.status(204).end();
    } catch (err) {
      console.error("DELETE profile error:", err.stack || err);
      res.status(500).json({ msg: "Failed to delete account" });
    }
  },
};

export default ProfileController;
