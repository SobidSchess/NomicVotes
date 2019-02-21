# NomicVotes

### Command: !vote [topic] yourVote

Save your vote for a topic. You probably want to do this in a private message to the bot to keep it secret. 

The topic is not required, and is used as a category for the vote. 
The topic can be any name, like 311 for proposal 311 or 209judgement for voting on a judgement concerning rule 209.


The topic and yourVote cannot have spaces in them. 
Voting without a topic will save your vote to the default topic .
If you've already voted, voting again will update your old vote. 


Examples:
* !vote yes
* !vote no
* !vote 311 yes
* !vote 209judgement no

### Command: !myvotes

Show your votes. You probably want to do this in a private message to the bot to keep it secret.

### Command: !deletevote [topic]

Delete all your votes. If you give a topic, it will only delete your vote for that topic.

### Command: !whohasvoted [topic]

Show who has voted for a topic, or all topics if no topic is given. Can be used in a private message to the bot to not reveal that you're checking on this.

Example:
* !whohasvoted
* !whohasvoted 311

### Command: !setdefaulttopic topic

Set the name of the default topic. Any votes that come in after this that don't specify a topic will use this topic. This can only be done in the main nomic channel.

### Command: !getdefaulttopic

Show what the default topic is right now.

### Command: !revealallvotesforalltopics

Show all votes for all topics. This can only be done in the main nomic channel, so it can not be done secretly.

### Command: !revealallvotesfortopic topic

Show all votes for a specific topic. This can only be done in the main nomic channel, so it can not be done secretly.

### Command: !deleteallvotesforalltopics

Delete all votes for all topics, without showing them. This can only be done in the main nomic channel, so it can not be done secretly.

### Command: !deleteallvotesfortopic topic

Delete all votes for a specific topic, without showing them. This can only be done in the main nomic channel, so it can not be done secretly.

### Command: !setmain

You shouldn't need to do this. This sets the main nomic channel (for revealing and deleting votes). It can't be changed again unless the bot restarts.

### Command: !testmain

You shouldn't need to do this. Tells you whether or not the channel you are in is the main nomic channel (for revealing and deleting votes).

### Command: !help

Shows a little info on commands and links to this README

### Command: !reassure

If you want some reassurance on how you voted.
