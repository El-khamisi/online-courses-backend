const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  pdf: { type: String },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
});

module.exports = mongoose.model('Reading', readingSchema);
