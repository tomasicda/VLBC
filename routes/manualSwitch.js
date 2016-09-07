var express = require('express');
var manualSwitch = express.Router();
var relayChannel = require('../Models/relayChannel');
var dbConnection = require('../DAO/DBConnection');
var restrict = require('../DAO/Session');
//var i2cByteNumberCalculator = require('../Helpers/iSquareCByteNumberCalculator');
var i2cManager = require('../Helpers/iSquareCManager');

// test
var channelsManager = require('../Helpers/RelayChannelsManager');

/* GET manualSwitch page. */
manualSwitch.get('/', restrict,function (req, res, next) {

    relayChannel.find(function (err, channels) {
        if (err){
            console.log(err);
            return res.status(500).send();
        }
        if (!channels){
            return res.status(401).send();
        }

        i2cManager.calculateByteNumberByStatusAndWrite(channels, 32);

        res.render('manualSwitch.ejs', {
            title: 'Manual Switch | VLBC',
            allChannels: channels
        });
    });
});

manualSwitch.post('/switch', restrict,function (req, res, next) {
 
    var channelNumber = req.body.channelNumber;
    var status = req.body.status;

    relayChannel.update({channelNumber: channelNumber},
        {$set: {status: status}, $inc: { switchCount: 1 }
    }, function (err, channels) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        }
        if (!channels){
            return res.status(401).send();
        }
        res.send({
            channelNum: channelNumber,
            channelStatus: status
        });
    });
});

module.exports = manualSwitch;
