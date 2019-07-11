#!/bin/bash

cd bos
npm rebuild node-sass
cd ..
./clean.sh
./build.sh gui
./build.sh iconpacks
./build.sh themes
./build.sh apps "Admin, Announcements, Calculator, Calendar, Chat, Contacts, CRM, ImageUploader, Mail, MailAdmin, Preferences"
./build.sh bos
echo build completed successfully
