var express = require('express');
var manualSwitch = express.Router();
var relayChannel = require('../Models/relayChannel');
var dbConnection = require('../DAO/DBConnection');
var restrict = require('../DAO/Session');

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
        res.render('manualSwitch.ejs', {
            title: 'Manual Switch | VLBC',
            allChannels: channels
        });
    });
});

manualSwitch.post('/', restrict,function (req, res, next) {
    var channelOn = req.body.on;
    var channelOff = req.body.off;
    var channelNumber = req.body.channelNumber;
    var status;
    if (req.body.on !== undefined){
        status = req.body.on;
    } else{
        req.body.off;
    }

    relayChannel.update({channelNumber: channelNumber},
        {$set: {status: status}
    }, function (err, channels) {
            if (err){
                console.log(err);
                return res.status(500).send();
            }
            if (!channels){
                return res.status(401).send();
            }
        res.redirect('/manualSwitch');
    });
});

module.exports = manualSwitch;