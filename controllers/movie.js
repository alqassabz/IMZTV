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

// Configure multer storage
// Configure multer storage
// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images'); // Set the destination folder for images
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Rename file with timestamp
  }
});

// Create the upload middleware
const upload = multer({ storage: storage }).single('poster'); // Only handling the 'poster' field

// Get function to render the add movie form
exports.movie_create_get = (req, res) => {
  res.render("movie/add");
}
exports.movie_details = (req, res) => {
  res.render('movie/detail'); // Assuming video-popup.ejs exists in your views folder
};



// Post function to handle the movie creation
exports.movie_create_post = (req, res) => {
  console.log("Incoming request:", req.body);
  upload(req, res, (err) => {
    if (err) {
      console.log("Upload error:", err);
      return res.send("Error uploading file.");
    }

    // Log the uploaded file
    console.log("Uploaded file:", req.file); 

    // Create a new Movie instance with the uploaded file information
    let movie = new Movie({
      title: req.body.name, // Correct field for title
      description: req.body.description,
      poster: req.file ? req.file.filename : null, // Use the uploaded file name
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