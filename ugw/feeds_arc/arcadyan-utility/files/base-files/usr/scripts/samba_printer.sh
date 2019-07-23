#!/bin/sh
#
# Copyright (C) 2009 Arcadyan
# All Rights Reserved.
#
# $1 - lp device name, lp0 or lp1


debug(){
	echo "<${0}>: ${1}" > /dev/console
}

samba_printer_add()
{
	#echo "samba_printer.sh> samba_printer_add()" > /dev/console

	PRINTER_MFG=""
	PRINTER_MODEL=""

	#Enable RAW protocol printer, Leo, 20-Dec-2012
	if [ `ls /dev/ | grep -c $1` -gt 0 ] ; then
		samba_printer_del $1

		PRINTER_MFG=`cat /sys/class/usb/$1/device/ieee1284_id | grep MFG | sed 's/^.*MFG://g' | sed 's/;.*$//g'`
		PRINTER_MODEL=`cat /sys/class/usb/$1/device/ieee1284_id | grep MDL | sed 's/^.*MDL://g' | sed 's/;.*$//g'`

		if [ -z "$PRINTER_MODEL" ] ; then
		    PRINTER_MODEL=`cat /sys/class/usb/$1/device/ieee1284_id | grep MODEL | sed 's/^.*MODEL://g' | sed 's/;.*$//g'`
		fi

		PRINTER_MODEL_FULL=$PRINTER_MFG" "$PRINTER_MODEL
		PRINTER_SHARE_NAME=`echo $PRINTER_MODEL_FULL | sed 's/ /_/g'`
		
		#Simon@2014/10/01, don't use config item to do this
		#mngcli set ARC_USB_PRINTER="$PRINTER_SHARE_NAME"

		#Simon@2014/09/12, use device name as share name
		PRINTER_SHARE_NAME="$1"
		
		echo "samba_printer.sh> printer share name: "$PRINTER_SHARE_NAME > /dev/console

		sleep 1
	fi

	if [ -n "$PRINTER_SHARE_NAME" ] ; then

		# Open cupsd
		if [ `ps -ea | grep -c cupsd` -ne 2 ] ; then
			echo "samba_printer.sh> open cupsd" > /dev/console
			/etc/init.d/cupsd start
		fi

		# Open p910nd -b -f [device] [port option]
		echo "samba_printer.sh> open p910nd" > /dev/console
		PRINTER_INDEX=`ls /dev/$1 | sed 's/^.*lp//g'`

		/usr/sbin/p910nd -b -f /dev/$1 $PRINTER_INDEX
		P910ND_PORT_NO=$((9100+$PRINTER_INDEX))

		while [ `lpstat -a | grep "$PRINTER_SHARE_NAME" -c` -eq 0 ]
		do
			echo "samba_printer.sh> add samba printer and set to default printer" > /dev/console
			/usr/sbin/lpadmin -p $PRINTER_SHARE_NAME -D "$PRINTER_MODEL_FULL" -v socket://127.0.0.1:$P910ND_PORT_NO -E
			/usr/sbin/lpadmin -d $PRINTER_SHARE_NAME
			/usr/bin/lpstat -d
			sleep 1
		done

		/etc/init.d/cupsd stop

		sleep 1

		/etc/init.d/cupsd start

		umng_syslog_cli addEventCode -1 U101 "${PRINTER_SHARE_NAME}"
	fi

	#echo "samba_printer.sh> samba_printer_add() end" > /dev/console

}

samba_printer_del()
{
	#echo "samba_printer.sh> samba_printer_del()" > /dev/console

	if ! [ -z `ps | grep "p910" | grep -c "$1"` ] ; then
		PROC_ID=`ps -ea | grep p910 | grep /dev/$1 | sed 's/root.*$//g'`
		kill -9 $PROC_ID
	fi

	PRINTER_INDEX=`echo $1 | sed 's/^.*lp//g'`
	P910ND_PORT_NO=$((9100+$PRINTER_INDEX))
	PRINTER_SHARE_NAME=`lpstat -v | grep "$P910ND_PORT_NO" | sed 's/^.*for //g' | sed 's/:.*$//g'`

	#Simon@2014/10/01, don't use config item to do this
	#mngcli del ARC_USB_PRINTER

	#Simon@2014/09/12, use device name as share name
	PRINTER_SHARE_NAME="$1"
	
	echo "samba_printer.sh> printer share name: "$PRINTER_SHARE_NAME > /dev/console

	if [ -n "$PRINTER_SHARE_NAME" ] ; then
		/usr/sbin/lpadmin -x $PRINTER_SHARE_NAME
		umng_syslog_cli addEventCode -1 U102 "${PRINTER_SHARE_NAME}"
	fi

	#echo "samba_printer.sh> samba_printer_del() end" > /dev/console
}

case $1 in
  "add")
		if [ -n "$2" ] ; then
			samba_printer_add $2
		fi
		;;
  "del")
		if [ -n "$2" ] ; then
			samba_printer_del $2
		fi
		;;
  *)
		echo $0 'add {printer}   - add samba printer'
		echo $0 'del {printer}   - remove samba printer'
		;;
esac
