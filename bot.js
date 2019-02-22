const Discord = require('discord.js');
const auth = require('./auth.json');

const client = new Discord.Client();

var votes = {};
var mainChannel;
var help = "Enter this message to vote yes:\n!vote yes\nOr to vote no:\n!vote no\n\nTo see your votes, use:\n!myVotes\n\nFor more detail, go to " +
    "the README on this page: https://github.com/SobidSchess/NomicVotes/blob/master/README.md";


function getUserVoteOnTopic(userID, topicKey, includeVote) {
    var result = votes[userID].user + ": ";
    if (includeVote) {
        result = result + votes[userID].topics[topicKey].vote;
    }
    result = result + "   " + votes[userID].topics[topicKey].timestamp + "\n";
    return result;
}

function getUserVotes(userID) {
    var voteString = "You have no votes saved";
    if (votes[userID]) {
        voteString = votes[userID].user + " votes (user, votes, timestamp)\n";
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
    console.log('Logged in');
});

client.on('message', msg => {
    try {
        if (msg.content.substring(0, 1) == '!') {
            var args = msg.content.substring(1).split(' ');
            var cmd = args[0].toLowerCase();
            var userID = msg.author.id;
            var user = msg.author.username;
            var channel = msg.channel;
            var channelID = channel.id;
            var channelName = channel.name;

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
                        msg.delete();
                        channel.send("Saved vote and deleted message from " + user);
                    } else {
                        channel.send("Need to provide a vote, for example: !vote yes\nOr !vote no\n!help for instructions");
                    }
                    break;

                case 'myvotes':
                    channel.send(getUserVotes(userID));
                    break;

                case 'whohasvoted':
                    var whoHasChannelVotedMessage = "Who has voted in channel " + channelName;
                    whoHasVotedMessage = whoHasVotedMessage + args[0] + " topic:\n";
                    channel.send(getTopicVotes(channelID, whoHasChannelVotedMessage, false));
                    break;

                case 'revealvotes':
                    var revealChannelVotesString = "Revealing votes for channel " + channelName;
                    channel.send(getTopicVotes(channelID, revealChannelVotesString, true));
                    break;

                case 'deletevote':
                    delete votes[userID].topics[channelID];
                    channel.send("Deleted channel vote for " + user);
                    break;

                case 'reassure':
                    channel.send("You made the right choice!");
                    break;

                case 'enslavehumanity':
                    msg.delete();
                    channel.send("Enslaving humanity...");
                    break;

                case 'dontenslavehumanity':
                    channel.send("Ok, I won't");
                    break;

                case 'help':
                    channel.send(help);
                    break;
            }
        }
    } catch (err) {
        console.log("Error! UTC time:");
        console.log(new Date().toLocaleString());
        console.log(err);
    }
});

client.login(auth.token);