#!/bin/sh

#
# Stop WPS event from LED module when WPS finish.
#

sleep 1 # trigger wps may take time, wait 1 second.

while [ `mapi_wlan_cli wsc_get_status|grep "Progress"|wc -l` == "2" ]
do
	# wps still in progress
	sleep 1
done
arc_led led_blue on
