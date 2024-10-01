const express = require('express');

const router = express.Router();

const authCtrl = require("../controllers/auth");

const insurelogedin = require('../config/insurelogedin')

router.get('/auth/google', authCtrl.login_auth_google);

router.get('/oauth2callback', authCtrl.callback_auth_google);

router.get('/logout', authCtrl.logout_auth_google);

router.get('/users', insurelogedin, (req, res) => {
    User.find()
        .then(users => {
            res.render('userList', { users }); // Ensure this matches your EJS file name
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Server error');
        });
});

router.get('/user/update', insurelogedin, authCtrl.user_update_get);
router.post('/user/update', insurelogedin, authCtrl.user_update_post);

module.exports = router;