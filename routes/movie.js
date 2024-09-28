const express = require('express');

const router = express.Router();

router.use(express.urlencoded({extended: true}))

// Controller
const movieCtrl = require("../controllers/movie")

// Routes
router.get("/add", movieCtrl.movie_create_get);
router.post("/add", movieCtrl.movie_create_post);
router.get("/index", movieCtrl.movie_index_get)
router.get('/detail', movieCtrl.movie_details) 


module.exports = router;