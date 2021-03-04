#!/bin/bash

IP=`hostname -I | awk '{ print $1 }'` docker-compose up -d --build

getopts ":yn" yn
while true; do
    case $yn in
        [Yy]* ) docker exec -it "${PWD##*/}_vw_1" bash; break;;
        [Nn]* ) break;;
        * ) read -p "Do you wish to enter the container?(y/n)" yn;;
    esac
done