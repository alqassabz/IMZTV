const express = require('express');

const router = express.Router();

//controller
const homeCtrl = require('../controllers/home')

//routers
router.get('/home', homeCtrl.home_render)











module.exports = router;