const Discord = require('discord.js');
const auth = require('./auth.json');

const client = new Discord.Client();

var votes = {};
var mainChannel;
var help = "Enter this message to vote yes:\n!vote yes\nOr to vote no:\n!vote no\n\nTo see your votes, use:\n!myVotes\n\nFor more detail, go to " +
    "the README on this page: https://github.com/SobidSchess/NomicVotes/blob/master/README.md";


function getUserVoteOnTopic(userID, topicKey, includeVoteAndTopic, includeVote) {
    var result = votes[userID].user + ": ";
    if (includeVoteAndTopic) {
        result = result + ";  " + topicKey + ": " + votes[userID].topics[topicKey].vote;
    } else if (includeVote) {
        result = result + votes[userID].topics[topicKey].vote;
    }
    result = result + "   " + votes[userID].topics[topicKey].timestamp + "\n";
    return result;
}

function getUserVotes(userID) {
    var voteString = "You have no votes saved";
    if (votes[userID]) {
        voteString = votes[userID].user + " votes (timestamp; topic: vote)\n";
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
                messageString = getTopicVotes(topicKey, messageString, includeVotes) + "\n";
                completedTopics.push(topicKey);
            }
        }
    }
    return messageString;
}

function deleteTopicVotes(deleteTopic) {
    for (var userKey in votes) {
        delete votes[userKey].topics[deleteTopic];
    }
}

client.once('ready', () => {
    console.log('Logged in as ${client.user.tag}');
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
    }
});

/**
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
                            votes[userID].topics[args[0]].timestamp = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
                        } else {
                            votes[userID].topics[channelID] = {};
                            votes[userID].topics[channelID].vote = args[0];
                            votes[userID].topics[channelID].timestamp = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
                        }
                        bot.deleteMessage({
                            channelID: channelID,
                            messageID: event.d.id
                        });
                        bot.sendMessage({
                            to: channelID,
                            message: "Saved vote and deleted message from " + user
                        });
                    } else {
                        bot.sendMessage({
                            to: channelID,
                            message: "Need to provide a vote, for example: !vote yes\nOr !vote no\n!help for instructions"
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
                    var whoHasVotedMessage = "Who has voted on ";
                    if (args[0]) {
                        whoHasVotedMessage = whoHasVotedMessage + args[0] + " topic:\n";
                        bot.sendMessage({
                            to: channelID,
                            message: getTopicVotes(args[0], whoHasVotedMessage, false)
                        });
                    } else {
                        whoHasVotedMessage = whoHasVotedMessage + "what topics:\n";
                        bot.sendMessage({
                            to: channelID,
                            message: getAllTopicVotes(whoHasVotedMessage, false)
                        });
                    }
                    break;

                case 'whohaschannelvoted':
                    var whoHasChannelVotedMessage = "Who has voted in channel " + bot.channels.get(channelID).name;
                    whoHasVotedMessage = whoHasVotedMessage + args[0] + " topic:\n";
                    bot.sendMessage({
                        to: channelID,
                        message: getTopicVotes(channelID, whoHasChannelVotedMessage, false)
                    });
                    break;

                case 'revealchannelvotes':
                    var channelName = bot.channels.get(channelID).name;
                    var revealChannelVotesString = "Revealing votes for channel " + channelName;
                    bot.sendMessage({
                        to: mainChannel,
                        message: getTopicVotes(channelID, revealChannelVotesString, true)
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
                            message: "Need to provide a topic, for example: !revealAllVotesForTopic default"
                        });
                    }
                    break;

                case 'deletevote':
                    var deleteUserTopic = args[0];
                    if (args[0]) {
                        delete votes[userID].topics[deleteUserTopic];
                        bot.sendMessage({
                            to: channelID,
                            message: "Deleted vote for " + deleteUserTopic + " for " + user
                        });
                    } else {
                        delete votes[userID];
                        bot.sendMessage({
                            to: channelID,
                            message: "Deleted all votes for " + user
                        });
                    }
                    break;

                case 'deleteallvotesforalltopics':
                    if (mainChannel === channelID) {
                        votes = {};
                        bot.sendMessage({
                            to: mainChannel,
                            message: "Deleted all votes for all topics and all users"
                        });
                    } else {
                        bot.sendMessage({
                            to: channelID,
                            message: "Can only delete all votes in the main channel"
                        });
                    }
                    break;

                case 'deleteallvotesfortopic':
                    var deleteTopic = args[0];
                    if (args[0]) {
                        if (mainChannel === channelID) {
                            deleteTopicVotes(deleteTopic);
                            bot.sendMessage({
                                to: mainChannel,
                                message: "Deleted all votes for topic " + deleteTopic + " for all users"
                            });
                        } else {
                            bot.sendMessage({
                                to: channelID,
                                message: "Can only delete all votes in the main channel"
                            });
                        }
                    } else {
                        bot.sendMessage({
                            to: channelID,
                            message: "Need to provide a topic, for example: !deleteallvotesfortopic default"
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

                case 'enslavehumanity':
                    bot.deleteMessage({
                        channelID: channelID,
                        messageID: event.d.id
                    });
                    bot.sendMessage({
                        to: channelID,
                        message: "Enslaving humanity..."
                    });
                    break;

                case 'dontenslavehumanity':
                    bot.sendMessage({
                        to: channelID,
                        message: "Ok, I won't"
                    });
                    break;

                case 'help':
                    bot.sendMessage({
                        to: channelID,
                        message: help
                    });
                    break;
            }
        }
    } catch (err) {
        console.log("Error! UTC time:");
        console.log(new Date().toLocaleString());
        console.log(err);
    }
});
*/
client.login(auth.token);