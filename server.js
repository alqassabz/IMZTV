const express = require('express');

const mongoose = require('mongoose');

const expressLayouts = require('express-ejs-layouts')

require('dotenv').config();

const session = require('express-session')
const passport = require('passport')

//the pot here because we hiding .env file
PORT = 4050;

const app = express();

const db = require('./config/db')

app.set("view engine", "ejs")


require('./config/passport')

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






app.use(expressLayouts)

//Routes
const homeRouter = require('./routes/home');
const authRouter = require('./routes/auth');


//use
app.use('/', homeRouter);
app.use('/', authRouter);

//show the port
app.listen(PORT, () => {
    console.log(`The Port is: ${PORT}`);
})