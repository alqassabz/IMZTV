const express = require('express')

const insurelogedin = require('../config/insurelogedin')

const router = express.Router()

router.use(express.urlencoded({ extended: true }))
const axios = require('axios')

// Controller
const movieCtrl = require('../controllers/movie')

// Routes
router.get('/video', insurelogedin, movieCtrl.movie_get)
router.get('/add', movieCtrl.movie_create_get)
router.get('/review', movieCtrl.movie_review_get)
router.post('/review', movieCtrl.movie_review_post)
router.get('/delete', movieCtrl.movie_delete_get)
router.get('/deleted', movieCtrl.movie_deleted_get)
router.post('/add', movieCtrl.movie_create_post)
router.get('/index', movieCtrl.movie_index_get)
router.get('/detail', insurelogedin, movieCtrl.movie_details)
// router.get('/movies/:title', async (req, res) => {
//   // ...
//   res.render('movies', { title: titles[0].clear_title, streamingOptions });
// });

module.exports = router
