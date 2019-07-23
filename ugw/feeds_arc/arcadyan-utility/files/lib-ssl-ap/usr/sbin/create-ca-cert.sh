
echo "[create-ca-cert.sh]"
return

# If system starts up from factory default, router must create Root CA first.
local FACTORY_DEATULT
FACTORY_DEATULT=`ccfg_cli get factory_default@Certificate`
echo "[create_ca_cert.sh boot] FACTORY_DEATULT=${FACTORY_DEATULT}"
if [ "${FACTORY_DEATULT}" == "1" ] ; then
	/usr/sbin/create-root-ca-cert.sh
	`ccfg_cli set factory_default@Certificate="0"`
fi
