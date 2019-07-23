#!/bin/sh
#
if [ ! "$ENVLOADED" ]; then
  if [ -r /etc/rc.conf ]; then
     . /etc/rc.conf 2> /dev/null
    ENVLOADED="1"
  fi
fi

if [ ! "$CONFIGLOADED" ]; then
  if [ -r /etc/rc.d/config.sh ]; then
    . /etc/rc.d/config.sh 2>/dev/null
    CONFIGLOADED="1"
  fi
fi

log()
{
    echo "<WAN-SERVICE>: $@" > /dev/console
}
    
sctrace.sh

#
# Usage getwantype ret_var linkType addrType
# WAN type is returned in ret_var
#
getwantype()
{
  local wanType
  
  case $2 in
    1 | 2 | 7 | 8)
      if [ "$3" = "1" ]; then # DHCP
        wanType="DHCPC"
      elif [ "$3" = "2" ]; then # STATIC
        wanType="FIXED"
      elif [ "$3" = "0" ]; then # Bridge Mode
        wanType="BRIDGE"
      fi
      ;;
    
    3)
      wanType="PPPOA"
      ;;
    
    4)
      wanType="PPPOE"
      ;;
    
    5)
      wanType="FIXED"
      ;;
    *)
      wanType="UNKNOWN"
  esac

  eval $1=$wanType
}

# sets system default gateway.
# Usage: set_default_gw defGw WanInterfaceName wanIP
set_default_gw()
{
  local defGw=$1
  local wanIf=$2
  local wanIP=$3
  local SystemDefaultGw
  local tempBuffer
  local tmpLen
   
  # log "set_default_gw defGw=$defGw WanIf=$wanIf wanIP=$wanIP"
  
  if [ "$defGw" != "0.0.0.0" ]; then
    # delete the previous default route
    tempBuffer=$(ip route)
    #SystemDefaultGw=`echo ${tempBuffer} | awk '/default via/ {print $3}'`
    
    tmpLen=${#tempBuffer}
    tempBuffer=${tempBuffer#*default via }
    [ $tmpLen != ${#tempBuffer} ] && SystemDefaultGw=${tempBuffer%%' '*}
    
    [ -n "$SystemDefaultGw" ] && route del default gw $SystemDefaultGw 2>/dev/null
   
    # add the new default route
    route add default gw $defGw dev $wanIf 2> /dev/null
    # call mgmt.sh for web mgmt traffic prioritization
    if [ -n "${WEB_WAN_ENABLE}" -a "${WEB_WAN_ENABLE}" = "1" ]; then
       . /etc/rc.d/mgmt.sh start 0 ${wanIP} 80 tcp
       . /etc/rc.d/mgmt.sh start 0 ${wanIP} 443 tcp
    fi
  fi
  if  [ "$CONFIG_PACKAGE_LTQ_DEVM" = "1" ]; then
    killall -USR2 devmapp
  fi
}

#
# Usage: start_6rd  wan_index wanType wanIP
#
start_6rd()
{

  local wanIndex=$1
  local wanType=$2
  local wanIP=$3

  local prefix
  local prefix_len
  local brip
  local mask_len
  local start6rd=0

  # echo $sixrd > /tmp/6rd_log.txt

  [ "$ipv6_status" = "1" -a "$wan_sixrdwanidx" = "$WAN_CONN" ]  && [ "$IPV6_TUNNEL" = "1" -o "$IPV6_TUNNEL" = "3" ] && {

    [ "$wan_sixrd_mode" = "0" ] && {

      if [ "$wanType" = "PPPOE" ]; then # PPPoE
          /sbin/udhcpc -b -i $WAN_NAME -O sixrd \
                       -p /var/run/udhcpc${wanIndex}.pid \
                       -s /etc/rc.d/udhcpc.script 2> /dev/null
      fi
      
      [ ! -z "$sixrd" ] && {
        
        [ "$wanType" = "PPPOE" -o "$wanType" = "DHCPC" ] && {
          prefix=$(echo $sixrd | awk '{print $3}')
          prefix_len=$(echo $sixrd | awk '{print $2}')
          brip=$(echo $sixrd | awk '{print $4}')
          mask_len=$(echo $sixrd | awk '{print $1}')
          start6rd=1
        }
      }
    } 
    [ "$wan_sixrd_mode" = "1" ] && {
         prefix=$wan_sixrdprefix \
         prefix_len=$wan_sixrdprefixlen 
         brip=$wan_sixrdbrip \
         mask_len=$wan_sixrdmasklen
         start6rd=1
    }
    
    [ $start6rd -eq 1 ] && {
      if [ "$wan_sixrd_mtu" = "0" ]; then
         /etc/rc.d/6rdtunnel.sh start $wanIndex $wanIP $prefix \
                                      $prefix_len $brip $mask_len
      else
         /etc/rc.d/6rdtunnel.sh start $wanIndex $wanIP $prefix \
                                      $prefix_len $brip $mask_len \
                                      $wan_sixrd_mtu
      fi
    }
  }
}

# Usage : stop_6rd wan-index wan-type 
# wan-type: PPPOE,PPPOA,FIXED, DHCP
stop_6rd()
{
  local wanIndex=$1
  local wanType=$2
  
  [ "$ipv6_status" = "1" -a "$wan_sixrdwanidx" = "$WAN_CONN" ]  && [ "$IPV6_TUNNEL" = "1" -o "$IPV6_TUNNEL" = "3" ] && {
     if [ "$wanType" = "DHCPC" -o "$wanType" = "FIXED" ]; then
        /etc/rc.d/6rdtunnel.sh stop $wanIndex
     elif [ "$wanType" = "PPPOE" ]; then
        /etc/rc.d/6rdtunnel.sh stop $wanIndex
        if [ "$wan_sixrd_mode" = "0" ]; then
           kill -9 $(cat /var/run/udhcpc${wanIndex}.pid) 2>/dev/null
        fi
     fi 
  }
}

# read_config ppp/ip wanIndex
read_wanService_config()
{
  
  local wanPrefix="wan${1}_${2}"

  eval WAN_IFNAME='$'${wanPrefix}_iface
  eval WAN_L2IFNAME='$'${wanPrefix}_l2ifName
  eval LINK_TYPE='$'${wanPrefix}_linkType
  eval WAN_MODE='$'${wanPrefix}_wanMode
  eval WAN_CONN='$'${wanPrefix}_connName
  eval natEnabled='$'${wanPrefix}_NATEnable
  eval IPV6_TUNNEL='$'${wanPrefix}_tunnel
  eval PWAN_IPV6='$'${wanPrefix}_ipv6

  [ "$1" = "ppp" ] && { 
    ADDR_TYPE=-1
    eval WAN_NAME='$'${wanPrefix}_ifppp
    eval PPP_DEMAND='$'${wanPrefix}_connTrigger
  } || {
     eval ADDR_TYPE='$'${wanPrefix}_addrType
     WAN_NAME=$WAN_IFNAME
     PPP_DEMAND=-1
  }

  ANY_WAN_ENABBLED=0
  if [ "`/usr/sbin/status_oper GET AnyWan status`" == "1" ]; then #check for anywan status
     ANY_WAN_ENABBLED=1
  fi

  NAT_ENABLED=0
  [ -f /usr/sbin/naptcfg -a "$natEnabled" = "1" ] && {
    NAT_ENABLED=1
  }

  NTP_ENABLED=0
  [ "$CONFIG_PACKAGE_NTPCLIENT" = "1" -a "$ntp_fEnable" = "1" ] && [ -r /etc/rc.d/init.d/ntpc ] && {
    NTP_ENABLED=1
  }


  log "WAN_IFNAME=${WAN_IFNAME} WAN_L2IFNAME=${WAN_L2IFNAME} LINK_TYPE=${LINK_TYPE}"
  log "WAN_MODE=${WAN_MODE} WAN_CONN=${WAN_CONN} NAT_ENABLE=${NAT_ENABLED}"
  log "ADDR_TYPE=${ADDR_TYPE} WAN_NAME=${WAN_NAME}"
}

# start_wan_services ppp/ip wanIndex
start_wan_services()
{
  local wanIP
  local wanMask
  local wanIfText
  local strTemp
  local wanIndex=$2
  local wanIPorPPP=$1

  read_wanService_config $1 $2

  local wanPrefix="wan$1$2"
  local wanPrefix2

  [ "$wanIPorPPP" = "ip" ] && {
    wanPrefix2="WanIP$2"
  } || {
    wanPrefix2="WanPPP$2"
  }

  log "Starting WAN services on ${WAN_NAME} interface"

  getwantype wan_type $LINK_TYPE $ADDR_TYPE

  [ "$wan_type" = "UNKNOWN" ] && {
    log "WAN type is unknown"
    return 1
  }

  /usr/sbin/status_oper SET "bringup_${wanPrefix}_services" status start
  # In case of ethernet wan mode for untagged interface we tag the interface with vlan as shown bellow  
  # This is to support simultaneous bridging and routing                 
  if [ "$WAN_L2IFNAME" = "eth1" ]; then
     source /etc/switchports.conf
     eval vlanid=`switch_cli IFX_ETHSW_VLAN_PORT_CFG_GET nPortId=${switch_mii1_port} | grep -w nPortVId | awk '{ print $2 }'`
     WAN_L2IFNAME=eth1.${vlanid}
  fi

  wanIfText=$(/sbin/ifconfig $WAN_NAME)
  strTemp=${wanIfText#*inet addr:}
  wanIP=${strTemp%%' '*}

  strTemp=${wanIfText#*Mask:}
  wanMask=${strTemp%%$'\n'*}

  # get the uptime of the system and store it as the bringup time of this wan connection
  uptime=$(cat /proc/uptime) 
  secs=${uptime%%' '*}
  log "wanIP=${wanIP} wanMask=${wanMask} uptime=${secs}"

  /usr/sbin/status_oper SET "${wanPrefix2}_IF_Info" STATUS CONNECTED \
                        IP "$wanIP" MASK "$wanMask" bringup_time_secs "$secs"

  # Indicate the status of the IP Address Recevied  thru' LED
  # Internet LED - start 
  windex=`/usr/sbin/status_oper GET wan_con_index windex`
  if [ ! -n "`echo $windex | grep $wanIndex`" ]; then
    windex="${windex} ${wanIndex}" 
    /usr/sbin/status_oper SET wan_con_index windex "$windex"
    . /etc/init.d/internet_led_control.sh $WAN_MODE $WAN_NAME

    [ -d /sys/class/leds/internet_red_led/ -a  "$CONFIG_FEATURE_LED_INTERNET_RED" = "1" ] && {
       echo none > /sys/class/leds/internet_red_led/trigger
       echo 0 > /sys/class/leds/internet_red_led/brightness
    }
  fi

  # Get the router (default gateway) ip address from system_status and add the default route with that ip address
  if [ "$default_wan_conn_connName" = "$WAN_CONN" ]; then
    def_gw=`/usr/sbin/status_oper GET ${wanPrefix2}_GATEWAY ROUTER1`
    set_default_gw "$def_gw" $WAN_NAME $wanIP
  fi

  # Setup NAT & Firewall
  if [ "$NAT_ENABLED" = "1" ]; then
    /usr/sbin/naptcfg --ADDWANIP $wanIP
  fi

  if [ ! $CONFIG_FEATURE_IFX_VOIP = "1" -a $CONFIG_FEATURE_NAPT = "1" -a "$CONFIG_FEATURE_ALGS" = "1" ]; then
      iptables -t nat -I PREROUTING -i $WAN_NAME -p udp --dport $ALG_SIP_PORT -j DNAT --to $ALG_SIP_CLIENT
      iptables -t nat -I PREROUTING -i $WAN_NAME -p udp --sport $ALG_SIP_PORT -j DNAT --to $ALG_SIP_CLIENT
  fi


  # Start DNS Relay Daemon
  if  [ "$CONFIG_FEATURE_DNS_RELAY" = "1" -a "$wan_type" != "BRIDGE" ]; then
    . /etc/rc.d/init.d/dns_relay restart $wanIndex
  fi

  sleep 1

  # Start Dnsmasq (DNSv6 Relay) Deamon
  if [ "$CONFIG_PACKAGE_KMOD_IPV6" = "1"  -a  "$ipv6_status" = "1" ]; then
      . /etc/rc.d/bringup_dnsmasq restart $wanIndex "${wanIPorPPP}"
  fi
  
  # If enabled start DDNS
  [ $CONFIG_FEATURE_DDNS = "1" -a "$ddns_enable" = "YES" -a "$ddns_if" = "$WAN_CONN" ] && {
    . /etc/rc.d/init.d/ddns start $wanIndex "${wanIPorPPP}"
  }


  # Setup Static Route
  . /etc/rc.d/rc.bringup_staticRoutes

  # handle the interface specific rip enable or disable
  if [ $ANY_WAN_ENABBLED -eq 0 ]; then #check for anywan
    . /etc/rc.d/init.d/ripd restart

    # Start NTP Client
    [ $NTP_ENABLED -eq 1 ]  && {
       . /etc/rc.d/init.d/ntpc start $wanIndex > /dev/null 2>&1
    }
  fi

  [ "$default_wan_conn_connName" = "$WAN_CONN" ] && {
    local index=0
    while [ $index -lt $lan_main_Count ]; do
    
      eval dhcp_mode='$'lan_main_${index}_dhcpMode
      if [ "$dhcp_mode" = "relay" ]; then
        echo "configuring lan dhcp relay !!"
        . /etc/rc.d/init.d/udhcpd stop  
        . /etc/rc.d/init.d/udhcpd start
        break
      fi
      let index++
    done
  }

  # Applicaion Filtering: DNS should be up by this time
  if [ "$APP_FILTER" = "1" ]; then
  . /etc/rc.d/rc.firewall_app_filter start
  else
  . /etc/rc.d/rc.firewall_app_filter stop
  fi

  # Start VOIP Application
  if [ "$CONFIG_FEATURE_IFX_VOIP" = "1" ]; then
    if [ "$CONFIG_IFX_MODEL_NAME" = "ARX182_GW_EL_FXS_DECT" ]; then
       dect_fw_status=`/usr/sbin/status_oper GET "dect_fw" "status"`
       if [ -n "$dect_fw_status" -a "$dect_fw_status" = "init" ]; then
          /etc/rc.d/rc.bringup_voip_start $wanIndex "${wanIPorPPP}" &
       fi
    else
      /etc/rc.d/rc.bringup_voip_start $wanIndex "${wanIPorPPP}" &
    fi 
  fi

  # PPA config
  if [ "$CONFIG_FEATURE_PPA_SUPPORT" = "1" ]; then
    . /etc/rc.d/ppa_config.sh addwan "$WAN_IFNAME -l $WAN_L2IFNAME"
    [ "$wanIPorPPP" == "ppp" ] && { 
      . /etc/rc.d/ppa_config.sh addwan $WAN_NAME 
    }
  fi

  if [ "$CONFIG_PACKAGE_LTQ_IGMPD" = "1" ]; then
    # Check for WAN_CONN interface in the upstream_wan variable of rc.conf
    echo $mcast_upstream_wan | grep $WAN_CONN
    if [ $? -eq 0 ]; then
      . /etc/rc.d/init.d/igmpd wan_restart
    fi
  fi
  
  #Port binding rule gw addition
  if [ "$CONFIG_FEATURE_PORT_WAN_BINDING" = "1" -a "$port_wan_binding_status_enable" = "1" ]; then
    . /etc/rc.d/ltq_pwb_config.sh "${wanIPorPPP}_add_route" $wanIndex
  fi

  if [ $ANY_WAN_ENABBLED -eq 0 ]; then #check for anywan
    . /etc/rc.d/init.d/ipsec_bringup_tunnels $WAN_CONN
    start_6rd $wanIndex $wan_type $wanIP 
  fi
        if [ "$CONFIG_FEATURE_LTQ_IPQOS" = "1" ]; then
                /etc/rc.d/ipqos_redirect_to_ifb.sh 1 1 $wanIndex $wanIPorPPP
        fi

}

# stop_wan_services ppp/ip wanIndex
stop_wan_services()
{
  local wanIPorPPP=$1
  local wanIndex=$2
  local wanPrefix="wan$1$2"
  local wanPrefix2

  [ "$wanIPorPPP" = "ip" ] && {
    wanPrefix2="WanIP$2"
  } || {
    wanPrefix2="WanPPP$2"
  }

  read_wanService_config $1 $2
  
  log "Starting WAN services on ${WAN_NAME} interface"

  getwantype wan_type $LINK_TYPE $ADDR_TYPE
  [ "$wan_type" = "UNKNOWN" ] && {
    log "WAN type is unknown"
    return 1
  }

  [ "`/usr/sbin/status_oper GET bringup_${wanPrefix}_services status`" = "start" ] && {

    # PPA config
    if [ "$CONFIG_FEATURE_PPA_SUPPORT" = "1" ]; then
       . /etc/rc.d/ppa_config.sh delwan $WAN_NAME
       [ "$wanIPorPPP" == "ppp" ] && { 
         . /etc/rc.d/ppa_config.sh delwan $WAN_IFNAME  
       }
    fi

    [ $ANY_WAN_ENABBLED -eq 0 ] && {
      #
      # If WAN is PPPoE or PPPoA and PPP_DEMAND=1, don't reset DNS server info
      #
      [ "$PPP_DEMAND" = "1" ] && [ "$wan_type" = "PPPOE" -o "$wan_type" = "PPPOA" ] || { 
        /usr/sbin/status_oper SET "${wanPrefix2}_DNS_SERVER" DNS1 0
        if [ "$CONFIG_PACKAGE_KMOD_IPV6" = "1"  -a  "$ipv6_status" = "1" ]; then
           /usr/sbin/status_oper SET "${wanPrefix2}_IF_IPv6_Dns" DNSv61 0 DNSv62 0
        fi
      }

      # Stop DNS Relay Daemon
      if  [ "$CONFIG_FEATURE_DNS_RELAY" = "1" -a "$wan_type" != "BRIDGE" ]; then
        . /etc/rc.d/init.d/dns_relay stop $wanIndex
      fi

      # Stop Dnsmasq (DNSv6 Relay) Deamon
      if [ "$CONFIG_PACKAGE_KMOD_IPV6" = "1"  -a  "$ipv6_status" = "1" ]; then
        . /etc/rc.d/bringup_dnsmasq stop $wanIndex $wanIPorPPP
      fi
      
      # Stop DDNS
      [ $CONFIG_FEATURE_DDNS = "1" -a "$ddns_enable" = "YES" -a "$ddns_if" = "$WAN_CONN" ] && {
        . /etc/rc.d/init.d/ddns stop $wanIndex
      } 

      if [ "$CONFIG_FEATURE_IFX_VOIP" = "1" ]; then
        # Stop the VOIP Application on this WAN interface
        . /etc/rc.d/rc.bringup_voip_stop $wanIndex $wanIPorPPP
      fi

      # Stop NTP Client
      [ $NTP_ENABLED -eq 1 ]  && {
         . /etc/rc.d/init.d/ntpc stop $wanIndex > /dev/null 2>&1
      }
    } 

    [ "$default_wan_conn_connName" = "$WAN_CONN" ] && {
      local index=0
      while [ $index -lt $lan_main_Count ]; do
      
        eval dhcp_mode='$'lan_main_${index}_dhcpMode
        if [ "$dhcp_mode" = "relay" ]; then
          echo "configuring lan dhcp relay !!"
          . /etc/rc.d/init.d/udhcpd stop  
          break
        fi
        let index++
      done
    }

    # Disable Firewall
    if [ "$NAT_ENABLED" = "1" ]; then
        wanIP="`/usr/sbin/status_oper GET "${wanPrefix2}_IF_Info" IP`"
        /usr/sbin/naptcfg --DELWANIP $wanIP > /dev/null
    fi

    # Disable Network Address Translation (NAT)
    if  [ ! "$CONFIG_FEATURE_IFX_VOIP" = "1" -a "$CONFIG_FEATURE_NAPT" = "1" -a "$CONFIG_FEATURE_ALGS" = "1" ]; then
        iptables -t nat -D PREROUTING -i $WAN_NAME -p udp --dport $ALG_SIP_PORT -j DNAT --to $ALG_SIP_CLIENT
        iptables -t nat -D PREROUTING -i $WAN_NAME -p udp --sport $ALG_SIP_PORT -j DNAT --to $ALG_SIP_CLIENT
    fi

    #Port binding rule gw deletion
    if [ "$CONFIG_FEATURE_PORT_WAN_BINDING" = "1" -a "$port_wan_binding_status_enable" = "1" ]; then
      . /etc/rc.d/ltq_pwb_config.sh "${wanIPorPPP}_del_route" $wanIndex
    fi

    /usr/sbin/status_oper SET bringup_${wanPrefix}_services status stop
    /usr/sbin/status_oper SET ${wanPrefix2}_IF_Info STATUS DISCONNECTING

                if [ "$CONFIG_FEATURE_LTQ_IPQOS" = "1" ]; then
                        /etc/rc.d/ipqos_redirect_to_ifb.sh 1 2 $wanIndex $wanIPorPPP
                fi

    [ $ANY_WAN_ENABBLED -eq 0 ] && {
      
      windex="`/usr/sbin/status_oper GET wan_con_index windex`"
      windex=${windex/$wanIndex/' '}
      /usr/sbin/status_oper SET wan_con_index windex "$windex"
      [ -z "$windex" ] && {
        if [ "$CONFIG_FEATURE_LED" = "1" ]; then
          echo none > /sys/class/leds/internet_led/trigger
          echo 0 > /sys/class/leds/internet_led/brightness
        fi      
      }

      /etc/rc.d/init.d/ipsec_bringdown_tunnels $WAN_CONN

      stop_6rd $wanIndex $wan_type 
   
      # Stop DS-LITE 
      [ "$ipv6_status" = "1" -a "$wan_dslitewanidx" = "${WAN_CONN}" -a "$PWAN_IPV6" = "2" ] && {  
        [ "$IPV6_TUNNEL" = "2" -o "$IPV6_TUNNEL" = "3" ] && {
          /etc/rc.d/ds-lite.sh -o stop -i ${wan_dslitewanidx}
        }
      } 
    }
  }

  [ "$wanIPorPPP" = "ip" ] && /sbin/ifconfig $WAN_NAME 0.0.0.0 up
}
