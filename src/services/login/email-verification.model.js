const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  verification_hash: { type: String },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Verification', verificationSchema);
