import { deleteUserById } from '../models/userModel.js';

const ProfileController = {
  deleteAccount: async (req, res) => {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(401).json({ msg: 'Not authenticated' });
      }

      const deleted = await deleteUserById(userId);

      if (!deleted) {
        return res.status(404).json({ msg: 'User not found' });
      }

      return res.status(204).end();
    } catch (err) {
      console.error('Delete account error:', err);
      return res
        .status(500)
        .json({ msg: 'Failed to delete account. Please try again later.' });
    }
  },
};

export default ProfileController;
