var express = require('express');
var admin = express.Router();
var User = require('../Models/User');
var loadProfileDataSet = require('../Models/ProfileDataSet');
var relayChannel = require('../Models/relayChannel');
var dbConnection = require('../DAO/DBConnection');
var loadProfile = require('../Models/LoadProfile');
var restrict = require('../DAO/Session');

/* GET home page. */
admin.get('/', restrict,function (req, res, next) {
    res.render('admin.ejs', {
        title: 'admin | VLBC'
    });
});

/* GET home page. */
admin.get('/loadProfiles', restrict,function (req, res, next) {

    var date = new Date();
    var getHour = date.getHours();
    var getMin = date.getMinutes();
    var getSec = date.getSeconds();


    console.log(getHour + ":" + getMin + " " + getSec);

    loadProfileDataSet.find(function (err, profiles) {
        if (err){
            console.log(err);
            return res.status(500).send();
        }
        if (!profiles){
            return res.status(401).send();
        }

        // var count = 0;
        // profiles.forEach(function(profile) {
        //
        // });

        
        res.render('loadProfiles', {
            title: 'load profiles - admin | VLBC',
            loadProfiles: profiles
        });
        
    });

});


admin.post('/uploadExcelLoadProfile', restrict, function(req, res, next) {

    var profiles = req.body;
    var loadProfileName = profiles.shift();
    loadProfileName = loadProfileName.LoadProfileName;

    console.log(loadProfileName);


    loadProfile.create({LoadProfileName: loadProfileName}, function (err, savedProfile) {
        if (err) throw err;

        profiles.forEach(function(profile) {

            var profe = new loadProfileDataSet({
                LoadProfileName: loadProfileName,
                Time: {Hours: profile.Time.Hours, Minutes: profile.Time.Minutes },
                Power: parseFloat(profile.Power)

            });

            profe.save(function (err, name) {
                if(err) throw err;
                //console.log('profe goes here' + name);
            });

        });

        res.send({apple: "Apple"});
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

        // channels.forEach(function(channel) {
        //    console.log(channel.channelNumber);
        //     console.log(channel.watts);
        //
        // });

        res.render('relayChannels', {
            title: 'relay channels - admin | VLBC',
            allChannels: channels
        });
    });

});

admin.post('/resetRelayCount', restrict, function(req, res, next){

    var data = req.body;

    relayChannel.findOneAndUpdate({channelNumber: data.channelNumber},
                                  {$set: {switchCount: 0}},
                                  {new: true}, function (err, channel) {

        if(err) throw err;

        res.send({switchCount: channel.switchCount});
    });

});


module.exports = admin;