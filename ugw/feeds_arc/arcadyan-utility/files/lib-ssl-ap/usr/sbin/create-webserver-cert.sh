
echo "[create-webserver-cert.sh] start"

SECTION_NAME="Certificate"
CERT_PATH=`ccfg_cli get Path@${SECTION_NAME}`
RootCA_DirName=`ccfg_cli get RootCA_DirName@${SECTION_NAME}`
CA_FILENAME="${CERT_PATH}/${RootCA_DirName}/`ccfg_cli get RootCA_Filename@${SECTION_NAME}`"
WebServer_DirName=`ccfg_cli get WebServer_DirName@${SECTION_NAME}`
FILENAME="${CERT_PATH}/${WebServer_DirName}/`ccfg_cli get WebServer_Filename@${SECTION_NAME}`"
KEY_LENGTH=`ccfg_cli get WebServer_KeyLength@${SECTION_NAME}`
VALIDITY_PERIOD=`ccfg_cli get WebServer_ValidityPeriod@${SECTION_NAME}`
VALIDITY_PERIOD=`expr ${VALIDITY_PERIOD} \* 365`
COUNTRY=`ccfg_cli get WebServer_Country@${SECTION_NAME}`
STATE=`ccfg_cli get WebServer_State@${SECTION_NAME}`
LOCALITY=`ccfg_cli get WebServer_Locality@${SECTION_NAME}`
ORGANIZATION=`ccfg_cli get WebServer_Organization@${SECTION_NAME}`
ORGANIZATIONAL_UNIT=`ccfg_cli get WebServer_OrganizationalUnit@${SECTION_NAME}`
COMMON_NAME=`ccfg_cli get WebServer_CommonName@${SECTION_NAME}`
SUBJECT_ALTERNATIC_NAME=`ccfg_cli get WebServer_SubjectAlternaticName@${SECTION_NAME}`
IPV4_ADDR=`ccfg_cli get IPv4_Addr@Certificate`
DDNS_ENABLE=`ccfg_cli get enable@ddns`
DomainName=`ccfg_cli get DomainName@Certificate`

echo "[create-webserver-cert.sh] start dump"
echo "SECTION_NAME=${SECTION_NAME}"
echo "CERT_PATH=${CERT_PATH}"
echo "RootCA_DirName=${RootCA_DirName}"
echo "CA_FILENAME=${CA_FILENAME}"
echo "WebServer_DirName=${WebServer_DirName}"
echo "FILENAME=${FILENAME}"
echo "KEY_LENGTH=${KEY_LENGTH}"
echo "VALIDITY_PERIOD=${VALIDITY_PERIOD}"
echo "COUNTRY=${COUNTRY}"
echo "STATE=${STATE}"
echo "LOCALITY=${LOCALITY}"
echo "ORGANIZATION=${ORGANIZATION}"
echo "ORGANIZATIONAL_UNIT=${ORGANIZATIONAL_UNIT}"
echo "COMMON_NAME=${COMMON_NAME}"
echo "SUBJECT_ALTERNATIC_NAME=${SUBJECT_ALTERNATIC_NAME}"
echo "IPV4_ADDR=${IPV4_ADDR}"
echo "DDNS_ENABLE=${DDNS_ENABLE}"
echo "DomainName=${DomainName}"
echo "[create-webserver-cert.sh] end dump"

rm -f ${FILENAME}*
if [ "${DDNS_ENABLE}" == "0" ] ; then
	echo "[create-webserver-cert.sh] start to create IP address Web Server certificate"

	# IP
	openssl genrsa -out ${FILENAME}.key.pem ${KEY_LENGTH}
	openssl req -new -key ${FILENAME}.key.pem -subj "/C=${COUNTRY}/ST=${STATE}/L=${LOCALITY}/O=${ORGANIZATION}/OU=${ORGANIZATIONAL_UNIT}/CN=${IPV4_ADDR}/emailAddress=\'\'" -out ${FILENAME}.req.pem -config /etc/config/cert/openssl.config
	openssl x509 -req -days ${VALIDITY_PERIOD} -sha1 -extfile /etc/config/cert/openssl.config -extensions v3_req -CA ${CA_FILENAME}.crt.pem -CAkey ${CA_FILENAME}.key.pem -CAserial ${CA_FILENAME}.srl -CAcreateserial -in ${FILENAME}.req.pem -out ${FILENAME}.crt.pem
else
	echo "[create-webserver-cert.sh] start to create Domain Name Web Server certificate"

	openssl genrsa -out ${FILENAME}.key.pem ${KEY_LENGTH}
	# DNS by Subject Alternatic Name
	SUBJALTNAME="DNS:${DomainName}" openssl req -new -key ${FILENAME}.key.pem -subj "/C=${COUNTRY}/ST=${STATE}/L=${LOCALITY}/O=${ORGANIZATION}/OU=${ORGANIZATIONAL_UNIT}/CN=${COMMON_NAME}/emailAddress=\'\'" -out ${FILENAME}.req.pem -config /etc/config/cert/openssl-altname.config
	SUBJALTNAME="DNS:${DomainName}" openssl x509 -req -days ${VALIDITY_PERIOD} -sha1 -extfile /etc/config/cert/openssl-altname.config -extensions v3_req -CA ${CA_FILENAME}.crt.pem -CAkey ${CA_FILENAME}.key.pem -CAserial ${CA_FILENAME}.srl -CAcreateserial -in ${FILENAME}.req.pem -out ${FILENAME}.crt.pem

	# DNS by Common Name
	#openssl req -new -key ${FILENAME}.key.pem -subj "/C=${COUNTRY}/ST=${STATE}/L=${LOCALITY}/O=${ORGANIZATION}/OU=${ORGANIZATIONAL_UNIT}/CN=${DomainName}/emailAddress=\'\'" -out ${FILENAME}.req.pem -config /etc/config/cert/openssl.config
	#openssl x509 -req -days ${VALIDITY_PERIOD} -sha1 -extfile /etc/config/cert/openssl.config -extensions v3_req -CA ${CA_FILENAME}.crt.pem -CAkey ${CA_FILENAME}.key.pem -CAserial ${CA_FILENAME}.srl -CAcreateserial -in ${FILENAME}.req.pem -out ${FILENAME}.crt.pem
fi

echo "[create-webserver-cert.sh] end"