#!/bin/bash
clean_projects(){
    cd $1
    for D in $(find . -mindepth 1 -maxdepth 1 -type d) ; do
        clean_project $D
    done
    cd ..
}
clean_project() {
    echo "Cleaning $1 ...";
    cd $1
    rm -Rf dist
    mkdir dist
    cd ..
}
APPS="apps"
BOS="bos"
ICON_PACKS="iconpacks"
THEMES="themes"

clean_projects $APPS
clean_projects $ICON_PACKS
clean_projects $THEMES
clean_project $BOS