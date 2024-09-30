//Import Models
//Load Dependencies
const dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
const axios = require('axios');

const {Movie} = require("../models/Movie");
const multer = require('multer');
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');

// Create = HTTP GET and POST
// Read = HTTP GET
// Update = HTTP GET and POST
// Delete - HTTP DELETE 
console.log('Current directory:', process.cwd());

fs.readdir('C:/Users/HP/Desktop/Movies', (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
  } else {
    console.log('Files in Movies directory:', files); // This will list all files
  }
});



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
      title: req.body.name, 
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



const movieDir = '/mnt/c/Users/HP/Desktop/Movies';  // Path to your movie directory

exports.movie_details = async (req, res) => {
  console.log('Fetching movie details');

  try {
    const movie = await Movie.findById(req.query.id);

    if (!movie) {
      return res.status(404).send('Movie not found');
    }

    const videoPath = path.join(movieDir, movie.trailer);
    console.log(`Checking for trailer video at: ${videoPath}`);

    let trailerPath = null;
    if (fs.existsSync(videoPath)) {
      console.log(`Trailer exists at: ${videoPath}`);
      trailerPath = `/movie/files/${movie.trailer}`;  // Adjust the path for client-side use
    }

    // Render movie details page and pass the trailer variable
    res.render('movie/detail', { movie, trailer: trailerPath });
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).send('Server Error');
  }
};




// const movieDir = '/mnt/c/Users/HP/Desktop/Movies';
// TMDb API key and URL
const tmdbApiKey = 'bfe15e0adbc363309f208398c25b287a';
const tmdbSearchUrl = 'https://api.themoviedb.org/3/search/movie';  // This is the missing line

exports.movie_get = async (req, res) => {
  console.log('Searching for movie by title from TMDb API');

  try {
    // Get the movie title from query parameter
    const movieTitle = req.query.title;

    if (!movieTitle) {
      console.log('Movie title not provided');
      return res.status(400).send('Movie title is required');
    }

    console.log(`Movie title received: ${movieTitle}`);

    // Search for the movie by title using TMDb API
    const tmdbResponse = await axios.get(tmdbSearchUrl, {
      params: {
        api_key: tmdbApiKey,
        query: movieTitle,
      },
    });

    console.log('TMDb API response received:', tmdbResponse.data);

    const movies = tmdbResponse.data.results;

    if (!movies || movies.length === 0) {
      console.log('No movie found with the provided title.');
      return res.status(404).send('Movie not found');
    }

    // If multiple movies are found, take the first result
    const movie = movies[0];
    console.log('Movie found:', movie);

    // Fetch trailer videos for the found movie
    const videoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos`, {
      params: {
        api_key: tmdbApiKey,
      },
    });

    console.log('Trailer API response received:', videoResponse.data);

    // Find a YouTube trailer
    const trailer = videoResponse.data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
    const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;

    console.log(`Trailer URL: ${trailerUrl || 'No trailer found'}`);

    // Render movie details and trailer
    res.render('movie/video', {
      movie,
      trailer: trailerUrl || 'Trailer not available',
      overview :movie.overview
    });
  } catch (error) {
    console.error('Error fetching movie or trailer:', error);
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