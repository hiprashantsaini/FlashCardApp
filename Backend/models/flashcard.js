const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  front: String,
  back: String,
  EF: { type: Number, default: 2.5 },
  interval: { type: Number, default: 1 },
  repetition: { type: Number, default: 0 },
  lastReviewed: Date,
  nextReviewDate: { type: Date, default: Date.now },
});
const Flashcard=mongoose.model('Flashcard', flashcardSchema);;
module.exports = Flashcard;