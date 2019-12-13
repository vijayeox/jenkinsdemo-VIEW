#!/bin/bash
echo "building view"
cd bos
#npm rebuild node-sass
cd ..
./clean.sh
./build.sh gui
./build.sh iconpacks
./build.sh themes
./build.sh apps "Admin, Preferences"
./build.sh bos
echo build completed successfully
