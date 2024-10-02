const Movie = require('../models/Movie') // Ensure the correct path
const { Router } = require('express')
const router = Router()

// Function to send a placeholder message
exports.movieLists = async (req, res) => {
  res.send('IMZ TV is on the way')
}

// Function to insert a single movie
exports.insertSingleMovie = async (req, res) => {
  const newMovie = new Movie({
    title: req.body.title,
    description: req.body.description,
    year: req.body.year,
    rating: req.body.rating
  })

  try {
    const savedMovie = await newMovie.save()
    res.status(201).json(savedMovie)
  } catch (error) {
    res.status(400).json({ message: 'Error adding movie', error })
  }
}

// Function to list all movies
exports.listMovies = async (req, res) => {
  try {
    const movies = await Movie.find({})
    res.status(200).json(movies)
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving movies', error })
  }
}

// Function to update a single movie
exports.updateSingleMovie = async (req, res) => {
  const paramID = req.params.id

  try {
    const updateMovie = await Movie.findByIdAndUpdate(paramID, req.body, {
      new: true,
      runValidators: true
    })

    if (!updateMovie) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    res.json(updateMovie)
  } catch (error) {
    res.status(400).json({ message: 'Error updating movie', error })
  }
}

// Function to delete a single movie
exports.deleteSingleMovie = async (req, res) => {
  const paramID = req.params.id

  try {
    const deletedMovie = await Movie.findByIdAndDelete(paramID)

    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found' })
    }

    res.json({ message: 'Movie deleted successfully', deletedMovie })
  } catch (error) {
    res.status(400).json({ message: 'Error deleting movie', error })
  }
}
