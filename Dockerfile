#view build

FROM node:8-alpine

RUN apk update \
    && apk add bash
    && apk add python

EXPOSE 8081
WORKDIR /app
