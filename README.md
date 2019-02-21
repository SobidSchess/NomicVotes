# NomicVotes
var privateHelp = "You probably want to do this in a private message to the bot to keep it secret."
var shortHelp = "Enter this message to vote yes:\n!vote yes\nOr to vote no:\n!vote no\n\nTo see your current votes, use:\n!myVotes\n\nFor more detail, use !fullHelp";
###Command: !vote [topic] yourVote

Used to save your vote for a topic. You probably want to do this in a private message to the bot to keep it secret. 
The topic is not required, and is used as a category for the vote. 
It can be any name, like 311 for proposal 311 or 209judgement for voting on a judgement concerning rule 209 
topic and yourVote cannot have spaces in them. 
Voting without a topic will save your vote to the default topic named current. 
If you've already voted, voting again will update your old vote. 
Examples:
*!vote yes
*!vote no
*!vote 311 yes
*!vote 209judgement no

###Command: !myvotes

Used to show your votes. You probably want to do this in a private message to the bot to keep it secret.
