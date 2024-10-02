//Import Models
//Load Dependencies
const dayjs = require('dayjs')
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
const axios = require('axios')

const { Movie } = require('../models/Movie')
const multer = require('multer')
const path = require('path')
const formidable = require('formidable')
const fs = require('fs')
const { generateKeyPair } = require('crypto')

// Create = HTTP GET and POST
// Read = HTTP GET
// Update = HTTP GET and POST
// Delete - HTTP DELETE

// const movieDir = '/mnt/c/Users/HP/Desktop/Movies';
// TMDb API key and URL
const tmdbApiKey = 'bfe15e0adbc363309f208398c25b287a'
const tmdbSearchUrl = 'https://api.themoviedb.org/3/search/movie' // This is the missing line
console.log('Current directory:', process.cwd())

// fs.readdir('C:/Users/HP/Desktop/Movies', (err, files) => {
//   if (err) {
//     console.error('Error reading directory:', err);
//   } else {
//     console.log('Files in Movies directory:', files); // This will list all files
//   }
// });

// Configure storage for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/images')) // Save posters to /public/images
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname) // Save with the original filename
  }
})

// Configure storage for videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/trailers')) // Save trailers to /public/trailers
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname) // Save with the original filename
  }
})

// Create multer instance with storage configurations
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, path.join(__dirname, '../public/images')) // Save images (posters) to the /images folder
      } else if (file.mimetype.startsWith('video/')) {
        cb(null, path.join(__dirname, '../public/trailers')) // Save videos (trailers) to the /trailers folder
      }
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname) // Save the file with the original name
    }
  })
}).fields([
  { name: 'poster', maxCount: 1 }, // Poster (image)
  { name: 'trailer', maxCount: 1 } // Trailer (video)
])

// Movie creation POST handler
exports.movie_create_post = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err)
      return res.status(400).send('Error uploading file.')
    }

    // Retrieve title
    const title = Array.isArray(req.body.title)
      ? req.body.title[0]
      : req.body.name

    // Log file upload results
    console.log('Uploaded Files:', req.files)

    // Check if movie title is provided
    if (!title) {
      console.log('Movie title not provided')
      return res.status(400).send('Movie title is required')
    }

    console.log(`Movie title received: ${title}`)

    try {
      // Search for the movie by title using TMDb API
      const tmdbResponse = await axios.get(tmdbSearchUrl, {
        params: {
          api_key: tmdbApiKey,
          query: title
        }
      })

      const movies = tmdbResponse.data.results
      if (!movies || movies.length === 0) {
        console.log('No movie found with the provided title.')
        return res.status(404).send('Movie not found')
      }

      // Get the first movie result
      const movieData = movies[0] // Renamed to avoid confusion
      console.log('Movie found:', movieData)

      // Fetch trailer videos for the found movie
      const videoResponse = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieData.id}/videos`,
        {
          params: { api_key: tmdbApiKey }
        }
      )

      const trailer = videoResponse.data.results.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
      )
      const trailerUrl = trailer
        ? `https://www.youtube.com/watch?v=${trailer.key}`
        : null

      console.log(`Trailer URL: ${trailerUrl || 'No trailer found'}`)

      // Prepare the poster URL and local saving path
      const baseUrl = 'https://image.tmdb.org/t/p/'
      const size = 'w500' // You can change this to any valid size like 'w185', 'w342', etc.
      const posterPath = movieData.poster_path // Get the poster_path from your TMDb data
      const fullPosterUrl = `${baseUrl}${size}${posterPath}`
      console.log(fullPosterUrl) // Outputs the full poster URL

      // Download and save the poster image
      const response = await axios({
        url: fullPosterUrl,
        method: 'GET',
        responseType: 'stream'
      })

      // Use the original poster's filename
      const posterFileName = path.basename(posterPath) // Use the base name of the posterPath
      const localPosterPath = path.join(
        __dirname,
        '../public/images',
        posterFileName
      )

      // Create a write stream to save the image
      const writer = fs.createWriteStream(localPosterPath)

      // Pipe the response data to the file
      response.data.pipe(writer)

      writer.on('finish', async () => {
        console.log('Image downloaded successfully.')

        // Create the movie document with file references
        const movie = new Movie({
          title: title,
          description: movieData.overview, // Use movieData instead of movie
          poster: fullPosterUrl, // Store the full URL in the database
          trailer: trailerUrl || null, // Store the trailer URL if available
          genre: req.body.genre
        })

        // Save to the database
        try {
          await movie.save()
          console.log('Movie saved successfully to the database.')
          res.redirect('/')
        } catch (saveError) {
          console.error('Database error:', saveError)
          res.status(500).send('Error saving movie.')
        }
      })

      writer.on('error', (err) => {
        console.error('Error writing image to disk:', err)
        res.status(500).send('Error saving the movie image.')
      })
    } catch (error) {
      console.error('Error fetching movie or trailer:', error)
      res.status(500).send('Server Error')
    }
  })
}

// Get function to render the add movie form
exports.movie_create_get = (req, res) => {
  res.render('movie/add')
}

exports.movie_review_get = (req, res) => {
  Movie.find()
    .then((movies) => {
      res.render('movie/review', { movies, id: req.query.id })
    })
    .catch((err) => {
      console.log(err)
    })
}

const movieDir = '/mnt/c/Users/HP/Desktop/Movies' // Path to your movie directory

exports.movie_get = async (req, res) => {
  console.log('Fetching movie details')

  try {
    const movie = await Movie.findById(req.query.id)

    if (!movie) {
      return res.status(404).send('Movie not found')
    }

    // Define the trailers directory path inside the public folder
    const trailersDir = path.join(__dirname, '..', 'public', 'trailers')
    // Construct the video path using the movie title and an appropriate extension (e.g., .mp4)
    const videoPath = path.join(trailersDir, `${movie.title}.mp4`)
    console.log(`Checking for trailer video at: ${videoPath}`)

    let trailerPath = null
    // Check if the file exists in the trailers directory
    if (fs.existsSync(videoPath)) {
      console.log(`Trailer exists at: ${videoPath}`)
      // Adjust the path for client-side use, relative to the public folder
      trailerPath = `/trailers/${movie.title}.mp4` // Ensure the trailer path is correct
    } else {
      console.log(`Trailer not found at: ${videoPath}`)
    }

    // Render movie details page and pass the trailer variable
    res.render('movie/video', { movie, trailer: trailerPath })
  } catch (error) {
    console.error('Error fetching movie:', error)
    res.status(500).send('Server Error')
  }
}

exports.movie_details = async (req, res) => {
  console.log('Searching for movie by title from TMDb API')

  try {
    const movieTitle = req.query.title

    if (!movieTitle) {
      console.log('Movie title not provided')
      return res.status(400).send('Movie title is required')
    }

    console.log(`Movie title received: ${movieTitle}`)

    // Search for the movie by title using TMDb API
    const tmdbResponse = await axios.get(tmdbSearchUrl, {
      params: {
        api_key: tmdbApiKey,
        query: movieTitle
      }
    })

    const movies = tmdbResponse.data.results
    if (!movies || movies.length === 0) {
      console.log('No movie found with the provided title.')
      return res.status(404).send('Movie not found')
    }

    // Get the first movie result
    const movie = movies[0]
    console.log('Movie found:', movie)

    // Fetch trailer videos for the found movie
    const videoResponse = await axios.get(
      `https://api.themoviedb.org/3/movie/${movie.id}/videos`,
      {
        params: { api_key: tmdbApiKey }
      }
    )

    const trailer = videoResponse.data.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    )
    const trailerUrl = trailer
      ? `https://www.youtube.com/watch?v=${trailer.key}`
      : null

    console.log(`Trailer URL: ${trailerUrl || 'No trailer found'}`)

    // Find the movie in the database by title
    const movieObj = await Movie.findOne({ title: movieTitle })

    if (!movieObj) {
      console.log('Movie not found in the database.')
      return res.status(404).send('Movie not found in the database.')
    }

    console.log('Database Movie _id:', movieObj._id.toString())

    // Update description in the database
    movieObj.description = movie.overview

    // Keep the full URL in the movie object (assuming this was previously set in movie_create_post)
    movieObj.poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : null

    // Save the updated movie object to the database
    try {
      await movieObj.save()
      console.log('Movie updated successfully in the database.')
    } catch (saveError) {
      console.error('Error saving the movie:', saveError)
      return res.status(500).send('Error updating the movie in the database.')
    }

    // Render movie details and trailer
    res.render('movie/detail', {
      movie,
      trailer: trailerUrl || 'Trailer not available',
      overview: movie.overview,
      id: movieObj._id.toString()
    })
  } catch (error) {
    console.error('Error fetching movie or trailer:', error)
    res.status(500).send('Server Error')
  }
}

exports.movie_index_get = (req, res) => {
  Movie.find()
    .then((movies) => {
      res.render('movie/index', { movies, dayjs })
    })
    .catch((err) => {
      console.log(err)
    })
}
