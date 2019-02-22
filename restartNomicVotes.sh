#!/bin/bash

export nodePID=`cat save_pid.txt`
kill -9 $nodePID
mv nohup.out nohup.out.bak
git pull
nohup node bot.js &
echo $! > save_pid.txt