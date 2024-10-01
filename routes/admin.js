const express = require('express')

const router = express.Router();

const adminCtrl = require('../controllers/admin')

const insurelogedin = require('../config/insurelogedin')

router.get('/', insurelogedin, adminCtrl.admin_render)






module.exports = router;