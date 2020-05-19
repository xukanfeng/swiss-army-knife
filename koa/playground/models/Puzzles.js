const mongoose = require('mongoose')

const PuzzlesSchema = new mongoose.Schema({
  userName: String,
  setup: String,
  punchline: String,
}, {timestamps: true});

module.exports = mongoose.model('Puzzles', PuzzlesSchema)