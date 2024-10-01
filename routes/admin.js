const express = require('express')

const router = express.Router();

const adminCtrl = require('../controllers/admin')

router.get('/', adminCtrl.admin_render)






module.exports = router;