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
    successRedirect: '/',
    failureRedirect: '/'
   } 
)

exports.logout_auth_google = (req, res) => {
    req.logout(function () {
        res.redirect('/');
    })
}

exports.user_update_get = (req, res) => {
    const userId = req.query.id;
    console.log('User ID:', userId);

    if (!userId) {
        return res.status().send('User ID is required');
    }

    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status().send('User not found');
            }
            res.render('auth/edit', { user });
        })
        .catch(err => {
            console.log(err)
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
                console.log(err);
                
            }
            res.redirect("/home");
        })
        .catch(err => {
            console.log(err);
            
            
        });
};