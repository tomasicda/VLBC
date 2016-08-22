var loadProfile = require('../Models/loadProfile');
var relayChannel = require('../Models/relayChannel');
var relayChannelsManager = require('../Helpers/RelayChannelsManager');
//var i2c = require('../Helpers/isquarecHelper');

var LoadProfileManager = module.exports = {

    timeSheduler: function () {

        var date1 = new Date();
        var currentHours1 = date1.getHours();
        var currentMinutes1 = date1.getMinutes();
        var currentSeconds1 = date1.getSeconds();

        console.log("\n||===============================================");
        console.log("SYSTEM STARTS AT TIME : " + currentHours1+ ":" + currentMinutes1 + ":" + currentSeconds1 + " HMS");

        // find and run current load profile when system starts
        loadProfile.findOne({ Time: {$lte: {Hours: currentHours1, Minutes: currentMinutes1} } }).sort({Time: -1}).limit(1).exec(function (err, startProfile) {

            if(err) throw err;

            if(startProfile === null) {
                console.log("\n||===============================================");
                console.log("NO CURRENT PROFILE TO RUN");
            } else {
                console.log("\n||===============================================");
                console.log("RUNNING CURRENT PROFILE.......Power: " + startProfile.Power + ".......TIME " + startProfile.Time.Hours + ":" + startProfile.Time.Minutes);
                //i2c.automaticUpdate(startProfile);
            }
        });


        // find and get next profile details
        function findNextLoadProfile(callback) {

            var nextLoadProfileWithTimeOut = null;

            var date2 = new Date();
            var currentHours2 = date2.getHours();
            var currentMinutes2 = date2.getMinutes();


            loadProfile.findOne({ Time: {$gt: { Hours: currentHours2, Minutes: currentMinutes2 }} }).exec(function (err, profile) {

                if (err) throw err;

                // getting current time to compare with next load profile time
                var date3 = new Date();
                var currentHours3 = date3.getHours();
                var currentMinutes3 = date3.getMinutes();
                var currentSeconds3 = date3.getSeconds();

                // IF COULD NOT FIND NEXT LOAD PROFILE IN DATABASE THEN GET FIRST ONE IF EXISTS.
                if (profile === null) {
                    console.log("\n||===============================================");
                    console.log("COULD NOT FIND NEXT LOAD PROFILE IN DATABASE");

                    var nextProfile;

                    // get first profile with lowest number in Time
                    loadProfile.findOne({}, {}, {sort: {Time: 1}}, function(err, profile) {

                        if(err) throw err;

                        if(profile === null) {

                            console.log("\n||===============================================");
                            console.log("NO LOAD PROFILE FOUND.");
                            // do nothing....

                        } else {

                            console.log("\n||===============================================");
                            console.log("NEXT LOAD PROFILE TO RUN........POWER: " + profile.Power + "........TIME " + profile.Time.Hours + ":" + profile.Time.Minutes);

                            // getting current time to compare with next load profile time
                            var date3 = new Date();
                            var currentHours3 = date3.getHours();
                            var currentMinutes3 = date3.getMinutes();
                            var currentSeconds3 = date3.getSeconds();

                            // calculate and return time left for setInterval or timeout
                            var nextLoadProfileTimeInSeconds = hoursToSeconds(profile.Time.Hours) + minutesToSeconds(profile.Time.Minutes);
                            var currentTimeInSeconds = hoursToSeconds(currentHours3) + minutesToSeconds(currentMinutes3) + currentSeconds3;
                            var timeToNextDay = 86400 - currentTimeInSeconds;
                            var secondsLeftForTimeOut =  timeToNextDay + nextLoadProfileTimeInSeconds;

                            profile.TimeOut = secondsLeftForTimeOut * 1000 ;

                            function hoursToSeconds(hours){
                                return hours * 60 * 60;
                            }

                            function minutesToSeconds(minutes){
                                return minutes * 60;
                            }

                        }

                        nextProfile = profile;


                        //nextLoadProfileWithTimeOut = nextProfile;

                        console.log("nextProfileNEXTNEXTPROFILE: " + nextProfile.TimeOut);


                    });

                    //nextLoadProfileWithTimeOut = nextProfile;


                } else {

                    console.log("\n||===============================================");
                    console.log("NEXT LOAD PROFILE TO RUN........POWER: " + profile.Power + "........TIME " + profile.Time.Hours + ":" + profile.Time.Minutes);

                    // calculate and return time left for setInterval or timeout
                    var nextLoadProfileTimeInSeconds = hoursToSeconds(profile.Time.Hours) + minutesToSeconds(profile.Time.Minutes);
                    var currentTimeInSeconds = hoursToSeconds(currentHours3) + minutesToSeconds(currentMinutes3) + currentSeconds3;
                    var secondsLeftForTimeOut = nextLoadProfileTimeInSeconds - currentTimeInSeconds;

                    console.log("\n||===============================================");
                    console.log("nextLoadProfileTimeInSeconds " + nextLoadProfileTimeInSeconds);
                    console.log("currentTimeInSeconds " + currentTimeInSeconds);
                    console.log("secondsLeftForTimeOut " + secondsLeftForTimeOut);


                    profile.TimeOut = secondsLeftForTimeOut * 1000 ;

                    function hoursToSeconds(hours){
                        return hours * 60 * 60;
                    }

                    function minutesToSeconds(minutes){
                        return minutes * 60;
                    }

                    nextLoadProfileWithTimeOut = profile;

                }

                callback(nextLoadProfileWithTimeOut);
            });

        }


        runNextLoadProfile();


        function runNextLoadProfile() {

            findNextLoadProfile(function(profile) {

                if (profile === null) {
                    // do nothing...
                    console.log("JUST BEFORE TIME OUT SETUP, PROFILE FOUND NULLLLLLL");

                } else {

                    setTimeout(function () {

                        console.log("\n||===============================================");
                        console.log("RUNNING CURRENT PROFILE.......Power: " + profile.Power + ".......TIME " + profile.Time.Hours + ":" + profile.Time.Minutes);


                        //i2c.automaticUpdate(nextProfileToRun);
                        runNextLoadProfile();

                    }, profile.TimeOut);
                }


            });


        }




    }
};

module.exports = LoadProfileManager;

