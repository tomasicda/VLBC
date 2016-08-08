var mongoose = require('mongoose');

var loadProfileSchema = new mongoose.Schema({
    Time: { Hours: Number, Minutes: Number },
    Power: Number
});

var loadProfile = mongoose.model('loadProfile', loadProfileSchema, 'loadProfile');
module.exports = loadProfile;