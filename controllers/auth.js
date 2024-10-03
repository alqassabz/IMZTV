const passport = require('passport');
const User = require('../models/User');
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

const upload = multer({ storage: storage });



exports.login_auth_google = passport.authenticate(
    'google',
    {
        scope: ['profile', 'email'],
    }
);

exports.callback_auth_google = passport.authenticate(
    'google',
    {
        successRedirect: '/',
        failureRedirect: '/'
    }
);

exports.logout_auth_google = (req, res) => {
    req.logout(function () {
        res.redirect('/');
    });
};

exports.user_update_get = (req, res) => {
    const userId = req.query.id;

    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    User.findById(req.query.id)
        .then(auth => {
            if (!auth) {
                return res.status(404).send('User not found');
            }
            res.render('auth/edit', { auth });
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('Server error');
        });
};

// Update user - POST
exports.user_update_post = (req, res) => {
    // const { id, name } = req.body;

    // User.findByIdAndUpdate(id, { name }, { new: true })
    //     .then(user => {
    //         if (!user) {
    //             return res.status(404).send('User not found');
    //         }
    //         res.redirect("/");
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).send('Error updating user');
    //     });
    console.log("here")
    console.log(req.body)
    console.log(req.file)
    if(req.file){
        req.body.image = req.file.filename
    }
        User.findByIdAndUpdate(req.user._id, req.body)
        .then(()=>{
            res.redirect('/')
        })
        .catch((err)=>{
            console.log(err)
        })
};