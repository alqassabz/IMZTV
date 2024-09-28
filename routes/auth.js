const express = require('express');

const router = express.Router();

const authCtrl = require("../controllers/auth");

router.get('/auth/google', authCtrl.login_auth_google)

router.get('/authcallback', authCtrl.callback_auth_google)

router.get('/logout', authCtrl.login_auth_google)

module.exports = router;