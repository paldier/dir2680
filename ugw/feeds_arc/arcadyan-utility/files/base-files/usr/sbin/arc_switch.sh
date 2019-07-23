#!/bin/sh

configure_switch()
{
	configure_switch_lan $1
	configure_switch_wan $1
}

configure_switch_wan()
{
	switch_cli dev=1 GSW_PORT_CFG_SET nPortId=15 eEnable=$1
}

configure_switch_lan()
{
	switch_cli dev=0 GSW_PORT_CFG_SET nPortId=5 eEnable=$1
}

case $1 in
	"enable")
		configure_switch 1
		;;
	"disable")
		configure_switch 0
		;;
	*)
		echo "not support"
		;;
esac
