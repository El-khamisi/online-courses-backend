const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    questions: [
      {
        question_name: { type: String },
        options: { type: Map, of: String },
        answer: { type: String },
      },
    ],
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    readings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reading' }],
  },
  { timestamps: true }
);

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
