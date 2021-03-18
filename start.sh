#!/bin/bash

if [ ! -e ./view_built ]; then
	IP=`hostname -I | awk '{ print $1 }'` docker-compose up --build
else
    IP=`hostname -I | awk '{ print $1 }'` docker-compose up -d --build

    getopts ":yn" yn
    while true; do
        case $yn in
            [Yy]* ) dirName="$(tr [A-Z] [a-z] <<< "${PWD##*/}")"; docker exec -it "${dirName//_}_vw_1" bash; break;;
            [Nn]* ) break;;
            * ) read -p "Do you wish to enter the container?(y/n)" yn;;
        esac
    done
fi
