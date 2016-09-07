var loadProfile = require('../Models/loadProfile');
var relayChannel = require('../Models/relayChannel');
var relayChannelsManager = require('../Helpers/RelayChannelsManager');
var i2cManager = require('../Helpers/iSquareCManager');

var LoadProfileManager = module.exports = {

    startSimulation: function () {

        var date = new Date();
        var currentHours = date.getHours();
        var currentMinutes = date.getMinutes();
        var currentSeconds = date.getSeconds();
        var calculateTimeLeftFor = 'today';
        var query = {Time:{$gt:{Hours: currentHours, Minutes: currentMinutes}}};

        console.log("\n||==============================================");
        console.log("SIMULATION STARTED AT -> " + currentHours+ ":" + currentMinutes + ":" + currentSeconds + " HMS");
        console.log("||==============================================");

        // find and run current simulation (Load And Time Data Set) from load profile when system starts
        loadProfile.findOne({ Time: {$lte: {Hours: currentHours, Minutes: currentMinutes} } }).sort({Time: -1}).limit(1).exec(function (err, loadTimeDataSet) {

            if(err) throw err;

            if(loadTimeDataSet === null) {
                console.log("\n||==============================================");
                console.log("SYSTEM CAN'T FIND LOAD TIME DATA SET TO SIMULATE");
            } else {
                console.log("\n||==============================================");
                console.log("RUNNING CURRENT SIMULATION DATA SET......Power: " + loadTimeDataSet.Power + ".......TIME " + loadTimeDataSet.Time.Hours + ":" + loadTimeDataSet.Time.Minutes);
                i2cManager.automaticUpdate(loadTimeDataSet);
            }
        });

        // find next simulation load time data set and calculate seconds left to start
        function getNextSimulationDataSet(query, calculateTimeLeftFor, callback) {

            var nextLoadTimeDataSetWithTimeLeftToRun = null;

            loadProfile.findOne(query).exec(function (err, loadTimeDataSet) {

                if (err) throw err;

                if (loadTimeDataSet === null) {
                    // callback returns null and handled by execution callback function

                } else {

                    var date = new Date();
                    var nextLoadProfileTimeInSeconds, currentTimeInSeconds, secondsLeftForTimeOut;

                    function convertHoursToSeconds(hours){
                        return hours * 60 * 60;
                    }

                    function convertMinutesToSeconds(minutes){
                        return minutes * 60;
                    }

                    if(calculateTimeLeftFor === 'today') {
                        nextLoadProfileTimeInSeconds = convertHoursToSeconds(loadTimeDataSet.Time.Hours) + convertMinutesToSeconds(loadTimeDataSet.Time.Minutes);
                        currentTimeInSeconds = convertHoursToSeconds(date.getHours()) + convertMinutesToSeconds(date.getMinutes()) + date.getSeconds();
                        secondsLeftForTimeOut = nextLoadProfileTimeInSeconds - currentTimeInSeconds;

                    } else if (calculateTimeLeftFor === 'nextDay') {
                        nextLoadProfileTimeInSeconds = convertHoursToSeconds(loadTimeDataSet.Time.Hours) + convertMinutesToSeconds(loadTimeDataSet.Time.Minutes);
                        currentTimeInSeconds = convertHoursToSeconds(date.getHours()) + convertMinutesToSeconds(date.getMinutes()) + date.getSeconds();
                        var timeToNextDay = 86400 - currentTimeInSeconds;
                        secondsLeftForTimeOut =  timeToNextDay + nextLoadProfileTimeInSeconds;
                    }

                    loadTimeDataSet.TimeLeft = secondsLeftForTimeOut * 1000 ;
                    nextLoadTimeDataSetWithTimeLeftToRun = loadTimeDataSet;
                }

                callback(nextLoadTimeDataSetWithTimeLeftToRun);

            }); //database query ends here

        } //getNextSimulationDataSet ends here

        setupNextSimulation(query, calculateTimeLeftFor);

        function setupNextSimulation(query, calculateTimeLeftFor) {

            getNextSimulationDataSet(query, calculateTimeLeftFor, function(loadTimeDataSet) {

                if (loadTimeDataSet === null) {
                    console.log("::::::::::NEXT SIMULATION STARTS TOMORROW:::::::::");
                    var calculateTimeLeftFor = 'nextDay';
                    var query  = {Time:{$gte:{Hours: 0, Minutes: 0}}};
                    setupNextSimulation(query, calculateTimeLeftFor);

                } else {

                    console.log("NEXT SIMULATION DATA SET TO RUN......POWER: " + loadTimeDataSet.Power + "........TIME " + loadTimeDataSet.Time.Hours + ":" + loadTimeDataSet.Time.Minutes);
                    console.log("||==============================================");

                    setTimeout(function () {

                        console.log("\n||==============================================");
                        console.log("RUNNING CURRENT SIMULATION DATA SET......Power: " + loadTimeDataSet.Power + ".......TIME " + loadTimeDataSet.Time.Hours + ":" + loadTimeDataSet.Time.Minutes);

                        var date = new Date();
                        var today = 'today';
                        var query = {Time:{$gt:{Hours: date.getHours(), Minutes: date.getMinutes()}}};

                        i2cManager.automaticUpdate(loadTimeDataSet);
                        setupNextSimulation(query, today);

                    }, loadTimeDataSet.TimeLeft);
                }

            }); //getNextSimulationDataSet() ends here

        } //setupNextSimulation() ends here


    } //startSimulation ends here
};

module.exports = LoadProfileManager;

