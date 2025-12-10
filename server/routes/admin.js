const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Profile = require('../models/Profile');
const adminMiddleware = require('../middleware/adminMiddleware');

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Admin only
router.get('/users', adminMiddleware, async (req, res) => {
  try {
    const users = await User.find()
      .select('-__v')
      .sort({ createdAt: -1 });
    
    // Get profile count for each user
    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profileCount = await Profile.countDocuments({ userId: user._id });
        return {
          ...user.toObject(),
          profileCount
        };
      })
    );

    res.json(usersWithProfiles);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// @route   PUT /api/admin/users/:id/toggle-admin
// @desc    Toggle admin status for a user
// @access  Admin only
router.put('/users/:id/toggle-admin', adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent removing admin from yourself
    if (user._id.toString() === req.user.id && user.isAdmin) {
      return res.status(400).json({ error: 'Cannot remove admin status from yourself' });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({
      message: `User ${user.isAdmin ? 'promoted to' : 'removed from'} admin`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Toggle admin error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get system statistics
// @access  Admin only
router.get('/stats', adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProfiles = await Profile.countDocuments();
    const adminUsers = await User.countDocuments({ isAdmin: true });
    
    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      totalUsers,
      totalProfiles,
      adminUsers,
      recentUsers,
      averageProfilesPerUser: totalUsers > 0 ? (totalProfiles / totalUsers).toFixed(2) : 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user and their profiles
// @access  Admin only
router.delete('/users/:id', adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    // Delete all profiles for this user
    await Profile.deleteMany({ userId: user._id });

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User and their profiles deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
