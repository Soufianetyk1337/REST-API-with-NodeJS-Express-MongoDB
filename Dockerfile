# syntax=docker/dockerfile:1
FROM ubuntu:bionic as dependencies

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y \
    openssl \
    FROM node:14-slim as base
WORKDIR /usr/src/app
COPY ./package.json ./
COPY ./yarn.lock ./ 
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
    then yarn install; \
    else yarn install --only=production; \
    fi
COPY . .
ENV PORT 8080
EXPOSE ${PORT}
CMD [ "yarn" , "run" , "dev" ]
