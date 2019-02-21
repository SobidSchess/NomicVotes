var Discord = require('discord.io-gateway6');
var auth = require('./auth.json');
 
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

var votes = {};
var mainChannel;
 
bot.on('ready', function() {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
});
 
bot.on('message', function(user, userID, channelID, message, event) {
	if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            case 'vote':
				var separator = ":  ";
				if (!votes[userID]) {
					votes[userID] = user + " votes";
				} else {
					separator = "; ";
				}
                if (args[1]) {
					votes[userID] = votes[userID] + separator + args[0] + ":" + args[1];
				} else {
					votes[userID] = votes[userID] + separator + args[0];
				}
				bot.sendMessage({
					to: channelID,
					message: votes[userID]
				});
				break;
				
			case 'deleteVote':
				votes[userID] = null;
				bot.sendMessage({
					to: channelID,
					message: "Deleted votes for " + user
				});
				break;
				
			case 'deleteAllVotes':
				if (mainChannel === channelID) {
					votes = {};
					bot.sendMessage({
						to: mainChannel,
						message: "Deleted all votes"
					});
				} else {
					bot.sendMessage({
						to: mainChannel,
						message: "Can only delete all votes in the main channel, " + user
					});
				}
				break;
				
			case 'reveal':
				if (mainChannel === channelID) {
					var voteString = "Revealing votes!\n"
					for (var userKey in votes) {
											console.log('here3');
						voteString = voteString + votes[userKey] + "\n";
					}
					bot.sendMessage({
						to: mainChannel,
						message: voteString
					});
				} else {
					bot.sendMessage({
						to: mainChannel,
						message: "Votes reveals are only in the main channel, " + user
					});
				}
				break;
				
			case 'setMain':
				var message = "Setting main channel to " + channelID
				if (mainChannel) {
					bot.sendMessage({
						to: channelID,
						message: "Main channel is already set to " + mainChannel
					});
				} else {
					bot.sendMessage({
						to: channelID,
						message: "Setting main channel to " + channelID
					});
					mainChannel = channelID
				}
				break;
				
			case 'testMain':
				bot.sendMessage({
					to: channelID,
					message: mainChannel === channelID ? "This is the main channel" : "This is not the main channel"
				});
				break;

         }
     }
});