var Discord = require('discord.io-gateway6');
var auth = require('./auth.json');

var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

var votes = {};
var mainChannel;

function getUserVoteOnTopic(userID, topicKey, includeVote) {
    var result = votes[userID].user + ": " + votes[userID].topics[topicKey].timestamp;
    if (includeVote) {
        result = result + ";  " + topicKey + ": " + votes[userID].topics[topicKey].vote;
    }
    result = result + "\n";
    return result;
}

function getUserVotes(userID) {
    var voteString = "You have no votes saved";
    if (votes[userID]) {
        voteString = votes[userID].user + " votes:\n";
        for (var topicKey in votes[userID].topics) {
            voteString = voteString + getUserVoteOnTopic(userID, topicKey, true)
        }
    }
    return voteString;
}

function getTopicVotes(topicKey, messageString, includeVotes) {
    messageString = messageString + "Votes on " + topicKey + ":\n";
    for (var userKey in votes) {
        if (votes[userKey].topics[topicKey]) {
            messageString = messageString + getUserVoteOnTopic(userKey, topicKey, includeVotes);
        }
    }
    return messageString;
}

function getAllTopicVotes(messageString, includeVotes) {
    var completedTopics = [];
    for (var userKey in votes) {
        for (var topicKey in votes[userKey].topics) {
            if (!completedTopics.includes(topicKey)) {
                messageString = getTopicVotes(topicKey, messageString, includeVotes);
                completedTopics.push(topicKey);
            }
        }
    }
    return messageString;
}

bot.on('ready', function() {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('message', function(user, userID, channelID, message, event) {
    try {
        if (message.substring(0, 1) == '!') {
            var args = message.substring(1).split(' ');
            var cmd = args[0].toLowerCase();

            args = args.splice(1);
            switch (cmd) {
                case 'vote':
                    if (args[0]) {
                        if (!votes[userID]) {
                            votes[userID] = {};
                        }
                        if (!votes[userID].topics) {
                            votes[userID].topics = {};
                        }
                        if (!votes[userID].user) {
                            votes[userID].user = user;
                        }
                        if (args[1]) {
                            votes[userID].topics[args[0]] = {};
                            votes[userID].topics[args[0]].vote = args[1];
                            votes[userID].topics[args[0]].timestamp = new Date().toLocaleString();
                        } else {
                            votes[userID].topics.current = {};
                            votes[userID].topics.current.vote = args[0];
                            votes[userID].topics.current.timestamp = new Date().toLocaleString();
                        }
                        bot.sendMessage({
                            to: channelID,
                            message: getUserVotes(userID)
                        });
                    } else {
                        bot.sendMessage({
                            to: channelID,
                            message: "Need to provide a vote, for example: !vote yes\nOr !vote 354 no"
                        });
                    }
                    break;

                case 'myvotes':
                    bot.sendMessage({
                        to: channelID,
                        message: getUserVotes(userID)
                    });
                    break;

                case 'whohasvoted':
                    var whoHasVotedMessage = "Who has voted on what topics:\n";
                    bot.sendMessage({
                        to: channelID,
                        message: getAllTopicVotes(whoHasVotedMessage, false)
                    });
                    break;

                case 'revealallvotesforalltopics':
                    if (mainChannel === channelID) {
                        var revealAllVotesString = "Revealing votes!\n";
                        bot.sendMessage({
                            to: mainChannel,
                            message: getAllTopicVotes(revealAllVotesString, true)
                        });
                    } else {
                        bot.sendMessage({
                            to: channelID,
                            message: "Votes reveals are only in the main channel"
                        });
                    }
                    break;

                case 'revealallvotesfortopic':
                    var revealTopic = args[0];
                    if (args[0]) {
                        if (mainChannel === channelID) {
                            var revealAllVotesForTopicString = "Revealing votes for " + revealTopic + "!\n";
                            bot.sendMessage({
                                to: mainChannel,
                                message: getTopicVotes(revealTopic, revealAllVotesForTopicString, true)
                            });
                        } else {
                            bot.sendMessage({
                                to: channelID,
                                message: "Votes reveals are only in the main channel"
                            });
                        }
                    } else {
                        bot.sendMessage({
                            to: channelID,
                            message: "Need to provide a topic, for example: !revealAllVotesForTopic current"
                        });
                    }
                    break;

                case 'deletevote':
                    delete votes[userID];
                    bot.sendMessage({
                        to: channelID,
                        message: "Deleted votes for " + user
                    });
                    break;

                case 'deleteallvotes':
                    if (mainChannel === channelID) {
                        votes = {};
                        bot.sendMessage({
                            to: mainChannel,
                            message: "Deleted all votes for all users"
                        });
                    } else {
                        bot.sendMessage({
                            to: channelID,
                            message: "Can only delete all votes in the main channel"
                        });
                    }
                    break;

                case 'setmain':
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

                case 'testmain':
                    bot.sendMessage({
                        to: channelID,
                        message: mainChannel === channelID ? "This is the main channel" : "This is not the main channel"
                    });
                    break;

                case 'reassure':
                    bot.sendMessage({
                        to: channelID,
                        message: "You made the right choice!"
                    });
                    break;


            }
        }
    } catch (err) {
        console.log("Error! ");
        console.log(new Date().toLocaleString());
        console.log(err);
    }
});