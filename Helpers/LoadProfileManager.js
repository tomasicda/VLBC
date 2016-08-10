var loadProfile = require('../Models/loadProfile');


var LoadProfileManager = module.exports = {

    startTimeSheduler: function () {

        var date2 = new Date();
        var currentHour2 = date2.getHours();
        var currentMin2 = date2.getMinutes();
        var getSec2 = date2.getSeconds();

        console.log(currentHour2, ":" ,currentMin2, " " , getSec2);

        checkTimeSheduler();

        function checkTimeSheduler() {
            var date = new Date();
            var currentHour = date.getHours();
            var currentMin = date.getMinutes();

            loadProfile.findOne({'Time.Hours': currentHour, 'Time.Minutes': currentMin},
                function (err, profile) {
                    if (err) throw err;

                    console.log("mongo" + profile.Time.Hours + ":" + profile.Time.Minutes )

                });
        }

        setInterval(function () {

            var date1 = new Date();
            var currentHour1 = date1.getHours();
            var currentMin1 = date1.getMinutes();
            var getSec1 = date1.getSeconds();

            console.log(currentHour1, ":" ,currentMin1, " " , getSec1);

            checkTimeSheduler();

        }, 60000);
    },

    timeSheduler: function () {

        var date = new Date();
        var currentHour = date.getHours();
        var currentMin = date.getMinutes();
        var getSec = date.getSeconds();
        var timeOut = (60 - getSec) * 1000;

        console.log(currentHour, ":" ,currentMin, " " , getSec);

        setTimeout(function () {

            LoadProfileManager.startTimeSheduler();

        }, timeOut);
    }
};

module.exports = LoadProfileManager;

