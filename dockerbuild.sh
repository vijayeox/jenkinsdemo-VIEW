#!/bin/bash

cd bos
npm rebuild node-sass
cd ..
./clean.sh
./build.sh
echo build completed successfully
