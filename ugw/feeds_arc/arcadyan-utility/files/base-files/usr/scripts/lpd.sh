#!/bin/sh
#
# Copyright (C) 2009 Arcadyan
# All Rights Reserved.
#

debug(){
	echo "<${0}>: ${1}" > /dev/console
}

SPOOLER_DIR="/tmp/lpd"
ENABLE="`abscfg get ARC_USB_LPD_Enable`"

DEF_LPQ0=lpt0
DEF_LPQ1=lpt1

# lp0 is mapping to queuename1@printer, lp1 is mapping to queuename2@printer
FIX_PRINTER=lp0	

lpd_boot()
{
	mkdir $SPOOLER_DIR
	debug "[lpd_boot] Spool created at `ls -d $SPOOLER_DIR`"

	debug "[lpd_boot] lpd start"
	lpd_start
}

lpd_start()
{
	local LPQ
	local PID

	if [ "$ENABLE" != "1" ] ; then
		return 0
	fi

	PID=`ps | grep "lpd" | grep "tcpsvd" | awk '{ print $1 }'`
	if ! [ -z "${PID}" ] ; then
		debug "[lpd_start] lpd already running..."
		return 0
	fi
	
	if [ -e /dev/lp0 ] ; then
		debug "[lpd_start] add lp0"
		lpd_add lp0
	fi

	if [ -e /dev/lp1 ] ; then
		debug "[lpd_start] add lp1"
		lpd_add lp1
	fi

	tcpsvd -E :: 515 lpd $SPOOLER_DIR &
}

lpd_stop()
{
	local PID

	PID=`ps | grep "lpd" | grep "tcpsvd" | awk '{ print $1 }'`
	if ! [ -z "${PID}" ] ; then
		kill -KILL ${PID}
	fi

	debug "[lpd_stop] remove spool directory"
	rm -rf $SPOOLER_DIR/       
}

lpd_restart()
{
	lpd_stop
	lpd_start
}

# $1 - lp device name, lp0 or lp1
lpd_add()
{
	local LPQ

	if [ -e /sys/class/usb/${1} ] ; then
		LPQ=`abscfg get ARC_USB_LPD_QUEUE_x_Name ${1:2:1}`
		if [ -e ${SPOOLER_DIR}/${LPQ} ]; then
			debug "[lpd_add] ${SPOOLER_DIR}/${LPQ} already exist"
			return 0
		else
			# rm -f ${SPOOLER_DIR}/${LPQ}
			debug "[lpd_add] create queue"
			ln -s /dev/${1} ${SPOOLER_DIR}/${LPQ}
		fi
	fi
}

# $1 - lp device name, lp0 or lp1
lpd_del()
{
	debug "[lpd_del] remove queue"
	if [ -e /sys/class/usb/${1} ] ; then
		LPQ=`abscfg get ARC_USB_LPD_QUEUE_x_Name ${1:2:1}`
		rm -f ${SPOOLER_DIR}/${LPQ}
	fi
}

case $1 in
  "boot")
		lpd_boot
		;;
  "start")
		lpd_start
		;;
  "stop")
		lpd_stop
		;;
  "restart")
		lpd_restart
		;;
  "add")
	  	if [ ! -e "${SPOOLER_DIR}" ] ; then
			debug "[lpd] No spool directory, do lpd boot"
			lpd_boot
		fi

		if [ -n "$2" ] ; then
			debug "[lpd] add $2"
			lpd_add $2
		fi
		;;
  "del")
		if [ -n "$2" ] ; then
			lpd_del $2
		fi
		
		if [ ! -e /dev/lp0 ] && [ ! -e /dev/lp1 ]; then
			debug "[lpd] No device found, stop lpd"
			lpd_stop
		fi
		;;
  *)
		echo $0 'boot    - setup and start LPD'
		echo $0 'start   - start LPD'
		echo $0 'stop    - stop LPD'
		echo $0 'restart - restart LPD'
		echo $0 'add     - add printer queue'
		echo $0 'del     - remove printer queue'
		;;
esac

