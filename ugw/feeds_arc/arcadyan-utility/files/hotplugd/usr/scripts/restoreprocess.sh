#!/bin/sh
FILES=/usr/scripts/cmds_*

for pfile in $FILES
do
  echo "pfile $pfile" > /dev/console
  source $pfile
  if [ "XX$SIG" != "XX" ]; then
    kill -$SIG $pid
  else
    echo "STOP_CMD $STOP_CMD" > /dev/console
    eval $STOP_CMD
    usleep 5000
    echo "START_CMD $START_CMD" > /dev/console
    eval $START_CMD
  fi
done

