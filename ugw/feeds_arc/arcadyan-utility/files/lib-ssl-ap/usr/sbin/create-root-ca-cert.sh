
echo "[create-rootca-cert.sh] start"

SECTION_NAME="Certificate"
CERT_PATH=`ccfg_cli get Path@${SECTION_NAME}`
RootCA_DirName=`ccfg_cli get RootCA_DirName@${SECTION_NAME}`
FILENAME="${CERT_PATH}/${RootCA_DirName}/`ccfg_cli get RootCA_Filename@${SECTION_NAME}`"
KEY_LENGTH=`ccfg_cli get RootCA_KeyLength@${SECTION_NAME}`
VALIDITY_PERIOD=`ccfg_cli get RootCA_ValidityPeriod@${SECTION_NAME}`
VALIDITY_PERIOD=`expr ${VALIDITY_PERIOD} \* 365`
COUNTRY=`ccfg_cli get RootCA_Country@${SECTION_NAME}`
STATE=`ccfg_cli get RootCA_State@${SECTION_NAME}`
LOCALITY=`ccfg_cli get RootCA_Locality@${SECTION_NAME}`
ORGANIZATION=`ccfg_cli get RootCA_Organization@${SECTION_NAME}`
ORGANIZATIONAL_UNIT=`ccfg_cli get RootCA_OrganizationalUnit@${SECTION_NAME}`
COMMON_NAME=`ccfg_cli get RootCA_CommonName@${SECTION_NAME}`
SUBJECT_ALTERNATIC_NAME=`ccfg_cli get RootCA_SubjectAlternaticName@${SECTION_NAME}`

echo "[create-root-ca-cert.sh] start dump"
echo "SECTION_NAME=${SECTION_NAME}"
echo "CERT_PATH=${CERT_PATH}"
echo "RootCA_DirName=${RootCADirName}"
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
echo "[create-root-ca-cert.sh] end dump"

##FULL_FILENAME="${FILENAME}.crt.pem"
##FILE_FOUND=`ls ${FULL_FILENAME}`
##echo "[create-root-ca-cert.sh] FULL_FILENAME=${FULL_FILENAME}, FILE_FOUND=${FILE_FOUND}"
##if [ "${FILE_FOUND}" == "" ] ; then
##	return
##fi

rm -f $FILENAME}*

echo "[create-root-ca-cert.sh] start to create Root CA certificate"
openssl genrsa -out ${FILENAME}.key.pem ${KEY_LENGTH}
openssl req -new -key ${FILENAME}.key.pem -subj "/C=${COUNTRY}/ST=${STATE}/L=${LOCALITY}/O=${ORGANIZATION}/OU=${ORGANIZATIONAL_UNIT}/CN=${COMMON_NAME}/emailAddress=\'\'" -out ${FILENAME}.req.pem -config /etc/config/cert/openssl.config
openssl x509 -req -days ${VALIDITY_PERIOD} -sha1 -extfile /etc/config/cert/openssl.config -extensions v3_ca -signkey ${FILENAME}.key.pem -in ${FILENAME}.req.pem -out ${FILENAME}.crt.pem

/usr/sbin/create-webserver-cert.sh
/usr/sbin/create-ftps-cert.sh

echo "[create-rootca-cert.sh] end"
