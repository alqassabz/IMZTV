const mongoose = require("mongoose")

mongoose.connect(process.env.MongoDBURL)
    .then(() => {
        console.log("MongoDb connected")
        const db = mongoose.connection;
        console.log(`mongoose conected to db: ${db.name} at Host: ${db.host} on Port: ${db.port}`);
    })
    .catch((err) => {
        console.log("MongoDB not connected" + err)
    })