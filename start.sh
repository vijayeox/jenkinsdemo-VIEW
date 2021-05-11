#!/bin/bash

dirName="$(tr [A-Z] [a-z] <<< "${PWD##*/}")"
echo "Stopping container if already running..."
docker stop "${dirName//_}_vw_1"

IP=`hostname -I | awk '{ print $1 }'`

while getopts "h:YyNn" options
do
	case $options in
			h ) IP=$OPTARG;;
		[Yy]* ) startBash=y;;
		[Nn]* ) startBash=n;;
	esac
done

chmod 777 -R ./set-docker-env.sh

if [ ! -e ./view_built ]; then
	IP="$IP" docker-compose up --build
else
	IP="$IP" docker-compose up -d --build
fi

echo "View is being served in the background on port 8081."

while true; do
	case $startBash in
		[Yy]* ) docker exec -it "${dirName//_}_vw_1" bash; break;;
		[Nn]* ) break;;
			* ) read -p "Do you wish to enter the container?(y/n)" startBash;;
	esac
done