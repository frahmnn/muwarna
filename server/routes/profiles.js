const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const authMiddleware = require('../middleware/auth');

// @route   GET /api/profiles
// @desc    Get all profiles for logged-in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const profiles = await Profile.find({ userId: req.user.id })
      .sort({ lastUsed: -1 });
    res.json(profiles);
  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// @route   POST /api/profiles
// @desc    Create a new profile
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Profile name is required' });
    }

    // Check if profile name already exists for this user
    const existingProfile = await Profile.findOne({
      userId: req.user.id,
      name: name.trim()
    });

    if (existingProfile) {
      return res.status(400).json({ error: 'Profile name already exists' });
    }

    const profile = await Profile.create({
      name: name.trim(),
      userId: req.user.id
    });

    res.status(201).json(profile);
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// @route   PUT /api/profiles/:id
// @desc    Update profile (rename, update lastUsed, or achievements)
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, updateLastUsed, achievement, minigameCompleted } = req.body;

    const profile = await Profile.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    if (name && name.trim() !== '') {
      // Check if new name already exists
      const existingProfile = await Profile.findOne({
        userId: req.user.id,
        name: name.trim(),
        _id: { $ne: req.params.id }
      });

      if (existingProfile) {
        return res.status(400).json({ error: 'Profile name already exists' });
      }

      profile.name = name.trim();
    }

    if (updateLastUsed) {
      profile.lastUsed = new Date();
    }

    // Update achievement for a specific color
    if (achievement) {
      const colorKey = achievement.toLowerCase();
      if (profile.achievements.hasOwnProperty(colorKey)) {
        profile.achievements[colorKey] = true;
      }
    }

    // Increment minigame counter
    if (minigameCompleted) {
      profile.minigamesCleared = (profile.minigamesCleared || 0) + 1;
    }

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// @route   DELETE /api/profiles/:id
// @desc    Delete a profile
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).json({ error: 'Failed to delete profile' });
  }
});

module.exports = router;
