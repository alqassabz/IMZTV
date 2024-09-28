const express = require('express');

const mongoose = require('mongoose');

const expressLayouts = require('express-ejs-layouts')



//the pot here because we hiding .env file
PORT = 4050;

//const expressLayouts = require('express-ejs-layouts')

const app = express();

app.set("view engine", "ejs")

// lock in views folder a file name layout.ejs
app.use(expressLayouts)

//Routes
const homeRouter = require('./routes/home')



//use
app.use('/', homeRouter);


//show the port
app.listen(PORT, () => {
    console.log(`The Port is: ${PORT}`);
})