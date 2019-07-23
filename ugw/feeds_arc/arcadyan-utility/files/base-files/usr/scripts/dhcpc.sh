#!/bin/sh

# 2013-12-16, modified by Shell Xie, multiple wan support */
default_wan=`mng_cli get ARC_WAN_DefaultRouteIdx`

echo "Interface $interface Index $wan_index Got DHCP info $reason !"

update_value()
{
		#
		# Henry Jan-05-2013
		# Setting gateway config with $new_routers directly may cause 
		# error in setting default gateway. Because $new_routers may
		# consist more than one ip address. Therefore we should separate 
		# each gateway ip and set the config with the valid one
		#
		ifconfig ${interface} ${new_ip_address} netmask ${new_subnet_mask} up

		wan0_proto=`mng_cli get ARC_WAN_${wan_index}_IP4_Proto`
		for router in $new_routers;
		do
			if [ $wan_index = $default_wan ] ; then
				if `route add default gateway $router`
				then 
					break
				fi
			else
				break;
			fi
		done
		# End Henry Jan-05-2013

        
		mng_cli set ARC_WAN_${wan_index}_IP4_Addr="$new_ip_address" set ARC_WAN_${wan_index}_IP4_Netmask="$new_subnet_mask" set ARC_WAN_${wan_index}_IP4_Gateway="$router" set ARC_WAN_${wan_index}_IP4_DNS="$new_domain_name_servers" set ARC_WAN_${wan_index}_DomainName="$new_domain_name" set ARC_WAN_${wan_index}_IP4_DHCP_Lease="$new_dhcp_lease_time" set ARC_IP6_6RD_Info="$new_6rd_info" action ""
		mng_cli tmp_set TMP_WAN_${wan_index}_IP4_DNS="$new_domain_name_servers"
}
clear_value()                                                                                                                        
{                                                                                                                                    
        wan0_proto=`mng_cli get ARC_WAN_${wan_index}_IP4_Proto`                                                                                     
	# not clear pptp static or l2tp static
	wan0_pptp_dhcp=`mng_cli get ARC_WAN_${wan_index}_PPTP_IP4_DHCP`
	wan0_l2tp_dhcp=`mng_cli get ARC_WAN_${wan_index}_L2TP_IP4_DHCP`

	if [ $wan0_proto = "static" ] ; then
		echo "static"
	elif [ $wan0_proto = "pptp" ] && [ "$wan0_pptp_dhcp" = "0" ] ; then
		echo "pptp static"
	elif [ $wan0_proto = "l2tp" ] && [ "$wan0_l2tp_dhcp" = "0" ] ; then
		echo "l2tp static"
	else
		mng_cli set ARC_WAN_${wan_index}_IP4_Addr="0.0.0.0" set ARC_WAN_${wan_index}_IP4_Netmask="0.0.0.0" action ""    
                                                                                                           
		mng_cli set ARC_WAN_${wan_index}_IP4_Gateway="0.0.0.0" set ARC_WAN_${wan_index}_IP4_DNS="" set ARC_WAN_${wan_index}_IP4_DHCP_Lease="0" action ""
        fi
	mng_cli set ARC_WAN_${wan_index}_IP4_DNS="" set ARC_WAN_${wan_index}_IP4_DHCP_Lease="0" action ""
	mng_cli tmp_set TMP_WAN_${wan_index}_IP4_DNS=""
}   

# pete 2013-04-02
#explicit return value
succ=0

case $reason in
	"BOUND")
		echo "BOUND......"
		update_value

		autodetect_en=`mng_cli get ARC_IP6_AUTODETECT_Enable`
		if [ $autodetect_en = "1" ]; then
			autodetect_6rd_info=`mng_cli tmp_get TMP_IP6_AUTODETECT_6RD_INFO`
			if [ $autodetect_6rd_info = "1" ]; then
				mng_cli tmp_set TMP_IP6_AUTODETECT_6RD_INFO=0
				killall -SIGUSR2 ipv6autodetect
			else
				killall -SIGUSR1 ipv6autodetect
			fi
		fi

		wan0_proto=`mng_cli get ARC_WAN_${wan_index}_IP4_Proto` 
		case $wan0_proto in
			"pptp")
				wan0_pptp_dhcp=`mng_cli get ARC_WAN_${wan_index}_PPTP_IP4_DHCP`
				if [ "$wan0_pptp_dhcp" = "1" ] ; then
					echo "do start pptp ..."
					mng_cli action hnap_dnsmasq
					mng_cli action start_wan_stage2="ppp wan_idx=${wan_index}"
				fi
				;;
			"l2tp")
				echo "do start l2tp ..."
				mng_cli action hnap_dnsmasq
				mng_cli action start_wan_stage2="ppp wan_idx=${wan_index}"
				;;
			"heartbeat")
				echo "do start heartbeat ..."
				mng_cli action start_wan_heartbeat="hb wan_idx=${wan_index}"
				;;
			"dhcp")
				tmp_value=`cat /proc/uptime | cut -d'.' -f1`
				mng_cli tmp_set TMP_WAN_${wan_index}_Connect_Start_Time=$tmp_value
				if [ $wan_index = $default_wan ] ; then
					echo "call wan_done action..."	
					mng_cli action wan_done="wan_idx=${wan_index}"
				else
					echo "call wan${wan_index}_done action..."	
					mng_cli action wan${wan_index}_done="wan_idx=${wan_index}"
				fi
				;;
		esac

		ipv6_auto_enable=`mng_cli get ARC_IP6_AutoEnable`
		ipv6_tunnel_type=`mng_cli get ARC_IP6_TunnelType`
		if [ "$ipv6_auto_enable" = "0" ] && [ "$ipv6_tunnel_type" = "1" ] ; then
			echo "6rd tunnel..."	
		fi
		#arc_sm_led stop 6;
		#arc_led led_blue on
		;;
	"RENEW")
		echo "RENEW......"
		wan0_iface=`mng_cli get ARC_WAN_${wan_index}_Iface` 
		wan0_ifname=`mng_cli get ARC_WAN_${wan_index}_Ifname` 
		if [ "$wan0_iface" = "$wan0_ifname" ] ; then
			update_value
			if [ $wan_index = $default_wan ] ; then
				mng_cli action wan_update="wan_idx=${wan_index}"
			else
				mng_cli action wan${wan_index}_update="wan_idx=${wan_index}"
			fi
		fi
		#arc_sm_led stop 6;
		#arc_led led_blue on
		;;
	"DECLINE")
		echo "DECLINE......"
		wan0_iface=`mng_cli get ARC_WAN_${wan_index}_Iface` 
		wan0_ifname=`mng_cli get ARC_WAN_${wan_index}_Ifname` 
		clear_value
		if [ "$new_conflict_interface" = "all" ] ; then
			echo "conflict all" > /dev/console
			ip4addr=`mng_cli get ARC_LAN_0_IP4_Addr`
			if [ $ip4addr = "192.168.0.1" ] ; then
				mng_cli set ARC_LAN_0_IP4_Addr="172.16.0.1"
				mng_cli set ARC_LAN_1_IP4_Addr="172.16.7.1"
				mng_cli set ARC_LAN_0_DHCP4S_PoolStart="172.16.0.100"
				mng_cli set ARC_LAN_1_DHCP4S_PoolStart="172.16.7.100"
				mng_cli set ARC_LAN_0_DHCP4S_PoolEnd="172.16.0.199"
				mng_cli set ARC_LAN_1_DHCP4S_PoolEnd="172.16.7.199"
			else
				mng_cli set ARC_LAN_0_IP4_Addr="192.168.0.1"
				mng_cli set ARC_LAN_1_IP4_Addr="192.168.7.1"
				mng_cli set ARC_LAN_0_DHCP4S_PoolStart="192.168.0.199"
				mng_cli set ARC_LAN_1_DHCP4S_PoolStart="192.168.7.199"
				mng_cli set ARC_LAN_0_DHCP4S_PoolEnd="192.168.0.199"
				mng_cli set ARC_LAN_1_DHCP4S_PoolEnd="192.168.7.199"
			fi
		else
			if [ $new_conflict_interface = "lan" ] ; then
				echo "conflict lan" > /dev/console
				ip4addr=`mng_cli get ARC_LAN_0_IP4_Addr`
				if [ $ip4addr = "192.168.0.1" ] ; then
					mng_cli set ARC_LAN_0_IP4_Addr="192.168.100.1"
					mng_cli set ARC_LAN_0_DHCP4S_PoolStart="192.168.100.100"
					mng_cli set ARC_LAN_0_DHCP4S_PoolEnd="192.168.100.199"
				else
					mng_cli set ARC_LAN_0_IP4_Addr="192.168.0.1"
					mng_cli set ARC_LAN_0_DHCP4S_PoolStart="192.168.0.100"
					mng_cli set ARC_LAN_0_DHCP4S_PoolEnd="192.168.0.199"
				fi
			else
				echo "conflict guest" > /dev/console
				ip4addr=`mng_cli get ARC_LAN_1_IP4_Addr`
				if [ $ip4addr = "192.168.7.1" ] ; then
					mng_cli set ARC_LAN_1_IP4_Addr="192.168.107.1"
					mng_cli set ARC_LAN_1_DHCP4S_PoolStart="192.168.107.100"
					mng_cli set ARC_LAN_1_DHCP4S_PoolEnd="192.168.107.199"
				else
					mng_cli set ARC_LAN_1_IP4_Addr="192.168.7.1"
					mng_cli set ARC_LAN_1_DHCP4S_PoolStart="192.168.7.100"
					mng_cli set ARC_LAN_1_DHCP4S_PoolEnd="192.168.7.199"
				fi
			fi
		fi
		mng_cli action hnap_router_lanipchange_settings
		switch_cli GSW_PORT_LINK_CFG_SET dev=0 nPortId=2 eLink=1
		switch_cli GSW_PORT_LINK_CFG_SET dev=0 nPortId=3 eLink=1
		switch_cli GSW_PORT_LINK_CFG_SET dev=0 nPortId=4 eLink=1
		switch_cli GSW_PORT_LINK_CFG_SET dev=0 nPortId=5 eLink=1
		mng_cli action wan_start
		mng_cli commit
		exit
		;;
	"REBOUND"|"REBOOT")
		echo "REBOUND or REBOOT......"
		wan0_iface=`mng_cli get ARC_WAN_${wan_index}_Iface` 
		wan0_ifname=`mng_cli get ARC_WAN_${wan_index}_Ifname` 
		if [ "$wan0_iface" = "$wan0_ifname" ] ; then
			update_value
			if [ $wan_index = $default_wan ] ; then
				mng_cli action wan_update="wan_idx=${wan_index}"
			else
				mng_cli action wan${wan_index}_update="wan_idx=${wan_index}"
			fi
		fi
		#arc_sm_led stop 6;
		#arc_led led_blue on
		;;
	"EXPIRE"|"RELEASE"|"STOP"|"PREINIT")
		wan0_iface=`mng_cli get ARC_WAN_${wan_index}_Iface` 
		wan0_ifname=`mng_cli get ARC_WAN_${wan_index}_Ifname` 
		if [ "$wan0_iface" = "$wan0_ifname" ] ; then
			clear_value
			if [ $wan_index = $default_wan ] ; then
				mng_cli action wan_update="wan_idx=${wan_index}"
			else
				mng_cli action wan${wan_index}_update="wan_idx=${wan_index}"
			fi
		fi
		#arc_sm_led start 6;		
		#arc_led led_blue off
		echo "......"
		;;
	"SWITCHNOIP")
		echo "SWITCHNOIP......"
		ip3="$(($(date +%s)%254))"
		ip4="$(($(date +%s)$(date +%s)%254))"
        	mng_cli set VAR_BRIDGE_IP4ADDR="192.168.$ip3.$ip4" set VAR_BRIDGE_IP4MASK="255.255.0.0" set VAR_BRIDGE_IP4GATEWAY="" action "sys_bridge_dhcp_done"
		;;
esac

# pete 2013-04-02
#If execute mng_cli action failed, script return -1
#To avoid client and server loop "Decline -> Discover -> Offer -> Request -> ACK -> Decline" forever, return 0 at present 
#If we find some sutiations need to deline the lease, we add to return -1 in the future
exit $succ


