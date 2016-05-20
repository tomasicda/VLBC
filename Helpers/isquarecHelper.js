/**
 * Created by preetzdomain on 20/05/2016.
 */
var i2cLib = require('../pcduino-node-i2c/node/build/Release/pcduino-i2c');



/*
 // how it will be used in routes

 var counter = require('./counter.js');
 counter.add();
 console.log(counter.count);
 */

// counter.js
// var i2c = module.exports = {
//     count: 1,
//     add: function() {
//         Counter.count += 10;
//     },
//     remove: function() {
//         Counter.count += 10;
//     }
// }



var i2c = module.exports = {

    channelsNumber: 0,

    updateOne: function (channelNumber, channelStatus, relayShieldNumber) {

        if (channelStatus === true) {

            switch (channelNumber) {

                case 1:
                    i2c.channelsNumber += 1;
                    break;

                case 2:
                    i2c.channelsNumber += 2;
                    break;

                case 3:
                    i2c.channelsNumber += 4;
                    break;

                case 4:
                    i2c.channelsNumber += 8;
                    break;

                case 5:
                    i2c.channelsNumber += 16;
                    break;

                case 6:
                    i2c.channelsNumber += 32;
                    break;

                case 7:
                    i2c.channelsNumber += 64;
                    break;

                case 8:
                    i2c.channelsNumber += 128;
                    break;

            }

        } else if (channelStatus === false) {

            switch (channelNumber) {

                case 1:
                    i2c.channelsNumber -= 1;
                    break;

                case 2:
                    i2c.channelsNumber -= 2;
                    break;

                case 3:
                    i2c.channelsNumber -= 4;
                    break;

                case 4:
                    i2c.channelsNumber -= 8;
                    break;

                case 5:
                    i2c.channelsNumber -= 16;
                    break;

                case 6:
                    i2c.channelsNumber -= 32;
                    break;

                case 7:
                    i2c.channelsNumber -= 64;
                    break;

                case 8:
                    i2c.channelsNumber -= 128;
                    break;
            }


        }


        i2cLib.init(relayShieldNumber);
        i2cLib.enable(i2c.channelsNumber);

    },

    updateAll: function(channels) {

        channels.forEach(i2c.updateOne(channel.channelNumber, channel.status, 32));

    }
    
};

module.exports = i2c;