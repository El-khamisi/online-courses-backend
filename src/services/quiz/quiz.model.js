const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  choices: { type: Map, of: String },
  correct: String,
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
  reading: { type: mongoose.Schema.Types.ObjectId, ref: 'Reading' },
});

quizSchema.pre('save', function (next) {
  if (!this.choices) {
    next();
  } else {
    this.choices.forEach((v, k) => {
      if (k == this.correct) next();
    });
  }
  throw new Error('Provide a correct Answer key');
});
module.exports = mongoose.model('Quiz', quizSchema);
