const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  video: { type: String },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
});




// quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],

module.exports = mongoose.model('Lesson', lessonSchema);