//var i2cLib = require('../node_modules/pcduino-i2cByteNumberCalculator/pcduino-i2cByteNumberCalculator');
var relayChannel = require('../Models/relayChannel');

var i2cManager = module.exports = {

    byteNumber: 0,
    
    write: function(byteNumber, relayShieldNumber) {

        console.log("INSIDE i2C MANAGER...............BYTE NUM " + byteNumber + "  SHIELD NUM " + relayShieldNumber);
        //i2cLib.init(relayShieldNumber);
        //i2cLib.enable(byteNumber);

    },

    calculateByteNumberByStatusAndWrite: function(channels, relayShieldNumber) {

        i2cManager.byteNumber = 0;

        for (var channel in channels) {
            //console.log("CHANNEL: " + channels[channel].channelNumber + " STATUS -->>>" + channels[channel].status);
            if (channels[channel].status === true) {

                switch (channels[channel].channelNumber) {
                    case 1:
                        i2cManager.byteNumber += 1;
                        break;
                    case 2:
                        i2cManager.byteNumber += 2;
                        break;
                    case 3:
                        i2cManager.byteNumber += 4;
                        break;
                    case 4:
                        i2cManager.byteNumber += 8;
                        break;
                    case 5:
                        i2cManager.byteNumber += 16;
                        break;
                    case 6:
                        i2cManager.byteNumber += 32;
                        break;
                    case 7:
                        i2cManager.byteNumber += 64;
                        break;
                    case 8:
                        i2cManager.byteNumber += 128;
                        break;
                }
            }
        }
        console.log("BYTE VALUE CALCULATED FOR RELAY SHIELD :::: " + i2cManager.byteNumber);
        i2cManager.write(i2cManager.byteNumber, relayShieldNumber);
    },

    automaticUpdate: function (profile) {

        console.log("CHECKING BYTE NUM IN AUTO UPDATE:^^^^^^^^^^^^^^^^ " + i2cManager.byteNumber);

        i2cManager.byteNumber =  0;
        var profilePower = profile.Power;

        relayChannel.find({}).sort({watts: 'desc'}).exec(function(err, channels) {
            if (err){
                console.log(err);
                return res.status(500).send();
            }
            if (!channels){
                return res.status(401).send();
            }


            var counter = 1;

            channels.forEach(function(ch) {

                if (ch.watts  <= profilePower) {

                    profilePower =  profilePower - ch.watts;

                    ch.status = true;

                    switch (ch.channelNumber) {
                        case 1:
                            i2cManager.byteNumber += 1;
                            break;
                        case 2:
                            i2cManager.byteNumber+= 2;
                            break;
                        case 3:
                            i2cManager.byteNumber += 4;
                            break;
                        case 4:
                            i2cManager.byteNumber += 8;
                            break;
                        case 5:
                            i2cManager.byteNumber += 16;
                            break;
                        case 6:
                            i2cManager.byteNumber += 32;
                            break;
                        case 7:
                            i2cManager.byteNumber += 64;
                            break;
                        case 8:
                            i2cManager.byteNumber += 128;
                            break;
                    }

                } else {

                    ch.status = false;
                }

                relayChannel.update({channelNumber: ch.channelNumber},
                    {$set: {status: ch.status} },
                    function (err, channel) {
                        if (err)
                            console.log(err);
                        if (!channel)
                            console.log("\nCOULD NOT FIND CHANNEL TO UPDATE in 12c MANAGER\n");
                    }
                );

                counter += 1;

                return counter === 9;

            });

            console.log("BYTE VALUE CALCULATED FOR RELAY SHIELD :::: " + i2cManager.byteNumber);
            i2cManager.write(i2cManager.byteNumber, 32);
        });

    }


};

module.exports = i2cManager;
