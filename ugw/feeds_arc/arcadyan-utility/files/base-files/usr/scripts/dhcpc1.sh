#!/bin/sh

#echo "Interface $interface Got DHCP info $reason !"

update_value()
{
		ifconfig ${interface} ${new_ip_address} netmask ${new_subnet_mask} up


        wan1_proto=`mng_cli get VAR_WAN1_PROTO`
        if [ $wan1_proto = "bridge" ] ; then
		mng_cli set VAR_BRIDGE_IP4ADDR="$new_ip_address" set VAR_BRIDGE_IP4MASK="$new_subnet_mask" set VAR_BRIDGE_IP4GATEWAY="$router" set VAR_WAN1_DNS="$new_domain_name_servers" set VAR_WAN1_DOMAINNAME="$new_domain_name" set VAR_WAN1_DHCP4LEASE="$new_dhcp_lease_time" set VAR_IPV6_6RD_INFO="$new_6rd_info" action ""
	else
		mng_cli set VAR_WAN1_IP4ADDR="$new_ip_address" set VAR_WAN1_IP4MASK="$new_subnet_mask" set VAR_WAN1_IP4GATEWAY="$router" set VAR_WAN1_DNS="$new_domain_name_servers" set VAR_WAN1_DOMAINNAME="$new_domain_name" set VAR_WAN1_DHCP4LEASE="$new_dhcp_lease_time" set VAR_IPV6_6RD_INFO="$new_6rd_info" action ""
	fi
}
clear_value()                                                                                                                        
{                                                                                                                                    
        wan1_proto=`mng_cli get VAR_WAN1_PROTO`                                                                                      
        wan1_pptp_dhcp=`mng_cli get VAR_WAN1_PPTP_DHCP`                                                                              
        if [ $wan1_proto = "static" ] ; then
              echo "static"
        elif [ $wan1_proto = "pptp" ] && [ "$wan1_pptp_dhcp" = "0" ] ; then
			echo "pptp static"
        elif [ $wan1_proto = "bridge" ] ; then
		mng_cli set VAR_BRIDGE_IP4ADDR="0.0.0.0" set VAR_BRIDGE_IP4MASK="0.0.0.0" set VAR_BRIDGE_IP4GATEWAY="0.0.0.0"  action ""
        else
                if [ x$reason = xDECLINE ] ; then                   
                        mng_cli set VAR_WAN1_IP4ADDR="127.0.0.1" set VAR_WAN1_IP4MASK="255.0.0.0" action ""
                else                                                                                       
                        mng_cli set VAR_WAN1_IP4ADDR="0.0.0.0" set VAR_WAN1_IP4MASK="0.0.0.0" action ""    
                fi                                                                                     
                                                                                                           
                mng_cli set VAR_WAN1_IP4GATEWAY="0.0.0.0" set VAR_WAN1_DNS="" set VAR_WAN1_DHCP4LEASE="0" action ""
        fi
        mng_cli set VAR_WAN1_DNS="" set VAR_WAN1_DHCP4LEASE="0" action ""
}   

# pete 2013-04-02
#explicit return value
succ=0

case $reason in
	"BOUND")
		echo "BOUND......"
		update_value
		wan1_proto=`mng_cli get VAR_WAN1_PROTO` 
		case $wan1_proto in
			"bridge")
				echo "do start bridge ..."
				mng_cli action sys_bridge_dhcp_done
				;;
			"pptp")
				wan1_pptp_dhcp=`mng_cli get VAR_WAN1_PPTP_DHCP`
				if [ "$wan1_pptp_dhcp" = "1" ] ; then
					echo "do start pptp ..."
					#not support yet
					#mng_cli action start_wan_stage2=ppp
				fi
				;;
			"l2tp")
				echo "do start l2tp ..."
				#not support yet
				#mng_cli action start_wan_stage2=ppp	
				;;
			"heartbeat")
				echo "do start heartbeat ..."
				#not support yet
				#mng_cli action start_wan_heartbeat=hb
				;;
			"dhcp")
				echo "call wan_done action..."	
				mng_cli action wan1_done
				;;
		esac

		ipv6_auto_enable=`mng_cli get VAR_IPV6_AUTO_ENABLE`
		ipv6_tunnel_type=`mng_cli get VAR_IPV6_TUNNEL_TYPE`
		if [ "$ipv6_auto_enable" = "0" ] && [ "$ipv6_tunnel_type" = "1" ] ; then
			echo "6rd tunnel..."	
		fi
		;;
	"RENEW")
		echo "RENEW......"
		wan1_iface=`mng_cli get VAR_WAN1_IFACE` 
		wan1_ifname=`mng_cli get VAR_WAN1_IFNAME` 
		if [ "$wan1_iface" = "$wan1_ifname" ] ; then
			update_value
			mng_cli action wan1_update
		fi
		;;
	"DECLINE")
		echo "DECLINE......"
		wan1_iface=`mng_cli get VAR_WAN1_IFACE` 
		wan1_ifname=`mng_cli get VAR_WAN1_IFNAME` 
		if [ "$wan1_iface" = "$wan1_ifname" ] ; then
			clear_value
			mng_cli action wan1_update
		fi
		;;
	"REBOUND"|"REBOOT")
		echo "REBOUND or REBOOT......"
		wan1_iface=`mng_cli get VAR_WAN1_IFACE` 
		wan1_ifname=`mng_cli get VAR_WAN1_IFNAME` 
		if [ "$wan1_iface" = "$wan1_ifname" ] ; then
			update_value
			mng_cli action wan1_update
		fi
		;;
	"EXPIRE"|"RELEASE"|"STOP"|"PREINIT")
		wan1_iface=`mng_cli get VAR_WAN1_IFACE` 
		wan1_ifname=`mng_cli get VAR_WAN1_IFNAME` 
		if [ "$wan1_iface" = "$wan1_ifname" ] ; then
			clear_value
			mng_cli action wan1_update
		fi
		echo "......"
		;;
	"SWITCHNOIP")
		echo "SWITCHNOIP......"
		ip3="$(($(date +%s)%254))"
		ip4="$(($(date +%s)$(date +%s)%254))"
		# not support yet
        	#mng_cli set VAR_BRIDGE_IP4ADDR="192.168.$ip3.$ip4" set VAR_BRIDGE_IP4MASK="255.255.0.0" set VAR_BRIDGE_IP4GATEWAY="" action "sys_bridge_dhcp_done"
		;;
esac

# pete 2013-04-02
#If execute mng_cli action failed, script return -1
#To avoid client and server loop "Decline -> Discover -> Offer -> Request -> ACK -> Decline" forever, return 0 at present 
#If we find some sutiations need to deline the lease, we add to return -1 in the future
exit $succ


