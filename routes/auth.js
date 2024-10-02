const express = require('express');
const router = express.Router();
const authCtrl = require("../controllers/auth");
const insurelogedin = require('../config/insurelogedin');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images'); // Ensure this points to the correct directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// Set up multer
const upload = multer({ dest: path.join(__dirname,'../public/images/') });

// Google authentication routes
router.get('/auth/google', authCtrl.login_auth_google);
router.get('/oauth2callback', authCtrl.callback_auth_google);
router.get('/logout', authCtrl.logout_auth_google);

// User list route
router.get('/users', insurelogedin, (req, res) => {
    User.find()
        .then(users => {
            res.render('userList', { users });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Server error');
        });
});

// User update routes
router.get('/user/update', insurelogedin, authCtrl.user_update_get);
router.post('/user/update',upload.single('image'), insurelogedin, authCtrl.user_update_post);

// // Update avatar routes
// router.get('/user/update-avatar', insurelogedin, authCtrl.edit_avatar_get);
// router.post('/user/update-avatar', insurelogedin, upload.single('image'),authCtrl.edit_avatar_post);

module.exports = router;
