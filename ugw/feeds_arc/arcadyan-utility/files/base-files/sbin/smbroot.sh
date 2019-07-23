#!/bin/sh

killall nmbd
killall smbd
killall vsftpd

cat << 'EOF1' > /tmp/samba/lib/smb.conf
[global]
security = share
log file = /var/log/samba.log
socket options = TCP_NODELAY SO_RCVBUF=16384 SO_SNDBUF=8192
interfaces = br0
hosts allow = 192.168.1.0/255.255.255.0
os level = 20

[root]
path = /
force user = root
force group = root
writeable = yes
guest ok = yes
EOF1

nmbd -D -s /tmp/samba/lib/smb.conf
smbd -s /tmp/samba/lib/smb.conf

cat << 'EOF2' > /tmp/vsftpd.conf
anonymous_enable=YES
write_enable=YES
anon_world_readable_only=NO
anon_upload_enable=YES
anon_mkdir_write_enable=YES
anon_other_write_enable=YES
anon_root=/
ftpd_banner=Welcome to O2-HB2 Router's FTP service
chroot_local_user=YES
local_umask=002
listen=YES
ftp_username=root
listen_port=21
pasv_min_port=65000
pasv_max_port=65009
# Performance
idle_session_timeout=120
data_connection_timeout=300
accept_timeout=60
connect_timeout=60
anon_max_rate=800000
max_clients=20
ftp_characterset=0
EOF2

vsftpd /tmp/vsftpd.conf &

