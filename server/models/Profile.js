const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  achievements: {
    merah: { type: Boolean, default: false },
    jingga: { type: Boolean, default: false },
    kuning: { type: Boolean, default: false },
    hijau: { type: Boolean, default: false },
    biru: { type: Boolean, default: false },
    nila: { type: Boolean, default: false },
    ungu: { type: Boolean, default: false }
  },
  minigamesCleared: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUsed: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for user and profile name
profileSchema.index({ userId: 1, name: 1 });

module.exports = mongoose.model('Profile', profileSchema);
