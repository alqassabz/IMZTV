const mongoose = require('mongoose')

const movieSchema = mongoose.Schema(
  {
    title: String,
    poster: String,
    description: String,
    trailer: String,
    genre: String
  },
  {
    timestamps: true
  }
)

const Movie = mongoose.model('Movie', movieSchema)

module.exports = { Movie }
