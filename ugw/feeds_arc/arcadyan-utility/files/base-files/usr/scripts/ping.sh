#!/bin/sh

if [ -z "$1" ]; then
	echo "error : missing ip address"
elif [ -z "$2" ]; then
	echo "error : missing ping size"
elif [ -z "$3" ]; then
	echo "error : missing save file"
else
	time=`ping $1 -c 1 -s $2`
	echo $time | awk -F'/' '{print $4}' >> $3
#	To improve ping result accuracy
#	ping $1 -c 1 -s $2 | awk -F'/' 'NR==6{print $4}' >> $3
fi


