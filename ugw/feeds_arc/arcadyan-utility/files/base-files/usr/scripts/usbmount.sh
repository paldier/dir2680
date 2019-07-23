#!/bin/sh
if [ $DEVTYPE == "partition" ]
x=`echo "$DEVNAME" | awk -F'/dev/' '{printf $2}'`;
x_len=`echo $x|wc -L`;
then
if [ $ACTION == "add" ] && [ $x_len -gt 3 ]
then
	dbus-arca-cli --command --dest=arca.dbus.misc "storage add $x $x $x"
	dbus-arca-cli --command --dest=arca.dbus.vsftpd "CMD_RESTART"
	dbus-arca-cli --command --dest=arca.dbus.minidlna "CMD_RESTART"
	dbus-arca-cli --command --dest=arca.dbus.samba "CMD_RESTART"
elif [ $ACTION == "remove" ] && [ $x_len -gt 3 ]
then
	dbus-arca-cli --command --dest=arca.dbus.samba "CMD_STOP"
	dbus-arca-cli --command --dest=arca.dbus.minidlna "CMD_STOP"
	dbus-arca-cli --command --dest=arca.dbus.vsftpd "CMD_STOP"
	dbus-arca-cli --command --dest=arca.dbus.misc "storage remove $x"
	dbus-arca-cli --command --dest=arca.dbus.vsftpd "CMD_START"
	dbus-arca-cli --command --dest=arca.dbus.minidlna "CMD_START"
	dbus-arca-cli --command --dest=arca.dbus.samba "CMD_START"
fi
fi
