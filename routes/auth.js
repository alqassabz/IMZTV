const express = require('express');

const router = express.Router();

const authCtrl = require("../controllers/auth");

router.get('/auth/google', authCtrl.login_auth_google);

router.get('/oauth2callback', authCtrl.callback_auth_google);

router.get('/logout', authCtrl.logout_auth_google);

router.get('/users', (req, res) => {
    User.find()
        .then(users => {
            res.render('userList', { users }); // Ensure this matches your EJS file name
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Server error');
        });
});

router.get('/user/update', authCtrl.user_update_get);
router.post('/user/update', authCtrl.user_update_post);

module.exports = router;