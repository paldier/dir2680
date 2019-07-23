#!/bin/sh
echo "Listing $1"

BASE_DIS_SIGNAL="/tmp/arc_hotplugd_signal_pool"
PREFIX_SIG_FILE="sig_"
BASE_DIS_SCRIPT="/usr/scripts"
PREFIX_SCRIPT_FILE="cmds_"

# ${1}: process name
# ${2}: pid
send_signal_to_process () {
  if [ -f ${BASE_DIS_SIGNAL}/${PREFIX_SIG_FILE}${1} ]; then
    source ${BASE_DIS_SIGNAL}/${PREFIX_SIG_FILE}${1}
    echo "kill -s ${SIGNUM} ${2}" > /dev/console
    kill -s ${SIGNUM} ${2}
    usleep 1000
  else
    echo "Can't found ${BASE_DIS_SIGNAL}/${PREFIX_SIG_FILE}${1}" > /dev/console
  fi
}

# ${1}: process name
# ${2}: pid
kill_process () {
  if [ -f ${BASE_DIS_SCRIPT}/${PREFIX_SCRIPT_FILE}${1} ]; then
    source ${BASE_DIS_SCRIPT}/${PREFIX_SCRIPT_FILE}${1}
    echo "$STOP_CMD" > /dev/console
    eval $STOP_CMD
  else
    echo "Can't found ${BASE_DIS_SCRIPT}/${PREFIX_SCRIPT_FILE}${1}" > /dev/console
    echo "kill ${2}" > /dev/console
    kill ${2}
    usleep 1000
  fi
}

if [ "X$1" != "X" ]; then
  while true; do
    for pid in `fuser -m "$1"`
    do
      pname=`ps | grep -v grep | grep $pid | awk '{print $4}'`
      echo "pname $pname, pid $pid" > /dev/console
      if [ "XXX$pname" != "XXX" ]; then
        send_signal_to_process $pname $pid
        kill_process $pname $pid
      fi
    done

    remainder=`fuser -m "$1"`
    if [ "XX$remainder" == "XX" ]; then
      ## No any process which lock USB storage
      echo "We done everything" > /dev/console
      break
    fi
  done
fi
