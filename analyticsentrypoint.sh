#!/bin/bash
echo "building view"
cd bos
#npm rebuild node-sass
cd ..
./clean.sh
./build.sh gui
./build.sh iconpacks
./build.sh themes
./build.sh apps "Calculator, Analytics"
rm -Rf apps/Admin
rm -Rf apps/Announcements
rm -Rf apps/Chat
rm -Rf apps/Mail
rm -Rf apps/MailAdmin
rm -Rf apps/HelpApp
rm -Rf apps/DocumentManager
rm -Rf apps/Calculator
rm -Rf apps/CRM
rm -Rf apps/CRMAdmin
rm -Rf apps/Dashboard
rm -Rf apps/Calendar
rm -Rf apps/Task
rm -Rf apps/Contacts
rm -Rf apps/TaskAdmin
rm -Rf apps/Textpad
rm -Rf apps/Demo
rm -Rf apps/Preferences
./build.sh bos
echo build completed successfully
