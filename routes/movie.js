const express = require('express')
const Movie = require('../models/Movie')
const router = express.Router()

// Routes for movies
router.get('/movies', async (req, res) => {
  const movies = await Movie.find()
  res.json(movies)
})
// add movie
router.post('/movies', async (req, res) => {
  const movie = new Movie(req.body)
  await movie.save()
  res.json(movie)
})

module.exports = router
