const mongoose = require('mongoose');
const membership = require('../../config/membership');
const levels = require('../../config/levels');

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    price: { type: Number, set: (v) => Math.round(v * 100) / 100, default: 0.0 },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    description: {
      text: { type: String },
      list: [{ type: String }],
    },
    photo: { type: String },
    membership: { type: String, enum: [...Object.values(membership), 'Invalid membership plan'] },
    level: { type: String, enum: [...Object.values(levels), 'Invalid level'] },
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

courseSchema.virtual('lessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'course',
});

module.exports = mongoose.model('Course', courseSchema);
