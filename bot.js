const Discord = require('discord.js');
const auth = require('./auth.json');

const client = new Discord.Client();

var votes = {};
var help = "Enter this message to vote yes for the issue in this channel:\n!vote yes\nOr to vote no:\n!vote no\n\n" +
    "the README on this page: https://github.com/SobidSchess/NomicVotes/blob/master/README.md";


function getUserVoteOnTopic(userID, topicKey, includeVote) {
    var result = "No vote for userID " + userID;
    if (votes[userID] && votes[userID].topics && votes[userID].topics[topicKey] ) {
        result = votes[userID].user;
        if (includeVote) {
            result = result + ": " + votes[userID].topics[topicKey].vote;
        }
        result = result + "  ----  " + votes[userID].topics[topicKey].timestamp + "\n";
    }
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
    var numVotes = 0;
    for (var userKey in votes) {
        if (votes[userKey].topics[topicKey]) {
            numVotes++;
            messageString = messageString + getUserVoteOnTopic(userKey, topicKey, includeVotes);
        }
    }
    return {
        numVotes: numVotes,
        messageString: messageString
    };
}

function countVotes(channelID) {
    return getTopicVotes(channelID, "", false).numVotes;
}

function countMembers(members) {
    var numMembers = 0;
    for (var member in members) {
        if (!member.user.bot) {
            numMembers++;
        }
    }
    return numMembers;
}

function voteCountMessage(votes, members) {
    return "\n" + votes + " votes counted out of " + members + " channel members";
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
            var channelMembers = channel.members;

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
                        votes[userID].topics[channelID] = {};
                        votes[userID].topics[channelID].vote = args[0];
                        votes[userID].topics[channelID].timestamp = new Date().toLocaleString("en-US", {timeZone: "America/New_York"});
                        msg.delete();
                        var voteMessage = "Saved vote for this channel and deleted message from " + user;
                        var voteCount = countVotes(channelID);
                        var memberCount = countMembers(channel.members);
                        voteMessage += voteCountMessage(voteCount, memberCount);
                        if (voteCount === memberCount) {
                            voteMessage += "All channel members have voted!";
                        }
                        channel.send(voteMessage);
                    } else {
                        channel.send("Need to provide a vote.\n" + help);
                    }
                    break;

                case 'myvote':
                    channel.send(getUserVoteOnTopic(userID, channelID, true));
                    break;

                case 'whohasvoted':
                    var whoHasChannelVotedMessage = "Who has voted in channel " + channelName + "\n";
                    var topicVoters = getTopicVotes(channelID, whoHasChannelVotedMessage, false);
                    whoHasChannelVotedMessage = topicVoters.messageString + voteCountMessage(topicVoters.numVotes, countMembers(channel.members));
                    channel.send(whoHasChannelVotedMessage);
                    break;

                case 'revealvotes':
                    var revealChannelVotesString = "Revealing votes for channel " + channelName + "\n";
                    var topicVotes = getTopicVotes(channelID, revealChannelVotesString, true);
                    revealChannelVotesString = topicVotes.messageString + voteCountMessage(topicVoters.numVotes, countMembers(channel.members));
                    channel.send(revealChannelVotesString);
                    break;

                case 'deletemyvote':
                    delete votes[userID].topics[channelID];
                    channel.send("Deleted channel vote for " + user);
                    break;

                case 'deletechannelvotes':
                    deleteTopicVotes(channelID);
                    channel.send("Deleted all votes in this channel");
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