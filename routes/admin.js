var express = require('express');
var admin = express.Router();
var User = require('../Models/User');
var relayChannel = require('../Models/relayChannel');
var dbConnection = require('../DAO/DBConnection');
var restrict = require('../DAO/Session');

/* GET home page. */
admin.get('/', restrict,function (req, res, next) {
    res.render('admin.ejs', {
        title: 'admin | VLBC'
    });
});

/* GET home page. */
admin.post('/loadProfiles', restrict,function (req, res, next) {

    var title = req.body.title;

    // relayChannel.find(function (err, channels) {
    //     if (err){
    //         console.log(err);
    //         return res.status(500).send();
    //     }
    //     if (!channels){
    //         return res.status(401).send();
    //     }
    //
    //     res.send(channels);
    // });

});


module.exports = admin;