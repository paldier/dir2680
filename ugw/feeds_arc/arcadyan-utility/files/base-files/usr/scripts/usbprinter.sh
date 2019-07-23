#!/bin/sh

debug(){
	echo "<${0}>: ${1}" > /dev/console
}

debug "KERNEL = [${1}], ACTIONE= [${ACTION}]"

if [ "${ACTION}" == "add" ]
then
	if [ "${1:0:2}" == "lp" ] ; then
		/usr/scripts/lpd.sh add ${1}
		/usr/scripts/samba_printer.sh add ${1}
		/etc/init.d/samba reload
		# TODO: triger samba action
		# libmapi_usb_cli admin
	fi
elif [ "${ACTION}" == "remove" ]
then
	if [ "${1:0:2}" == "lp" ] ; then
		/usr/scripts/lpd.sh del ${1}
		/usr/scripts/samba_printer.sh del ${1}
		/etc/init.d/samba reload
		# TODO: triger samba action
		# libmapi_usb_cli admin
	fi
else
	debug "ACTION [${ACTION}] not supported"
fi

