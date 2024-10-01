const express = require('express');

const mongoose = require('mongoose');

const expressLayouts = require('express-ejs-layouts')

require('dotenv').config();

const session = require('express-session')
const passport = require('passport')



require('dotenv').config();

//the pot here because we hiding .env file
const PORT = process.env.PORT

const app = express();

app.use(express.urlencoded({ extended: true }));
require('./config/passport')
const db = require('./config/db')

app.set("view engine", "ejs")




//passport and Sassion configurations
app.use(session ({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

//Share the information with other pages
app.use(function(req, res, next)  {
    res.locals.user = req.user;
    next();
})

app.use(express.static("public"))




app.use(expressLayouts)

//Routes
const homeRouter = require('./routes/home');
const authRouter = require('./routes/auth');
// const profileRouter = require('./routes/profile');

//use
app.use('/', homeRouter);
app.use('/', authRouter);
// app.use('/profile', profileRouter);

//show the port
app.listen(PORT, () => {
    console.log(`The Port is: ${PORT}`);
})


//http://localhost:4050/user/update?id=USER_ID
