// controllers/groupRequestController.js
import { getGroupById, isOwner, addMember, removeMember, getMembers } from '../models/groupModel.js';
import { createJoinRequest, getPendingRequests, getRequestById, setRequestStatus } from '../models/groupRequestModel.js';

const GroupRequestController = {
  // POST /api/groups/:id/requests
  requestToJoin: async (req, res) => {
    try {
      const userId = req.userId;
      const groupId = Number(req.params.id);

      const group = await getGroupById(groupId);
      if (!group) return res.status(404).json({ msg: 'Group not found' });

      const request = await createJoinRequest(groupId, userId);
      return res.status(201).json(request);
    } catch (err) {
      console.error('requestToJoin error:', err);
      return res.status(500).json({ msg: 'Failed to create join request' });
    }
  },

  // GET /api/groups/:id/requests  (owner only)
  listPending: async (req, res) => {
    try {
      const ownerId = req.userId;
      const groupId = Number(req.params.id);

      const ok = await isOwner(groupId, ownerId);
      if (!ok) return res.status(403).json({ msg: 'Only owner can view requests' });

      const requests = await getPendingRequests(groupId);
      return res.json(requests);
    } catch (err) {
      console.error('listPending error:', err);
      return res.status(500).json({ msg: 'Failed to fetch requests' });
    }
  },

  // POST /api/groups/:id/requests/:requestId/approve  (owner only)
  approve: async (req, res) => {
    try {
      const ownerId = req.userId;
      const groupId = Number(req.params.id);
      const requestId = Number(req.params.requestId);

      const ok = await isOwner(groupId, ownerId);
      if (!ok) return res.status(403).json({ msg: 'Only owner can approve' });

      const request = await getRequestById(requestId);
      if (!request || request.group_id !== groupId) {
        return res.status(404).json({ msg: 'Request not found' });
      }

      await addMember(groupId, request.user_id, 'member');
      const updated = await setRequestStatus(requestId, 'approved', ownerId);

      return res.json({ msg: 'Approved', request: updated });
    } catch (err) {
      console.error('approve error:', err);
      return res.status(500).json({ msg: 'Failed to approve request' });
    }
  },

  // POST /api/groups/:id/requests/:requestId/reject  (owner only)
  reject: async (req, res) => {
    try {
      const ownerId = req.userId;
      const groupId = Number(req.params.id);
      const requestId = Number(req.params.requestId);

      const ok = await isOwner(groupId, ownerId);
      if (!ok) return res.status(403).json({ msg: 'Only owner can reject' });

      const request = await getRequestById(requestId);
      if (!request || request.group_id !== groupId) {
        return res.status(404).json({ msg: 'Request not found' });
      }

      const updated = await setRequestStatus(requestId, 'rejected', ownerId);
      return res.json({ msg: 'Rejected', request: updated });
    } catch (err) {
      console.error('reject error:', err);
      return res.status(500).json({ msg: 'Failed to reject request' });
    }
  },

  // DELETE /api/groups/:id/leave  (member self)
  leaveGroup: async (req, res) => {
    try {
      const userId = req.userId;
      const groupId = Number(req.params.id);

      const group = await getGroupById(groupId);
      if (!group) return res.status(404).json({ msg: 'Group not found' });

      // owner ei voi “leave” jos haluat pakottaa ownershipin — voit muuttaa sääntöä
      if (group.owner_id === userId) {
        return res.status(400).json({ msg: 'Owner cannot leave their own group (delete it instead).' });
      }

      const removed = await removeMember(groupId, userId);
      if (!removed) return res.status(404).json({ msg: 'Not a member' });

      return res.status(204).end();
    } catch (err) {
      console.error('leaveGroup error:', err);
      return res.status(500).json({ msg: 'Failed to leave group' });
    }
  },

  // DELETE /api/groups/:id/members/:userId  (owner only)
  kickMember: async (req, res) => {
    try {
      const ownerId = req.userId;
      const groupId = Number(req.params.id);
      const targetUserId = Number(req.params.userId);

      const ok = await isOwner(groupId, ownerId);
      if (!ok) return res.status(403).json({ msg: 'Only owner can remove members' });

      const group = await getGroupById(groupId);
      if (!group) return res.status(404).json({ msg: 'Group not found' });

      if (targetUserId === group.owner_id) {
        return res.status(400).json({ msg: 'Owner cannot be removed.' });
      }

      const removed = await removeMember(groupId, targetUserId);
      if (!removed) return res.status(404).json({ msg: 'User is not a member' });

      return res.status(204).end();
    } catch (err) {
      console.error('kickMember error:', err);
      return res.status(500).json({ msg: 'Failed to remove member' });
    }
  },

  // (optional) GET /api/groups/:id/members  (members only)
  listMembers: async (req, res) => {
    try {
      const userId = req.userId;
      const groupId = Number(req.params.id);

      // member-check voit käyttää aiempaa isMember-funktiota jos sinulla on se
      // Tässä käytetään getMembers vasta, jos jäsenyyden tarkistus on jo olemassa groupControllerissa.
      const members = await getMembers(groupId);
      return res.json(members);
    } catch (err) {
      console.error('listMembers error:', err);
      return res.status(500).json({ msg: 'Failed to list members' });
    }
  }
};

export default GroupRequestController;
