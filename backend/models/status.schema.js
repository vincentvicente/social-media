const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = StatusSchema;