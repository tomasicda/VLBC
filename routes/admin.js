var express = require('express');
var admin = express.Router();
var User = require('../Models/User');
var loadProfile = require('../Models/loadProfile');
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
admin.get('/loadProfiles', restrict,function (req, res, next) {

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


    res.render('loadProfiles', {
        title: 'load profiles - admin | VLBC'
    });
});


admin.post('/uploadExcelLoadProfile', restrict, function(req, res, next) {

    var profiles = req.body;

    loadProfile.remove().exec();

    profiles.forEach(function(profile) {

        var profe = new loadProfile({

            Time: {Hours: profile.Time.Hours, Minutes: profile.Time.Minutes },
            Power: parseFloat(profile.Power)

        });

        profe.save(function (err, name) {
            if(err) throw err;
            //console.log('profe goes here' + name);
        });

    });

});



/* GET home page. */
admin.get('/timeSchedules', restrict,function (req, res, next) {

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

    res.render('timeSchedules', {
        title: 'time shedules - admin | VLBC'
    });

});



/* getting relay channel details with ajax call */
admin.get('/relayChannels', restrict, function(req, res, next){


    relayChannel.find(function (err, channels) {
        if (err){
            console.log(err);
            return res.status(500).send();
        }
        if (!channels){
            return res.status(401).send();
        }

        console.log(channels);

        res.render('relayChannels', {
            title: 'relay channels - admin | VLBC',
            allChannels: channels
        });
    });

});


module.exports = admin;