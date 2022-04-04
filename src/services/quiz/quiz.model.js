const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  choices: { type: Map, of: String },
  correct: String,
});

module.exports = mongoose.model('Quiz', quizSchema);
