#!/bin/bash

cd view/bos
npm rebuild node-sass
cd ..
./clean.sh
./build.sh gui
./build.sh iconpacks
./build.sh themes
./build.sh apps "Admin, Announcements, Calculator, Calendar, Chat, Contacts, CRM, CRMAdmin, HelpApp, ImageUploader, Mail, MailAdmin, Preferences,Task, TaskAdmin, Analytics"
./build.sh bos
echo build completed successfully
