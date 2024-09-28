//Import Models
//Load Dependencies
const dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const {Movie} = require("../models/Movie");
const multer = require('multer');
const path = require('path');

// Create = HTTP GET and POST
// Read = HTTP GET
// Update = HTTP GET and POST
// Delete - HTTP DELETE 

// Configure multer storage for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Set the destination folder for images
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep the original file name for images
  }
});

// Configure multer storage for videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/videos'); // Set the destination folder for videos
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep the original file name for videos
  }
});

// Create the upload middleware
const upload = multer({ storage: imageStorage }).fields([
  { name: 'poster', maxCount: 1 }, // For images
  { name: 'trailer', maxCount: 1 }  // For videos
]);


// Get function to render the add movie form
exports.movie_create_get = (req, res) => {
  res.render("movie/add");
}


exports.movie_details = async (req, res) => {
  try {
    const movieId = req.query.id; // Get the ID from query params
    if (!movieId) {
        return res.status(400).send('Movie ID is required'); // Handle missing ID
    }
    
    const movie = await Movie.findById(movieId);
    if (!movie) {
        return res.status(404).send('Movie not found'); // Handle case where movie is not found
    }
    res.json(movie); // Send the movie details back to the client
} catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
};



exports.movie_create_post = (req, res) => {
  console.log("Incoming request:", req.body);
  
  upload(req, res, (err) => {
    if (err) {
      console.log("Upload error:", err);
      return res.send("Error uploading file.");
    }

    // Log the uploaded files
    console.log("Uploaded files:", req.files); 

    // Create a new Movie instance with the uploaded file information
    let movie = new Movie({
      title: req.body.name,
      description: req.body.description,
      poster: req.files.poster && req.files.poster.length > 0 ? req.files.poster[0].filename : null, // Use the uploaded poster file name
      trailer: req.files.trailer && req.files.trailer.length > 0 ? req.files.trailer[0].filename : null // Use the uploaded trailer file name
    });

    // Save the Movie
    movie.save()
      .then(() => {
        res.redirect("/movie/index");
      })
      .catch((err) => {
        console.log("Database save error:", err);
        res.send("Please try again later!!!");
      });
  });
};










exports.movie_index_get = (req, res)=>{
  Movie.find()
  .then((movies) =>{
    res.render("movie/index", {movies, dayjs})
  })
  .catch((err)=>{
    console.log(err)
  })
}