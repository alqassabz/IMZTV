const express = require('express');

const router = express.Router();

router.use(express.urlencoded({extended: true}))
const axios = require('axios')

// Controller
const movieCtrl = require("../controllers/movie")

// Routes
router.get('/video', movieCtrl.movie_get) 
router.get("/add", movieCtrl.movie_create_get);
router.post("/add", movieCtrl.movie_create_post);
router.get("/index", movieCtrl.movie_index_get)
router.get('/detail', movieCtrl.movie_details) 
// router.get('/movies/:title', async (req, res) => {
//   // ...
//   res.render('movies', { title: titles[0].clear_title, streamingOptions });
// });



module.exports = router;