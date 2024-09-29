const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const  expressLayouts = require('express-ejs-layouts');

// Require and Initialize dotenv
require('dotenv').config();

// Serve static files like CSS, images, etc.
app.use(express.static("public"));

// Connect to the database (assuming you have this set up correctly)
const db = require('./config/db');
const { Movie } = require('./models/Movie'); // Adjust the path according to your project structure

// Function to get movies with images
const getMoviesWithImages = async () => {
  const movies = await Movie.find(); // Fetch movies from the database
  const imageDir = path.join(__dirname, 'public/images'); // Path to your images directory
  const files = fs.readdirSync(imageDir); // Read the directory

  // Create an array of movie objects, combining DB data with image paths
  return movies.map(movie => {
    const imageFile = files.find(file => file === movie.poster);console.log(`/images/${imageFile}`) // Find corresponding image file
    return {
      ...movie.toObject(), // Convert Mongoose Document to plain JavaScript object
      
      poster: imageFile ? `/images/${imageFile}` : null // Construct image URL if found
    };
  });
};

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Look in views folder for a file named layout.ejs
app.use(expressLayouts);

// Route to render movies
app.get('/movie/detail', async (req, res) => {
  const movies = await getMoviesWithImages(); // Get the movies with images
  const movieId = req.query.id; // Get the movie ID from the query
  const movie = movies.find(m => m._id.toString() === movieId); // Find the movie based on the ID

  if (movie) {
    res.render('movie/detail', { movie }); // Pass the movie to the EJS template
  } else {
    res.status(404).send('Movie not found'); // Handle not found case
  }
});

// Serve the home route and render the index.ejs
app.get('/', async (req, res) => {
  const movies = await getMoviesWithImages(); // Call the function to get movies
  res.render('index', { movies }); // Render the index view with movies
});

const movieRoutes = require('./routes/movie'); // Adjust the path as necessary


app.use('/movie', movieRoutes);
app.use('/trailers', express.static('C:/Users/HP/Desktop/Movies'));




// Start the server
const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
