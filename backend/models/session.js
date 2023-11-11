const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  expireAt: {
    type: Date,
    required: true,
    default: () => new Date(+new Date() + 8*60*60*1000)
  }
});

// Ensure indexes are created
sessionSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Session', sessionSchema);
