const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  price: { type: Number, set: (v) => Math.round(v * 100) / 100 },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
  description: {
    text: { type: String },
    list: [{ type: String }],
  },
});

module.exports = mongoose.model('Course', courseSchema);
