var relayChannel = require('../Models/relayChannel');

var i2cByteNumberCalculator = module.exports = {

    byteNumber: 0,

    calculateByteNumberByStatusAndWrite: function(channels) {

    	i2cByteNumberCalculator.byteNumber = 0;

		for (var channel in channels) {

			//console.log("CHANNEL: " + channels[channel].channelNumber + " STATUS -->>>" + channels[channel].status);

			if (channels[channel].status === true) {

				switch (channels[channel].channelNumber) {
					case 1:
						i2cByteNumberCalculator.byteNumber += 1;
						break;
					case 2:
						i2cByteNumberCalculator.byteNumber += 2;
						break;
					case 3:
						i2cByteNumberCalculator.byteNumber += 4;
						break;
					case 4:
						i2cByteNumberCalculator.byteNumber += 8;
						break;
					case 5:
						i2cByteNumberCalculator.byteNumber += 16;
						break;
					case 6:
						i2cByteNumberCalculator.byteNumber += 32;
						break;
					case 7:
						i2cByteNumberCalculator.byteNumber += 64;
						break;
					case 8:
						i2cByteNumberCalculator.byteNumber += 128;
						break;
				}
			}
		}

		console.log("BYTE VALUE CALCULATED FOR RELAY SHIELD :::: " + i2cByteNumberCalculator.byteNumber);
		return i2cByteNumberCalculator.byteNumber;

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
							byteNumber += 1;
							break;
						case 2:
							byteNumber+= 2;
							break;
						case 3:
							byteNumber += 4;
							break;
						case 4:
							byteNumber += 8;
							break;
						case 5:
							byteNumber += 16;
							break;
						case 6:
							byteNumber += 32;
							break;
						case 7:
							byteNumber += 64;
							break;
						case 8:
							byteNumber += 128;
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

			console.log("BYTE VALUE CALCULATED FOR RELAY SHIELD :::: " + byteNumber);
			//i2cLib.init(32);
			//i2cLib.enable(byteNumber);

		});

	}
};

module.exports = i2cByteNumberCalculator;
