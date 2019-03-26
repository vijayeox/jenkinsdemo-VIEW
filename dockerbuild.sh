#!/bin/bash

cd bos
npm rebuild node-sass
cd ..
./build.sh
echo build completed successfully
