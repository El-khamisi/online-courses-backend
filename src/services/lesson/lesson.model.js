const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  name: { type: String, trim: ture },
  video: { type: String },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
});

module.exports = mongoose.model('Lesson', lessonSchema);
