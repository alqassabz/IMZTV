const passport = require('passport');
const User = require('../models/User');

exports.login_auth_google = passport.authenticate(
    'google',
    {
        scope: ['profile', 'email'],
    }
)

exports.callback_auth_google = passport.authenticate(
   'google',
   {
    successRedirect: '/home',
    failureRedirect: '/home'
   } 
)

exports.logout_auth_google = (req, res) => {
    req.logout(function () {
        res.redirect('/home');
    })
}

exports.user_update_get = (req, res) => {
    const userId = req.query.id;
    console.log('User ID:', userId);

    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found');
            }
            res.render('auth/edit', { user });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Server error');
        });
};

// Update user - POST
exports.user_update_post = (req, res) => {
    console.log('Request body:', req.body); // Log the whole body
    const { id, name } = req.body;

    console.log('Updating User ID:', id); // Log the ID being updated

    User.findByIdAndUpdate(id, { name }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found');
            }
            res.redirect("/home");
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Server error');
        });
};