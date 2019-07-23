echo "[restore-certificates.sh] start"

mkdir -p /etc/config/cert/Ftps
rm -Rf /etc/config/cert/Ftps/*
ln -s /etc/config/cert/WebServer/webserver.crt.pem /etc/config/cert/Ftps/ftps.crt.pem
ln -s /etc/config/cert/WebServer/webserver.key.pem /etc/config/cert/Ftps/ftps.key.pem
ln -s /etc/config/cert/WebServer/webserver.req.pem /etc/config/cert/Ftps/ftps.req.pem

cp /etc/config/cert/Ftps/ftps.key.pem /etc/config/cert/Ftps/pure-ftpd.pem
cat /etc/config/cert/Ftps/ftps.crt.pem >> /etc/config/cert/Ftps/pure-ftpd.pem
