const mongoose = require('mongoose');
const membership = require('../../config/membership');

const readingSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
    membership: { type: String, enum: [...Object.values(membership), 'Invalid membership plan'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reading', readingSchema);
