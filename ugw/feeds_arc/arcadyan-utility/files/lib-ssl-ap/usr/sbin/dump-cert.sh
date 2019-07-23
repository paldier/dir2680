FULL_FILENAME=$1
FILE_FOUND=`ls ${FULL_FILENAME}`
echo "[dump-cert] FULL_FILENAME=${FULL_FILENAME}, FILE_FOUND=${FILE_FOUND}"
if [ "${FILE_FOUND}" == "" ] ; then
	return
fi
openssl x509 -in ${FULL_FILENAME} -text -noout
