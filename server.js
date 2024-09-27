const express = require('express');

const mongoose = require('mongoose');

const app = express();

//the pot here because we hiding .env file
PORT = 4050;

//Routes







app.listen(PORT, () => {
    console.log(`The Port is: ${PORT}`);
})