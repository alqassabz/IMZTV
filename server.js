const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');

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
        // Check if the poster field is valid
        if (!movie.poster) {
            return {
                ...movie.toObject(),
                poster: null // or a default image URL if desired
            };
        }

        // Extract just the filename from the poster URL
        const posterFilename = path.basename(movie.poster); // Get the filename from URL
        const imageFile = files.find(file => file === posterFilename); // Find corresponding image file

        return {
            ...movie.toObject(), // Convert Mongoose Document to plain JavaScript object
            poster: imageFile ? `/images/${imageFile}` : null // Construct image URL if found
        };
    });
};

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Use express layouts
app.use(expressLayouts);

// Serve the home route and render the index.ejs
app.get('/', async (req, res) => {
    const movies = await getMoviesWithImages(); // Call the function to get movies
    res.render('index', { movies }); // Render the index view with movies
});

// Serve the static movie files first
app.use('/movie/files', express.static('/mnt/c/Users/HP/Desktop/Movies'));

// Import movie-related routes
const movieRoutes = require('./routes/movie'); 
app.use('/movie', movieRoutes);

// Start the server
const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
