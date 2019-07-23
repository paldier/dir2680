
echo "[create-application-cert.sh] input=${1}"
IPV4_ADDR=""
DomainName=""
if [ "${1}" == "" ] ; then
	IPV4_ADDR="0.0.0.0"
else
	IPV4_ADDR="${1}"
fi

DDNS_ENABLE=`ccfg_cli get enable@ddns`
IPV4_ADDRInCert=`ccfg_cli get IPv4_Addr@Certificate`
DomainNameInCert=`ccfg_cli get DomainName@Certificate`
CREATE_NEW_CERTIFICATE_ENABLE="0"
echo "[create-application-cert.sh] DDNS_ENABLE=${DDNS_ENABLE}, IPV4_ADDRInCert=${IPV4_ADDRInCert}, DomainNameInCert=${DomainNameInCert}, IPV4_ADDR=${IPV4_ADDR}"
if [ "${DDNS_ENABLE}" == "1" ] ; then
	echo "[create-application-cert.sh] DDNS enable, set Domain name to Certificate"
	# DDNS enable, reset IPv4_Addr field of Certificate section to 0.0.0.0

	DDNS_SELECT=`ccfg_cli get select@ddns`
	if [ "${DDNS_SELECT}" == "1" ] ; then
		DomainName=`ccfg_cli get hostname1@ddns`
	else
		DomainName=`ccfg_cli get hostname2@ddns`
	fi

	if [ "${IPV4_ADDRInCert}" != "0.0.0.0" ] ; then
		echo "[create-application-cert.sh] DDNS enable, common name filed of the original certificate is IPv4 address, update certificate"
		CREATE_NEW_CERTIFICATE_ENABLE="1"
	else
		if [ "${DomainNameInCert}" == "" -o "${DomainName}" != "${DomainNameInCert}" ] ; then
			echo "[create-application-cert.sh] DDNS enable, DomainNameInCert=\"\" or DomainName != DomainNameInCert, update certificate"
			CREATE_NEW_CERTIFICATE_ENABLE="1"
		fi
	fi

	if [ "${CREATE_NEW_CERTIFICATE_ENABLE}" == "1" ] ; then
		`ccfg_cli set IPv4_Addr@Certificate="0.0.0.0"`
		`ccfg_cli set DomainName@Certificate="${DomainName}"`

		/usr/sbin/create-webserver-cert.sh
		/usr/sbin/create-ftps-cert.sh
	fi
else
	# DDNS disable, set IPV4_ADDR value to Certificate section
	echo "[create-application-cert.sh] DDNS disable, set IPv4 address to Certificate"

	if [ "${IPV4_ADDR}" == "0.0.0.0" ] ; then
		echo "[create-application-cert.sh] DDNS disable, input working IPv4 address can not be 0.0.0.0"
		return
	fi

	if [ "${IPV4_ADDRInCert}" == "0.0.0.0" ] ; then
		echo "[create-application-cert.sh] IPV4_ADDRInCert=0.0.0.0, update certificates"
		CREATE_NEW_CERTIFICATE_ENABLE="1"
	else
		if [ "${IPV4_ADDRInCert}" != "${IPV4_ADDR}" ] ; then
			echo "[create-application-cert.sh] IPV4_ADDRInCert!=IPV4_ADDR, update certificates"
			CREATE_NEW_CERTIFICATE_ENABLE="1"
		fi
	fi

	if [ "${CREATE_NEW_CERTIFICATE_ENABLE}" == "1" ] ; then
		`ccfg_cli set IPv4_Addr@Certificate="${IPV4_ADDR}"`
		`ccfg_cli set DomainName@Certificate=""`

		/usr/sbin/create-webserver-cert.sh
		/usr/sbin/create-ftps-cert.sh
	fi
fi

if [ "`remote_mgnt@httpd`" == 1 ] ; then
	/usr/sbin/httpd-brn -r
fi
