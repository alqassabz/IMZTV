const express = require('express');

const router = express.Router();

const authCtrl = require("../controllers/auth");

router.get('/auth/google', authCtrl.login_auth_google);

router.get('/oauth2callback', authCtrl.callback_auth_google);

router.get('/logout', authCtrl.logout_auth_google);

module.exports = router;