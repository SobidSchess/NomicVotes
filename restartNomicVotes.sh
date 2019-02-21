#!/bin/bash

export nodePID=`cat save_pid.txt`
kill -9 $nodePID
rm nohup.out
git pull
nohup node bot.js &
echo $! > save_pid.txt
sleep 3000
tail -f nohup.out