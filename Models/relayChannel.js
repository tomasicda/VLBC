var mongoose = require('mongoose');


var relayChannelSchema = new mongoose.Schema({
    channelNumber: Number,
    status: Boolean
});

var relayChannel = mongoose.model('relayChannel', relayChannelSchema, 'relayChannel');
module.exports = relayChannel;