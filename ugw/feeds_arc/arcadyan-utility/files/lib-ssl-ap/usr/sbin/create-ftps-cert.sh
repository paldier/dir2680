
echo "[create-ftps-cert.sh] start"

SECTION_NAME="Certificate"
CERT_PATH=`ccfg_cli get Path@${SECTION_NAME}`
RootCA_DirName=`ccfg_cli get RootCA_DirName@${SECTION_NAME}`
CA_FILENAME="${CERT_PATH}/${RootCA_DirName}/`ccfg_cli get RootCA_Filename@${SECTION_NAME}`"
WebServer_DirName=`ccfg_cli get WebServer_DirName@${SECTION_NAME}`
WebServer_FILENAME="${CERT_PATH}/${WebServer_DirName}/`ccfg_cli get WebServer_Filename@${SECTION_NAME}`"
Ftps_DirName=`ccfg_cli get Ftps_DirName@${SECTION_NAME}`
FILENAME="${CERT_PATH}/${Ftps_DirName}/`ccfg_cli get Ftps_Filename@${SECTION_NAME}`"

echo "[create-ftps-cert.sh] start dump"
echo "SECTION_NAME=${SECTION_NAME}"
echo "CERT_PATH=${CERT_PATH}"
echo "RootCA_DirName=${RootCA_DirName}"
echo "CA_FILENAME=${CA_FILENAME}"
echo "WebServer_DirName=${WebServer_DirName}"
echo "WebServer_FILENAME=${WebServer_FILENAME}"
echo "Ftps_DirName=${Ftps_DirName}"
echo "FILENAME=${FILENAME}"
echo "[create-ftps-cert.sh] end dump"

mkdir -p ${CERT_PATH}/${Ftps_DirName}/
rm -f ${CERT_PATH}/${Ftps_DirName}/*
ln -s ${WebServer_FILENAME}.crt.pem ${FILENAME}.crt.pem
ln -s ${WebServer_FILENAME}.key.pem ${FILENAME}.key.pem
ln -s ${WebServer_FILENAME}.req.pem ${FILENAME}.req.pem

cp ${FILENAME}.key.pem ${CERT_PATH}/${Ftps_DirName}/pure-ftpd.pem
cat ${FILENAME}.crt.pem >> ${CERT_PATH}/${Ftps_DirName}/pure-ftpd.pem

echo "[create-ftps-cert.sh] end"

