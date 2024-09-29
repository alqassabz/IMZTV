//Import Models
//Load Dependencies
const dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const {Movie} = require("../models/Movie");
const multer = require('multer');
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');

// Create = HTTP GET and POST
// Read = HTTP GET
// Update = HTTP GET and POST
// Delete - HTTP DELETE 

// Configure storage for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images'));  // Save posters to /public/images
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);  // Save with the original filename
  }
});

// Configure storage for videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/trailers'));  // Save trailers to /public/trailers
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);  // Save with the original filename
  }
});

// Create multer instance with storage configurations
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, path.join(__dirname, '../public/images'));  // Save images (posters) to the /images folder
      } else if (file.mimetype.startsWith('video/')) {
        cb(null, path.join(__dirname, '../public/trailers'));  // Save videos (trailers) to the /trailers folder
      }
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);  // Save the file with the original name
    }
  }),
}).fields([
  { name: 'poster', maxCount: 1 },  // Poster (image)
  { name: 'trailer', maxCount: 1 }  // Trailer (video)
]);

// Movie creation POST handler
exports.movie_create_post = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).send('Error uploading file.');
    }

    // Retrieve title and description
    const title = Array.isArray(req.body.title) ? req.body.title[0] : req.body.title;
    const description = Array.isArray(req.body.description) ? req.body.description[0] : req.body.description;

    // Log file upload results
    console.log('Uploaded Files:', req.files);

    // Create the movie document with file references
    const movie = new Movie({
      title: title, 
      description: description, 
      poster: req.files.poster ? req.files.poster[0].filename : null,
      trailer: req.files.trailer ? req.files.trailer[0].filename : null,
    });

    // Save to the database
    movie.save()
      .then(() => res.redirect('/movie/index'))
      .catch((err) => {
        console.error('Database error:', err);
        res.status(500).send('Error saving movie.');
      });
  });
};




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



// Movies directory path (Desktop)
const movieDir = 'C:/Users/HP/Desktop/Movies';
// Trailers directory path (inside your project)
const trailerDir = path.join(__dirname, '..', 'public', 'trailers');

exports.movie_get = async (req, res) => {
  console.log('Fetching movie');

  const videoDir = 'C:/Users/HP/Desktop/Movies'; // Movies folder on your desktop

  try {
      // Fetch a single movie by its ID (passed via query params)
      const movie = await Movie.findById(req.query.id);

      // Check if the movie exists
      if (!movie) {
          return res.status(404).send('Movie not found');
      }

      // Get the name of the trailer without its extension
      const trailerName = path.basename(movie.trailer, path.extname(movie.trailer));

      // Construct the path to the video file in the Movies folder
      const videoPath = path.join(videoDir, movie.trailer);

      console.log(`Checking for video at: ${videoPath}`);

      // Check if the file exists in the Movies folder on the desktop
      let trailerPath = null;
      if (fs.existsSync(videoPath)) {
          // If the file exists, set the trailer path (this assumes your frontend is configured to serve from /movies)
          trailerPath = `/movies/${movie.trailer}`;
      }

      // Render the EJS template and pass the movie and trailer info
      res.render('movie/video', { movie, trailer: trailerPath });
  } catch (error) {
      console.error('Error fetching movie:', error);
      res.status(500).send('Server Error');
  }
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