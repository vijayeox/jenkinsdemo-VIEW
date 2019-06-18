# view build 

FROM node:8-slim

RUN apt-get update
RUN npm install gulp-cli -g
RUN npx -p touch nodetouch gulpfile.js

EXPOSE 8081
WORKDIR /app
