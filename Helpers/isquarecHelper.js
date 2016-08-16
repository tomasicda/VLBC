var i2cLib = require('../node_modules/pcduino-i2c/pcduino-i2c');
var relayChannel = require('../Models/relayChannel');

var i2c = module.exports = {

    channelsNumber: 0,

    updateAll: function(channels, relayShieldNumber) {

    	i2c.channelsNumber = 0;

		for (var channel in channels) {

				console.log("CHANNEL: " + channels[channel].channelNumber + " STATUS -->>>" + channels[channel].status);

			if (channels[channel].status === true) {

				switch (channels[channel].channelNumber) {
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
			}
		}

		console.log('BYTE VALUE FOR RELAY SHIELD:::::::::::::: ' ,i2c.channelsNumber);
		i2cLib.init(relayShieldNumber);
		i2cLib.enable(i2c.channelsNumber);

    },
	
	automaticUpdate: function (profile) {

    	var channelsNumber =  0;
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
							channelsNumber += 1;
							break;
						case 2:
							channelsNumber+= 2;
							break;
						case 3:
							channelsNumber += 4;
							break;
						case 4:
							channelsNumber += 8;
							break;
						case 5:
							channelsNumber += 16;
							break;
						case 6:
							channelsNumber += 32;
							break;
						case 7:
							channelsNumber += 64;
							break;
						case 8:
							channelsNumber += 128;
							break;
					}

				} else {

					ch.status = false;
				}

				relayChannel.update({channelNumber: ch.channelNumber},
									{$set: {status: ch.status} },
					function (err, channel) {
						if (err) {
							console.log(err);
							return res.status(500).send();
						}
						if (!channel){
							return res.status(401).send();
						}
					}
				);

				counter += 1;

				return counter === 9;

			});

			console.log('BYTE VALUE FOR RELAY SHIELD::: ' , channelsNumber);
			i2cLib.init(32);
			i2cLib.enable(channelsNumber);

		});

	}
};

module.exports = i2c;
