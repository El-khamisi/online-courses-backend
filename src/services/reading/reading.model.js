const mongoose = require('mongoose');
const levels = require('../../config/levels');
const membership = require('../../config/membership');

const readingSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
    membership: { type: String, enum: [...Object.values(membership), 'Invalid membership plan'], default: membership.freePlan },
    level: { type: String, enum: [...Object.values(levels), 'Invalid level'] }
  },
  { timestamps: true }
);


module.exports = mongoose.model('Reading', readingSchema);