const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  pdf: { type: String },
});

module.exports = mongoose.model('Reading', readingSchema);
