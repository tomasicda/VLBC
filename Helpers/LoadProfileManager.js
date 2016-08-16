var loadProfile = require('../Models/loadProfile');
var relayChannel = require('../Models/relayChannel');
var i2c = require('../Helpers/isquarecHelper');

var LoadProfileManager = module.exports = {

    startTimeSheduler: function () {

        function checkTimeSheduler() {
            var date = new Date();
            var currentHour = date.getHours();
            var currentMin = date.getMinutes();

            loadProfile.findOne({'Time.Hours': currentHour, 'Time.Minutes': currentMin},
                function (err, profile) {
                    if (err) throw err;

                    if (profile != null) {

                        i2c.automaticUpdate(profile);
                        console.log("LOAD PROFILE TIME: " + profile.Time.Hours + ":" + profile.Time.Minutes + " POWER: " + profile.Power);
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
        var timeOut = (60 - getSec) * 1000;

        console.log("Initial system start time: " + currentHour, ":" ,currentMin, " " , getSec);

        setTimeout(function () {

            LoadProfileManager.startTimeSheduler();

        }, timeOut);
    }
};

module.exports = LoadProfileManager;

