const { name } = require('ejs');
const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    name: { type: String, required: true },
    avatar: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true }
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;