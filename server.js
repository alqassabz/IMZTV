const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

// Require and Initialize dotenv
require('dotenv').config();

// Serve static files like CSS, images, etc.
app.use(express.static("public"))

const db = require('./config/db');

// Mock movie data
const getMoviesFromImages = () => {
  const imageDir = path.join(__dirname, 'public/images'); // Path to your images directory
  const files = fs.readdirSync(imageDir); // Read the directory

  // Create an array of movie objects
  return files.map(file => ({
    title: path.parse(file).name, // Extract title from filename (without extension)
    poster: `/images/${file}` // Construct image URL
  }));
};

// Route to render movies
app.get('/movies', (req, res) => {
  const movies = getMoviesFromImages(); // Get movies dynamically
  res.render('movie/index', { movies }); // Render your EJS page with movies
});

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Serve the home route and render the index.ejs
app.get('/', (req, res) => {
  const movies = getMoviesFromImages(); // Call the function to get movies
  res.render('index', { movies }); // Render the index view with movies
});

// Start the server
const PORT = process.env.PORT || 4050;

const movieRouter = require("./routes/movie");
app.use('/movie', movieRouter);



app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
