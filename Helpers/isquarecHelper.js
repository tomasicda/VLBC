/**
 * Created by preetzdomain on 20/05/2016.
 */

var i2cLib = require('../node_modules/pcduino-i2c/pcduino-i2c');

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

	var channel1 = 1;
	var channel2 = 2;
	var channel3 = 4;
	var channel4 = 8;
	var channel5 = 16;
	var channel6 = 32;
	var channel7 = 64;
	var channel8 = 128;


var i2c = module.exports = {

    channelsNumber: 0,

    updateAll: function(channels, relayShieldNumber) {
	i2c.channelsNumber = 0;
	for (var channel in channels){
			console.log('STATUS VALUE:::::::::::::: ' ,channels[channel].status);
		if (channels[channel].status === true){
			switch (channels[channel].channelNumber ){
				case 1:
					i2c.channelsNumber += 1;
					break;
				case 2:
					i2c.channelsNumber += 2;
					console.log('VALUE:::::::::::::: ' ,i2c.channelsNumber);					
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
		}
	}
	console.log('VALUE:::::::::::::: ' ,i2c.channelsNumber);
        i2cLib.init(relayShieldNumber);
        i2cLib.enable(i2c.channelsNumber);
    }
};

module.exports = i2c;
