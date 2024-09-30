// const Profile = require("../models/profile")


// exports.profile_create_get = (req, res) => {
//     res.render('profiles/add');
// };
// exports.profile_create_post = (req, res) => {
//     const { name, avatar } = req.body;
//     const newProfile = new Profile({ name, avatar, userId: req.user._id }); // Assuming user is authenticated

//     newProfile.save()
//         .then(() => {
//             res.redirect('profile/add');
//         })
//         .catch(err => {
//             console.log(err);
//             res.send('Please try again later');
//         });
// };

// // Get all profiles for the logged-in user
// exports.profile_index_get = (req, res) => {
//     Profile.find({ userId: req.user._id }) // Assuming user is authenticated
//         .then(profiles => {
//             res.render('profile/index', { profile});
//         })
//         .catch(err => {
//             console.log(err);
//             res.send('An error occurred while retrieving profiles');
//         });
// };

// // Get a specific profile
// exports.profile_show_get = (req, res) => {
//     Profile.findById(req.params.id)
//         .then(profile => {
//             if (!profile) {
//                 return res.send('Profile not found'); // Handle not found
//             }
//             res.render('profiles/detail', { profile });
//         })
//         .catch(err => {
//             console.log(err);
//             res.send('An error occurred while retrieving the profile');
//         });
// };

// // Render the edit form for a specific profile
// exports.profile_edit_get = (req, res) => {
//     Profile.findById(req.params.id)
//         .then(profile => {
//             if (!profile) {
//                 return res.send('Profile not found'); // Handle not found
//             }
//             res.render('profiles/edit', { profile });
//         })
//         .catch(err => {
//             console.log(err);
//             res.send('An error occurred while retrieving the profile');
//         });
// };

// // Handle updating a specific profile
// exports.profile_update_post = (req, res) => {
//     Profile.findByIdAndUpdate(req.body.id, req.body)
//         .then(() => {
//             res.redirect('/profiles');
//         })
//         .catch(err => {
//             console.log(err);
//             res.send('An error occurred while updating the profile');
//         });
// };

// // Handle deleting a specific profile
// exports.profile_delete_get = (req, res) => {
//     Profile.deleteOne({ "_id": req.params.id })
//         .then(() => {
//             res.redirect('/profiles');
//         })
//         .catch(err => {
//             console.log(err);
//             res.send('An error occurred while deleting the profile');
//         });
// };
