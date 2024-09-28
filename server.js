const express = require('express');

const mongoose = require('mongoose');

const expressLayouts = require('express-ejs-layouts')

require('dotenv').config();

//the pot here because we hiding .env file
PORT = 4050;

const app = express();

const db = require('./config/db')

app.set("view engine", "ejs")


require('./config/passport')








app.use(expressLayouts)

//Routes
const homeRouter = require('./routes/home')



//use
app.use('/', homeRouter);


//show the port
app.listen(PORT, () => {
    console.log(`The Port is: ${PORT}`);
})