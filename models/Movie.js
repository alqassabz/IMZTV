const mongoose = require('mongoose')

// Review Schema
const reviewSchema = new mongoose.Schema({
  name: String,
  review: String,
  createdAt: { type: Date, default: Date.now }
})

const Review = mongoose.model('Review', reviewSchema)
// Movie Schema
const movieSchema = mongoose.Schema(
  {
    title: String,
    poster: String,
    description: String,
    trailer: String,
    genre: String,
    reviews: [reviewSchema]
  },
  {
    timestamps: true
  }
)

const Movie = mongoose.model('Movie', movieSchema)

module.exports = { Movie, Review }
