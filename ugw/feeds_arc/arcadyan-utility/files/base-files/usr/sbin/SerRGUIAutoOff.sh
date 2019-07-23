#!/bin/sh
#
# Copyright (C) 2014 Arcadyan
# All Rights Reserved.
#
# this script is used for service remote gui management
# the specification require that the service remote gui management
# must be disabled after 60 minutes later

#$1: service Off time

service_off_time=$1
quit=0


while [[ $quit -eq 0 ]]
do
    service_enable=`mngcli get ARC_PROJ_O2_UI_WEB_REMOTEMN_ServiceEnable`

    if [ "$service_enable" == "0" ]
    then
        exit 0
    fi

    current_time=`cat /proc/uptime | cut -d'.' -f1`

    if [ $current_time -lt $service_off_time ]
    then
        sleep 60
    else 
        mngcli set ARC_PROJ_O2_UI_WEB_REMOTEMN_ServiceEnable=0
        mngcli commit
        mngcli action ui_remote_gui
        $quit = 1
    fi
done

