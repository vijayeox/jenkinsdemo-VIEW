#!/bin/bash

cd bos
npm rebuild node-sass
cd ..
./clean.sh
./build.sh bos
./build.sh gui
./build.sh iconpacks
./build.sh themes
./build.sh apps "Admin, Announcements, Calculator, Calendar, Chat, Contacts, CRM, ImageUploader, Mail, MailAdmin, Preferences"
echo build completed successfully
