
#!/bin/sh

SMB_PARENT_PID=`ps -o ppid,pid,args|grep smbd|grep "[^0-9]1 "|sed "s/ *1 //"|sed "s/ smbd.*//"`
#echo SAMBA_PARENT_PID=${SMB_PARENT_PID} > /dev/console

doCheckHuntedProcess()
{
	for i in `fuser -m "$1"` ; do 
		ps|grep -w $i|grep -v grep|grep -v "${SMB_PARENT_PID}"; 
	done|grep "ftp\|smbd\|twonky" |grep root
}

#for k in "`ls $1`" ; do
#	doCheckHuntedProcess "${1}/${k}"
#done
doCheckHuntedProcess "${1}"
