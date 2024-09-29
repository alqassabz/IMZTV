const { name } = require('ejs');
const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    name: String,
    isAdult: Boolean,
}, {
    timestamps: true
})

const Profile = mongoose.model("Profile", profileSchema);

module.exports = {Profile};