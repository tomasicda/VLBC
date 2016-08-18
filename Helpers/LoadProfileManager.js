var loadProfile = require('../Models/loadProfile');
var relayChannel = require('../Models/relayChannel');
var relayChannelsManager = require('../Helpers/RelayChannelsManager');
var i2c = require('../Helpers/isquarecHelper');

var LoadProfileManager = module.exports = {

    startTimeSheduler: function () {

        //get next one
        // db.loadProfile.findOne({Time: {$gt: {Hours: 0, Minutes: 59}} })

        // Get last one
        //db.loadProfile.find({Time: {$lt: {Hours: 1, Minutes: 00}} }).sort({Time: -1}).limit(1)

        function checkTimeSheduler() {
            var date = new Date();
            var currentHour = date.getHours();
            var currentMin = date.getMinutes();

            loadProfile.findOne({'Time.Hours': currentHour, 'Time.Minutes': currentMin},
                function (err, profile) {
                    if (err) throw err;

                    if (profile != null) {

                        i2c.automaticUpdate(profile);

                        console.log("LOAD PROFILE TIME: " + profile.Time.Hours + " hours : " + profile.Time.Minutes + "minutes POWER: " + profile.Power);
                    }

                });
        }

        checkTimeSheduler();

        setInterval(function () {

            var date1 = new Date();
            var currentHour1 = date1.getHours();
            var currentMin1 = date1.getMinutes();
            var getSec1 = date1.getSeconds();

            console.log("CURRENT SYSTEM(OS) TIME: " + currentHour1 + ":" + currentMin1  + " : " + getSec1);

            checkTimeSheduler();

        }, 60000);
    },

    timeSheduler: function () {

        var date = new Date();
        var currentHour = date.getHours();
        var currentMin = date.getMinutes();
        var getSec = date.getSeconds();

        var setIntervalTime = 0;
        var nextProfileToRun;
        //var timeOut = (60 - getSec) * 1000;

        console.log("Initial system start time: " + currentHour, ":" ,currentMin, ":" , getSec);


        // find and run current load profile when system starts
        loadProfile.find({Time: {$lt: {Hours: 1, Minutes: 00}} }).sort({Time: -1}).limit(1).exec(function (err, startProfile) {
            console.log(startProfile.Power);
            i2c.automaticUpdate(startProfile);
        });

        //

        function findNextLoadProfile() {

            // find next load profile and store information in local variable
            loadProfile.findOne({Time: {$gt: {Hours: 0, Minutes: 59}} }).exec(function (err, nextProfile) {

                nextProfileToRun = nextProfile;

                console.log(nextProfile.Power);

                var hours = nextProfile.Time.Hours - currentHour;
                var minutes = nextProfile.Time.Minutes - currentMin;

                var hoursToMinutes = hours * 60;

                setIntervalTime = hoursToMinutes + minutes;

            });

        }

        findNextLoadProfile();



        setInterval(function () {

            i2c.automaticUpdate(nextProfileToRun);

            findNextLoadProfile();

            console.log(setIntervalTime);

        }, setIntervalTime);



        // setTimeout(function () {
        //
        //     LoadProfileManager.startTimeSheduler();
        //
        // }, timeOut);
    }
};

module.exports = LoadProfileManager;

