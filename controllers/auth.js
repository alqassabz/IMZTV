const passport = require('passport');

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
        res.redirect('/home')
    })
}