const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

// Initialize dotenv
dotenv.config()

// Create an Express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// Connect to MongoDB
const mongoUrl = process.env.MONGO_URL

if (!mongoUrl) {
  console.error('MONGO_URL is not defined in the .env file')
  process.exit(1) // Exit the process if MONGO_URL is not defined
}

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
  })

// Define routes
const movieRoutes = require('./routes/movieRoutes')
app.use('/api/movies', movieRoutes)
app.use('/api', require('./routes')) // Make sure this is correctly set up

// Catch-all route for undefined routes
app.use((req, res, next) => {
  res.status(404).send({ error: 'Route not found' })
  next()
})

// Start the server
const PORT = 4050
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`)
})
