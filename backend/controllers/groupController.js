// controllers/groupController.js
import {
  getAllGroups,
  createGroup,
  getGroupById,
  isMember,
  addMember,
  deleteGroup,
} from "../models/groupModel.js";

const GroupController = {
  // GET /api/groups (public)
  listGroups: async (req, res) => {
    try {
      const groups = await getAllGroups();
      res.json(groups);
    } catch (err) {
      console.error("Error listing groups:", err);
      res.status(500).json({ msg: "Failed to list groups" });
    }
  },

  // POST /api/groups (auth)
  createGroup: async (req, res) => {
    try {
      const userId = req.userId; // from auth middleware
      const { name, description = "" } = req.body;

      if (!name || name.trim().length === 0) {
        return res.status(400).json({ msg: "Group name is required" });
      }

      const group = await createGroup(
        name.trim(),
        description.trim(),
        userId
      );

      res.status(201).json(group);
    } catch (err) {
      console.error("Error creating group:", err);
      res.status(500).json({ msg: "Failed to create group" });
    }
  },

  // GET /api/groups/:id (members only)
  getGroup: async (req, res) => {
    try {
      const userId = req.userId;
      const groupId = Number(req.params.id);

      const group = await getGroupById(groupId);
      if (!group) {
        return res.status(404).json({ msg: "Group not found" });
      }

      const member = await isMember(groupId, userId);
      if (!member) {
        return res
          .status(403)
          .json({ msg: "You are not a member of this group" });
      }

      const isOwner = group.owner_id === userId;
      res.json({ ...group, isOwner });
    } catch (err) {
      console.error("Error getting group:", err);
      res.status(500).json({ msg: "Failed to fetch group" });
    }
  },

  // POST /api/groups/:id/join (auth)
  joinGroup: async (req, res) => {
    try {
      const userId = req.userId;
      const groupId = Number(req.params.id);

      const group = await getGroupById(groupId);
      if (!group) {
        return res.status(404).json({ msg: "Group not found" });
      }

      const alreadyMember = await isMember(groupId, userId);
      if (alreadyMember) {
        return res.status(200).json({ msg: "Already a member" });
      }

      const membership = await addMember(groupId, userId);
      res.status(201).json({ msg: "Joined group", membership });
    } catch (err) {
      console.error("Error joining group:", err);
      res.status(500).json({ msg: "Failed to join group" });
    }
  },

  // DELETE /api/groups/:id (owner only)
  deleteGroup: async (req, res) => {
    try {
      const userId = req.userId;
      const groupId = Number(req.params.id);

      const result = await deleteGroup(groupId, userId);

      if (!result.ok && result.reason === "not_found") {
        return res.status(404).json({ msg: "Group not found" });
      }
      if (!result.ok && result.reason === "not_owner") {
        return res
          .status(403)
          .json({ msg: "Only the owner can delete this group" });
      }

      return res.status(204).end();
    } catch (err) {
      console.error("Error deleting group:", err);
      res.status(500).json({ msg: "Failed to delete group" });
    }
  },
};

export default GroupController;
