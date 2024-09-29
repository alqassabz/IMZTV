const express = require('express')

const mongoose = require('mongoose')

const dotenv = require('dotenv')

const cors = require('cors')

const app = express()

dotenv.config()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/api', require('./routes'))

mongoose.connect(
  process.env.MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  () => {
    console.log('Connected to MongoDB')
  }
)

//the pot here because we hiding .env file
PORT = 4050

//Routes

app.listen(PORT, () => {
  console.log(`The Port is: ${PORT}`)
})

const movieRoutes = require('./routes/movies')
app.use('/api/movies', movieRoutes)
