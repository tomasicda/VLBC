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

module.exports = manualSwitch;
